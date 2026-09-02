// apps/api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  APP_NAME,
  BCRYPT_ROUNDS,
  DEFAULT_ACCENT_COLOR,
  DEFAULT_PRIMARY_COLOR,
} from '../src/shared/config/constants';

const prisma = new PrismaClient();

const hash = (plain: string): Promise<string> => bcrypt.hash(plain, BCRYPT_ROUNDS);

const TIPTAP_PARAGRAPH = (text: string) => ({
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
});

const SONG_CHORDS = {
  sections: [
    { name: 'Verse', lines: [{ lyrics: 'Santo, santo, santo', chords: ['G', 'D', 'Em', 'C'] }] },
    { name: 'Chorus', lines: [{ lyrics: 'Cuan grande es Dios', chords: ['C', 'G', 'D', 'G'] }] },
  ],
};

async function seed(): Promise<void> {
  await prisma.jobRun.deleteMany();
  await prisma.systemLog.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.inAppNotification.deleteMany();
  await prisma.pushSubscription.deleteMany();
  await prisma.participationAnswer.deleteMany();
  await prisma.participation.deleteMany();
  await prisma.devotionalQuestion.deleteMany();
  await prisma.groupDevotional.deleteMany();
  await prisma.devotional.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.groupCourse.deleteMany();
  await prisma.worshipSchoolCourse.deleteMany();
  await prisma.course.deleteMany();
  await prisma.spiritualNote.deleteMany();
  await prisma.groupMembership.deleteMany();
  await prisma.ministryMembership.deleteMany();
  await prisma.rehearsalAttendance.deleteMany();
  await prisma.rehearsalSong.deleteMany();
  await prisma.rehearsal.deleteMany();
  await prisma.song.deleteMany();
  await prisma.audition.deleteMany();
  await prisma.ministryMemberRole.deleteMany();
  await prisma.worshipSchoolEnrollment.deleteMany();
  await prisma.worshipSchoolConfig.deleteMany();
  await prisma.group.deleteMany();
  await prisma.ministry.deleteMany();
  await prisma.churchSetting.deleteMany();
  await prisma.user.deleteMany();

  const [devHash, adminHash, leaderHash, studentHash] = await Promise.all([
    hash('Dev123!$'),
    hash('Admin123!'),
    hash('Lider123!'),
    hash('Estudiante123!'),
  ]);

  const developer = await prisma.user.create({
    data: {
      name: 'Desarrollador Shalom',
      email: 'dev@iglesia.com',
      passwordHash: devHash,
      role: 'DEVELOPER',
    },
  });
  const admin = await prisma.user.create({
    data: {
      name: 'Pastor Admin',
      email: 'admin@iglesia.com',
      passwordHash: adminHash,
      role: 'ADMIN',
      createdById: developer.id,
    },
  });
  const leader = await prisma.user.create({
    data: {
      name: 'Líder de Alabanza',
      email: 'lider@iglesia.com',
      passwordHash: leaderHash,
      role: 'LEADER',
      createdById: admin.id,
    },
  });
  const student = await prisma.user.create({
    data: {
      name: 'Estudiante Shalom',
      email: 'estudiante@iglesia.com',
      passwordHash: studentHash,
      role: 'STUDENT',
      createdById: leader.id,
    },
  });

  await prisma.churchSetting.create({
    data: {
      id: 'singleton',
      churchName: APP_NAME,
      primaryColor: DEFAULT_PRIMARY_COLOR,
      accentColor: DEFAULT_ACCENT_COLOR,
    },
  });

  const ministry = await prisma.ministry.create({
    data: {
      name: 'Ministerio de Alabanza',
      description: 'Adoración y música de Centro Misionero Shalom',
      type: 'MINISTRY',
      leaderId: leader.id,
      createdById: admin.id,
    },
  });

  const group = await prisma.group.create({
    data: {
      name: 'Célula Norte',
      description: 'Grupo de estudio bíblico de nuevos miembros',
      type: 'CELL',
      ministryId: ministry.id,
      leaderId: leader.id,
      createdById: leader.id,
    },
  });

  await prisma.groupMembership.create({
    data: { userId: student.id, groupId: group.id, addedById: leader.id },
  });
  await prisma.ministryMembership.create({
    data: { userId: student.id, ministryId: ministry.id, addedById: leader.id, status: 'PENDING' },
  });
  await prisma.ministryMembership.create({
    data: { userId: leader.id, ministryId: ministry.id, addedById: admin.id },
  });

  const course = await prisma.course.create({
    data: {
      title: 'Fundamentos de la Fe',
      description: 'Curso introductorio para nuevos miembros de Centro Misionero Shalom',
      scope: 'GROUP',
      createdById: leader.id,
    },
  });
  await prisma.groupCourse.create({
    data: { groupId: group.id, courseId: course.id, assignedBy: leader.id },
  });
  const module = await prisma.courseModule.create({
    data: { courseId: course.id, title: 'Unidad 1 — El Evangelio', order: 1 },
  });
  const lessonOne = await prisma.lesson.create({
    data: {
      courseId: course.id,
      moduleId: module.id,
      title: 'La gracia de Dios',
      bodyContent: TIPTAP_PARAGRAPH(
        'Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios. Efesios 2:8.',
      ),
      order: 1,
      status: 'PUBLISHED',
    },
  });
  const lessonTwo = await prisma.lesson.create({
    data: {
      courseId: course.id,
      moduleId: module.id,
      title: 'El llamado al discipulado',
      bodyContent: TIPTAP_PARAGRAPH('Elabora un testimonio escrito de 300 palabras sobre tu encuentro con Cristo.'),
      order: 2,
      status: 'PUBLISHED',
      hasAssignment: true,
      assignmentDescription: 'Escribe tu testimonio personal y súbelo antes del domingo.',
    },
  });

  await prisma.enrollment.create({ data: { userId: student.id, courseId: course.id } });
  await prisma.lessonProgress.create({
    data: { userId: student.id, lessonId: lessonOne.id, completed: true },
  });

  const submission = await prisma.submission.create({
    data: {
      lessonId: lessonTwo.id,
      userId: student.id,
      content: 'Mi testimonio es que Cristo restauró mi vida en Centro Misionero Shalom.',
      status: 'PENDING',
    },
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const devotional = await prisma.devotional.create({
    data: {
      authorId: leader.id,
      title: 'Confía en el Señor de todo corazón',
      content: TIPTAP_PARAGRAPH('Proverbios 3:5-6 nos invita a no apoyarnos en nuestro propio entendimiento.'),
      verse: 'Proverbios 3:5-6',
      date: today,
      scope: 'GROUP',
      status: 'PUBLISHED',
    },
  });
  const question = await prisma.devotionalQuestion.create({
    data: { devotionalId: devotional.id, text: '¿En qué área necesitas confiar más en Dios hoy?', order: 1 },
  });
  await prisma.groupDevotional.create({ data: { groupId: group.id, devotionalId: devotional.id } });
  const participation = await prisma.participation.create({
    data: {
      devotionalId: devotional.id,
      userId: student.id,
      content: 'Quiero confiar a Dios el área laboral de mi familia.',
    },
  });
  await prisma.participationAnswer.create({
    data: {
      participationId: participation.id,
      questionId: question.id,
      answer: 'En las finanzas del hogar.',
    },
  });

  await prisma.spiritualNote.create({
    data: {
      userId: student.id,
      leaderId: leader.id,
      groupId: group.id,
      content: 'Muestra hambre espiritual y constancia en la célula.',
    },
  });
  await prisma.inAppNotification.create({
    data: {
      userId: student.id,
      title: 'Bienvenido a Shalom',
      body: 'Tu curso Fundamentos de la Fe ya está disponible.',
      url: '/cursos',
    },
  });

  const song = await prisma.song.create({
    data: {
      ministryId: ministry.id,
      title: 'Cuan grande es Dios',
      artist: 'Hillsong',
      originalKey: 'G',
      chords: SONG_CHORDS,
      lyrics: 'Cuan grande es Dios, cántenle, cuan grande es Dios.',
      tags: ['adoración', 'clásico'],
      createdById: leader.id,
    },
  });
  const rehearsalDate = new Date();
  rehearsalDate.setUTCDate(rehearsalDate.getUTCDate() + 1);
  const rehearsal = await prisma.rehearsal.create({
    data: {
      ministryId: ministry.id,
      date: rehearsalDate,
      location: 'Salón principal',
      notes: 'Ensayo general del domingo',
      createdById: leader.id,
    },
  });
  await prisma.rehearsalSong.create({
    data: { rehearsalId: rehearsal.id, songId: song.id, order: 1, key: 'A', isReady: false },
  });
  await prisma.audition.create({
    data: { userId: student.id, ministryId: ministry.id, status: 'SCHOOL', musicalRole: 'VOCALIST' },
  });
  await prisma.worshipSchoolConfig.create({
    data: {
      ministryId: ministry.id,
      minProgress: 80,
      requiredCourses: { create: [{ courseId: course.id }] },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'SEED',
      entity: 'Platform',
      entityId: 'initial',
      metadata: { submissionId: submission.id },
    },
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
