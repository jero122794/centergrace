// apps/api/src/test/reset-db.ts
import { prisma } from '../shared/config/prisma';

/**
 * Clears relational tables so each integration file starts from a blank church.
 */
export const resetDatabase = async (): Promise<void> => {
  await prisma.jobRun.deleteMany();
  await prisma.systemLog.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.refreshToken.deleteMany();
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
};
