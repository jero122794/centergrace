// apps/api/src/modules/courses/application/use-cases/CourseUseCases.ts
import type { Prisma, Role } from '@prisma/client';
import { prisma, USER_PUBLIC_SELECT } from '../../../../shared/config/prisma';
import { AppError } from '../../../../shared/utils/app-error';
import { YoutubeOEmbedAdapter } from '../../infrastructure/adapters/YoutubeOEmbedAdapter';
import { PushNotificationService } from '../../../notifications/infrastructure/PushNotificationService';

export class CourseUseCases {
  constructor(
    private readonly youtube = new YoutubeOEmbedAdapter(),
    private readonly push = new PushNotificationService(),
  ) {}

  async list(actor: { id: string; role: Role }) {
    const where = await this.visibilityWhere(actor);
    return prisma.course.findMany({
      where,
      include: { _count: { select: { lessons: true, enrollments: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(actor: { id: string; role: Role }, id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: { orderBy: { order: 'asc' }, include: { lessons: { orderBy: { order: 'asc' } } } },
        lessons: { orderBy: { order: 'asc' } },
      },
    });
    if (!course) {
      throw AppError.notFound('Course not found');
    }
    await this.assertCanView(actor, course);
    return course;
  }

  async create(actor: { id: string; role: Role }, input: Prisma.CourseUncheckedCreateInput & { groupId?: string }) {
    if (actor.role === 'STUDENT') {
      throw AppError.forbidden();
    }
    if (input.scope === 'GLOBAL' && actor.role === 'LEADER') {
      throw AppError.forbidden('Leaders cannot publish GLOBAL content directly');
    }
    const { groupId, ...data } = input;
    const course = await prisma.course.create({
      data: { ...data, createdById: actor.id, scope: data.scope ?? 'GROUP' },
    });
    if (groupId) {
      await prisma.groupCourse.create({
        data: { groupId, courseId: course.id, assignedBy: actor.id },
      });
    }
    return course;
  }

  async addModule(courseId: string, title: string, order: number) {
    return prisma.courseModule.create({ data: { courseId, title, order } });
  }

  async previewYoutube(url: string) {
    return this.youtube.resolve(url);
  }

  async getLesson(actor: { id: string; role: Role }, lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });
    if (!lesson) {
      throw AppError.notFound('Lesson not found');
    }
    await this.assertCanView(actor, lesson.course);
    if (actor.role === 'STUDENT' && lesson.status !== 'PUBLISHED') {
      throw AppError.notFound('Lesson not found');
    }
    return lesson;
  }

  async updateLesson(
    actor: { id: string; role: Role },
    lessonId: string,
    input: {
      title?: string;
      bodyContent?: unknown;
      moduleId?: string | null;
      youtubeUrl?: string;
      order?: number;
      status?: 'DRAFT' | 'PUBLISHED';
      hasAssignment?: boolean;
      assignmentDescription?: string | null;
    },
  ) {
    const lesson = await this.getLesson(actor, lessonId);
    if (actor.role === 'STUDENT') {
      throw AppError.forbidden();
    }
    if (actor.role === 'LEADER' && lesson.course.createdById !== actor.id) {
      throw AppError.forbidden();
    }
    const youtube =
      input.youtubeUrl === undefined
        ? undefined
        : input.youtubeUrl.length > 0
          ? await this.youtube.resolve(input.youtubeUrl)
          : { youtubeId: null, youtubeTitle: null, youtubeThumbnail: null };
    return prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: input.title,
        bodyContent: input.bodyContent as Prisma.InputJsonValue | undefined,
        moduleId: input.moduleId === undefined ? undefined : input.moduleId,
        order: input.order,
        status: input.status,
        hasAssignment: input.hasAssignment,
        assignmentDescription: input.assignmentDescription,
        ...(youtube
          ? {
              youtubeId: youtube.youtubeId,
              youtubeTitle: youtube.youtubeTitle,
              youtubeThumbnail: youtube.youtubeThumbnail,
            }
          : {}),
      },
    });
  }

  async addLesson(
    actor: { id: string; role: Role },
    courseId: string,
    input: {
      title: string;
      bodyContent: unknown;
      moduleId?: string;
      youtubeUrl?: string;
      order: number;
      status?: 'DRAFT' | 'PUBLISHED';
      hasAssignment?: boolean;
      assignmentDescription?: string;
    },
  ) {
    await this.getById(actor, courseId);
    const youtube = input.youtubeUrl ? await this.youtube.resolve(input.youtubeUrl) : null;
    return prisma.lesson.create({
      data: {
        courseId,
        moduleId: input.moduleId,
        title: input.title,
        bodyContent: input.bodyContent as Prisma.InputJsonValue,
        order: input.order,
        status: input.status ?? 'DRAFT',
        hasAssignment: input.hasAssignment ?? false,
        assignmentDescription: input.assignmentDescription,
        youtubeId: youtube?.youtubeId,
        youtubeTitle: youtube?.youtubeTitle,
        youtubeThumbnail: youtube?.youtubeThumbnail,
      },
    });
  }

  async enroll(actor: { id: string; role: Role }, courseId: string, userId: string) {
    await this.getById(actor, courseId);
    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: { userId, courseId },
    });
    await this.push.sendToUser(userId, {
      title: 'Inscripción a curso',
      body: 'Has sido inscrito en un nuevo curso',
      url: `/cursos/${courseId}`,
    });
    return enrollment;
  }

  async completeLesson(userId: string, lessonId: string) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson || lesson.status !== 'PUBLISHED') {
      throw AppError.notFound('Lesson not found');
    }
    return prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { completed: true, viewedAt: new Date() },
      create: { userId, lessonId, completed: true },
    });
  }

  async progress(userId: string, courseId: string) {
    const published = await prisma.lesson.count({ where: { courseId, status: 'PUBLISHED' } });
    const completed = await prisma.lessonProgress.count({
      where: { userId, completed: true, lesson: { courseId, status: 'PUBLISHED' } },
    });
    const percent = published === 0 ? 0 : Math.round((completed / published) * 100);
    return { lessonsCompleted: completed, totalPublishedLessons: published, percent };
  }

  async promoteScope(courseId: string, scope: 'GLOBAL' | 'GROUP') {
    return prisma.course.update({ where: { id: courseId }, data: { scope } });
  }

  private async visibilityWhere(actor: { id: string; role: Role }): Promise<Prisma.CourseWhereInput> {
    if (actor.role === 'ADMIN' || actor.role === 'DEVELOPER') {
      return {};
    }
    if (actor.role === 'LEADER') {
      return { createdById: actor.id };
    }
    const memberships = await prisma.groupMembership.findMany({
      where: { userId: actor.id, status: 'ACTIVE' },
      select: { groupId: true },
    });
    return {
      isActive: true,
      OR: [
        { scope: 'GLOBAL' },
        { groups: { some: { groupId: { in: memberships.map((item) => item.groupId) } } } },
        { enrollments: { some: { userId: actor.id } } },
      ],
    };
  }

  private async assertCanView(
    actor: { id: string; role: Role },
    course: { id: string; createdById: string; scope: string },
  ) {
    if (actor.role === 'ADMIN' || actor.role === 'DEVELOPER' || course.createdById === actor.id) {
      return;
    }
    if (course.scope === 'GLOBAL') {
      return;
    }
    const enrolled = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: actor.id, courseId: course.id } },
    });
    if (enrolled) {
      return;
    }
    const visible = await this.list(actor);
    if (!visible.some((item) => item.id === course.id)) {
      throw AppError.forbidden();
    }
  }
}

export const userPublic = USER_PUBLIC_SELECT;
