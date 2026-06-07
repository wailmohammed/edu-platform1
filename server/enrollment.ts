import { eq, and, or, like, desc, asc, sql } from "drizzle-orm";
import { getDb } from "./db";
import {
  courses,
  userProgress,
  lessonCompletion,
  certificates,
  badges,
  userBadges,
  subscriptions,
  users,
  lessons,
} from "../drizzle/schema";
import { nanoid } from "nanoid";

/**
 * Enrollment Service
 */
export const enrollmentService = {
  /**
   * Enroll a user in a course
   */
  async enrollCourse(userId: number, courseId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Check if already enrolled
    const existing = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.courseId, courseId)))
      .limit(1);

    if (existing.length > 0) {
      return { success: true, alreadyEnrolled: true, progress: existing[0] };
    }

    // Get course info to get total lessons
    const courseRecord = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (courseRecord.length === 0) {
      throw new Error("Course not found");
    }

    const course = courseRecord[0];

    // Create enrollment
    await db.insert(userProgress).values({
      userId,
      courseId,
      completedLessons: 0,
      totalLessons: course.totalLessons || 0,
      progressPercentage: "0.00",
      status: "in-progress",
      startedAt: new Date(),
    });

    // Increment enrollment count
    await db
      .update(courses)
      .set({ enrollmentCount: sql`enrollmentCount + 1` })
      .where(eq(courses.id, courseId));

    const newProgress = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.courseId, courseId)))
      .limit(1);

    return { success: true, alreadyEnrolled: false, progress: newProgress[0] };
  },

  /**
   * Get all courses with user enrollment status
   */
  async getCoursesWithEnrollment(userId: number | null) {
    const db = await getDb();
    if (!db) return [];

    const allCourses = await db
      .select()
      .from(courses)
      .orderBy(asc(courses.displayOrder));

    if (!userId) return allCourses.map((c) => ({ ...c, isEnrolled: false, progress: null }));

    const userProgressRecords = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    const progressMap = new Map(userProgressRecords.map((p) => [p.courseId, p]));

    return allCourses.map((course) => ({
      ...course,
      isEnrolled: progressMap.has(course.id),
      progress: progressMap.get(course.id) || null,
    }));
  },

  /**
   * Mark lesson as complete and update course progress
   */
  async completeLesson(userId: number, lessonId: number, courseId: number, xpEarned: number = 10) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Mark lesson complete
    const existingCompletion = await db
      .select()
      .from(lessonCompletion)
      .where(and(eq(lessonCompletion.userId, userId), eq(lessonCompletion.lessonId, lessonId)))
      .limit(1);

    if (existingCompletion.length === 0) {
      await db.insert(lessonCompletion).values({
        userId,
        lessonId,
        completed: true,
        xpEarned,
        completedAt: new Date(),
      });
    }

    // Count completed lessons for this course
    const completedLessonsForCourse = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(lessonCompletion)
      .innerJoin(lessons, eq(lessonCompletion.lessonId, lessons.id))
      .where(
        and(
          eq(lessonCompletion.userId, userId),
          eq(lessons.courseId, courseId),
          eq(lessonCompletion.completed, true)
        )
      );

    const completedCount = Number(completedLessonsForCourse[0]?.count || 0);

    // Get course info
    const courseRecord = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    const totalLessons = courseRecord[0]?.totalLessons || 1;
    const progressPct = Math.min(100, (completedCount / totalLessons) * 100).toFixed(2);
    const isCompleted = completedCount >= totalLessons;

    // Update user progress
    const existingProgress = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.courseId, courseId)))
      .limit(1);

    if (existingProgress.length > 0) {
      await db
        .update(userProgress)
        .set({
          completedLessons: completedCount,
          progressPercentage: progressPct,
          status: isCompleted ? "completed" : "in-progress",
          completedAt: isCompleted ? new Date() : undefined,
        })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.courseId, courseId)));
    } else {
      await db.insert(userProgress).values({
        userId,
        courseId,
        completedLessons: completedCount,
        totalLessons,
        progressPercentage: progressPct,
        status: isCompleted ? "completed" : "in-progress",
        startedAt: new Date(),
        completedAt: isCompleted ? new Date() : undefined,
      });
    }

    // Award XP to user
    await db
      .update(users)
      .set({ totalXP: sql`totalXP + ${xpEarned}` })
      .where(eq(users.id, userId));

    // If course completed, award certificate
    if (isCompleted) {
      await this.awardCourseCompletion(userId, courseId);
    }

    return {
      success: true,
      completedLessons: completedCount,
      totalLessons,
      progressPercentage: Number(progressPct),
      courseCompleted: isCompleted,
    };
  },

  /**
   * Award completion certificate and badge
   */
  async awardCourseCompletion(userId: number, courseId: number) {
    const db = await getDb();
    if (!db) return;

    // Check if certificate already exists
    const existingCert = await db
      .select()
      .from(certificates)
      .where(and(eq(certificates.userId, userId), eq(certificates.courseId, courseId)))
      .limit(1);

    if (existingCert.length > 0) return existingCert[0];

    const certNumber = `CERT-${userId}-${courseId}-${Date.now()}`;
    await db.insert(certificates).values({
      userId,
      courseId,
      certificateNumber: certNumber,
      issuedAt: new Date(),
    });

    // Award course completion badge
    const completionBadge = await db
      .select()
      .from(badges)
      .where(eq(badges.slug, "course-complete"))
      .limit(1);

    if (completionBadge.length > 0) {
      const existingBadge = await db
        .select()
        .from(userBadges)
        .where(
          and(eq(userBadges.userId, userId), eq(userBadges.badgeId, completionBadge[0].id))
        )
        .limit(1);

      if (existingBadge.length === 0) {
        await db.insert(userBadges).values({
          userId,
          badgeId: completionBadge[0].id,
          earnedAt: new Date(),
        });
      }
    }

    return { certificateNumber: certNumber };
  },

  /**
   * Get user's certificates with course info
   */
  async getUserCertificatesWithCourses(userId: number) {
    const db = await getDb();
    if (!db) return [];

    const certs = await db
      .select()
      .from(certificates)
      .where(eq(certificates.userId, userId))
      .orderBy(desc(certificates.issuedAt));

    const courseIds = certs.map((c) => c.courseId);
    if (courseIds.length === 0) return [];

    const courseList = await db
      .select()
      .from(courses)
      .where(sql`id IN (${sql.join(courseIds.map((id) => sql`${id}`), sql`, `)})`);

    const courseMap = new Map(courseList.map((c) => [c.id, c]));

    return certs.map((cert) => ({
      ...cert,
      course: courseMap.get(cert.courseId) || null,
    }));
  },

  /**
   * Simulate premium upgrade (no real Stripe in dev)
   */
  async upgradeToPremium(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Check existing subscription
    const existing = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    const now = new Date();
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    if (existing.length > 0) {
      await db
        .update(subscriptions)
        .set({ status: "active", plan: "premium", renewalDate: endDate })
        .where(eq(subscriptions.userId, userId));
    } else {
      await db.insert(subscriptions).values({
        userId,
        plan: "premium",
        status: "active",
        startDate: now,
        endDate,
        renewalDate: endDate,
      });
    }

    // Update user record
    await db
      .update(users)
      .set({ subscriptionTier: "premium", subscriptionStatus: "active" })
      .where(eq(users.id, userId));

    return { success: true, expiresAt: endDate };
  },

  /**
   * Search courses
   */
  async searchCourses(query: string) {
    const db = await getDb();
    if (!db) return [];

    return await db
      .select()
      .from(courses)
      .where(
        or(
          like(courses.title, `%${query}%`),
          like(courses.description, `%${query}%`)
        )
      )
      .orderBy(asc(courses.displayOrder));
  },
};
