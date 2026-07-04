import { eq, and, desc, asc, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  courses,
  lessons,
  exercises,
  userProgress,
  lessonCompletion,
  exerciseSubmissions,
  streaks,
  badges,
  userBadges,
  certificates,
  leaderboard,
  friends,
  challenges,
  subscriptions,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Course queries
 */

// Mock courses for development when database unavailable
export const mockCourses = [
  { id: 1, slug: "python-fundamentals", title: "Python Fundamentals", description: "Learn Python basics", icon: "🐍", category: "programming", difficulty: "beginner", language: "python", totalLessons: 24, estimatedHours: "12", isPremium: false, enrollmentCount: 15420, displayOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, slug: "javascript-essentials", title: "JavaScript Essentials", description: "Master JavaScript from scratch", icon: "⚡", category: "programming", difficulty: "beginner", language: "javascript", totalLessons: 30, estimatedHours: "15", isPremium: false, enrollmentCount: 12350, displayOrder: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, slug: "html-css-complete", title: "HTML & CSS Complete", description: "Build websites with HTML and CSS", icon: "🌐", category: "web-development", difficulty: "beginner", language: "html", totalLessons: 20, estimatedHours: "10", isPremium: false, enrollmentCount: 8750, displayOrder: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, slug: "sql-mastery", title: "SQL Mastery", description: "Master database queries with SQL", icon: "🗄️", category: "databases", difficulty: "beginner", language: "sql", totalLessons: 18, estimatedHours: "9", isPremium: false, enrollmentCount: 6340, displayOrder: 4, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, slug: "react-advanced", title: "React Advanced Patterns", description: "Advanced React patterns and hooks", icon: "⚛️", category: "web-development", difficulty: "advanced", language: "javascript", totalLessons: 28, estimatedHours: "18", isPremium: true, enrollmentCount: 3200, displayOrder: 5, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, slug: "data-science-python", title: "Data Science with Python", description: "Analyze data with pandas and numpy", icon: "📊", category: "data-science", difficulty: "intermediate", language: "python", totalLessons: 35, estimatedHours: "22", isPremium: true, enrollmentCount: 4100, displayOrder: 6, createdAt: new Date(), updatedAt: new Date() },
  { id: 7, slug: "nodejs-backend", title: "Node.js Backend Development", description: "Build scalable backend APIs", icon: "🚀", category: "web-development", difficulty: "intermediate", language: "javascript", totalLessons: 32, estimatedHours: "20", isPremium: false, enrollmentCount: 5600, displayOrder: 7, createdAt: new Date(), updatedAt: new Date() },
  { id: 8, slug: "algorithms-coding", title: "Algorithms & Interview Prep", description: "Ace coding interviews", icon: "📈", category: "algorithms", difficulty: "advanced", language: "python", totalLessons: 40, estimatedHours: "25", isPremium: true, enrollmentCount: 2800, displayOrder: 8, createdAt: new Date(), updatedAt: new Date() },
];

export async function getAllCourses() {
  const db = await getDb();
  if (!db) return mockCourses;

  return await db
    .select()
    .from(courses)
    .orderBy(asc(courses.displayOrder), asc(courses.title));
}

export async function getCourseBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCourseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCourse(data: Partial<InsertCourse>) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot create course: database not available');
    return undefined;
  }

  try {
    const result = await db.insert(courses).values(data as any);
    return result;
  } catch (error) {
    console.error('[Database] Failed to create course:', error);
    throw error;
  }
}

export async function updateCourse(id: number, data: Partial<InsertCourse>) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot update course: database not available');
    return undefined;
  }

  try {
    await db.update(courses).set(data as any).where(eq(courses.id, id));
    return await getCourseById(id);
  } catch (error) {
    console.error('[Database] Failed to update course:', error);
    throw error;
  }
}

export async function deleteCourse(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot delete course: database not available');
    return undefined;
  }

  try {
    await db.delete(courses).where(eq(courses.id, id));
    return { success: true };
  } catch (error) {
    console.error('[Database] Failed to delete course:', error);
    throw error;
  }
}

export async function getCoursesByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(courses)
    .where(eq(courses.category, category as any))
    .orderBy(asc(courses.displayOrder));
}

export async function getCoursesByDifficulty(difficulty: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(courses)
    .where(eq(courses.difficulty, difficulty as any))
    .orderBy(asc(courses.displayOrder));
}

/**
 * Lesson queries
 */
export async function getLessonsByCourseId(courseId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(lessons.displayOrder));
}

export async function getLessonById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Exercise queries
 */
export async function getExercisesByLessonId(lessonId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(exercises)
    .where(eq(exercises.lessonId, lessonId))
    .orderBy(asc(exercises.displayOrder));
}

export async function getExerciseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(exercises).where(eq(exercises.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * User progress queries
 */
export async function getUserProgress(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.courseId, courseId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserCourseProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
}

export async function getUserCourseProgressByIds(userId: number, courseIds: number[]) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), inArray(userProgress.courseId, courseIds)));
}

/**
 * Lesson completion queries
 */
export async function getLessonCompletion(userId: number, lessonId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(lessonCompletion)
    .where(and(eq(lessonCompletion.userId, userId), eq(lessonCompletion.lessonId, lessonId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserCompletedLessons(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(lessonCompletion)
    .where(and(eq(lessonCompletion.userId, userId), eq(lessonCompletion.completed, true)));
}

/**
 * Exercise submission queries
 */
export async function getExerciseSubmission(userId: number, exerciseId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(exerciseSubmissions)
    .where(and(eq(exerciseSubmissions.userId, userId), eq(exerciseSubmissions.exerciseId, exerciseId)))
    .orderBy(desc(exerciseSubmissions.submittedAt))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserExerciseSubmissions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(exerciseSubmissions)
    .where(eq(exerciseSubmissions.userId, userId))
    .orderBy(desc(exerciseSubmissions.submittedAt));
}

/**
 * Streak queries
 */
export async function getUserStreak(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(streaks).where(eq(streaks.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Badge queries
 */
export async function getAllBadges() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(badges);
}

export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(userBadges).where(eq(userBadges.userId, userId));
}

/**
 * Certificate queries
 */
export async function getUserCertificates(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(certificates).where(eq(certificates.userId, userId));
}

export async function getCertificate(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(certificates)
    .where(and(eq(certificates.userId, userId), eq(certificates.courseId, courseId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Leaderboard queries
 */
export async function getLeaderboard(period: "weekly" | "monthly" | "all-time", limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(leaderboard)
    .where(eq(leaderboard.period, period))
    .orderBy(asc(leaderboard.rank))
    .limit(limit);
}

/**
 * Friend queries
 */
export async function getUserFriends(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(friends)
    .where(and(eq(friends.userId, userId), eq(friends.status, "accepted")));
}

/**
 * Challenge queries
 */
export async function getUserChallenges(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(challenges)
    .where(
      and(
        eq(challenges.status, "pending"),
        eq(challenges.challengedId, userId)
      )
    );
}

/**
 * Subscription queries
 */
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getSubscriptionByStripeId(stripeSubscriptionId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Update user preferences (learning goal, recommended path, onboarding status)
 */
export async function updateUserPreferences(
  userId: number,
  learningGoal?: string,
  recommendedPath?: string,
  onboardingCompleted?: boolean
) {
  const db = await getDb();
  if (!db) return { success: true };

  const updateSet: Record<string, unknown> = {};
  if (learningGoal !== undefined) updateSet.learningGoal = learningGoal;
  if (recommendedPath !== undefined) updateSet.recommendedPath = recommendedPath;
  if (onboardingCompleted !== undefined) updateSet.onboardingCompleted = onboardingCompleted;

  if (Object.keys(updateSet).length === 0) {
    return { success: true };
  }

  await db.update(users).set(updateSet).where(eq(users.id, userId));
  return { success: true };
}

/**
 * Create a friend challenge
 */
export async function createChallenge(
  challengerId: number,
  challengedId: number,
  exerciseId?: number,
  courseId?: number
) {
  const db = await getDb();
  if (!db) return { success: true, id: 0 };

  // Check if challenged user exists
  const challengedUser = await getUserById(challengedId);
  if (!challengedUser) {
    throw new Error("User not found");
  }

  const result = await db.insert(challenges).values({
    challengerId,
    challengedId,
    exerciseId: exerciseId ?? null,
    courseId: courseId ?? null,
    status: "pending",
  });

  return { success: true, id: result[0].insertId };
}

/**
 * Update challenge status
 */
export async function updateChallengeStatus(
  challengeId: number,
  userId: number,
  status: "accepted" | "declined" | "completed"
) {
  const db = await getDb();
  if (!db) return { success: true };

  // Verify the user is the one being challenged
  const challenge = await getChallengeById(challengeId);
  if (!challenge) {
    throw new Error("Challenge not found");
  }

  if (challenge.challengedId !== userId) {
    throw new Error("Unauthorized");
  }

  await db
    .update(challenges)
    .set({ status })
    .where(eq(challenges.id, challengeId));

  return { success: true };
}

export async function getChallengeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(challenges).where(eq(challenges.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Problem Builder - Interactive problems
 */
export async function getProblemById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(exercises).where(eq(exercises.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProblemsByLesson(lessonId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(exercises)
    .where(eq(exercises.lessonId, lessonId))
    .orderBy(asc(exercises.displayOrder));
}

export async function createProblem(
  userId: number,
  lessonId: number,
  title: string,
  description?: string,
  problemType?: string,
  difficulty?: string,
  starterCode?: string,
  solution?: string,
  testCases?: any,
  hints?: string[],
  visualConfig?: any
) {
  const db = await getDb();
  if (!db) return { success: true, id: 0 };

  const result = await db.insert(exercises).values({
    lessonId,
    slug: `problem-${Date.now()}`,
    title,
    description,
    language: "python",
    starterCode: starterCode ?? "",
    solution: solution ?? "",
    testCases: testCases ? JSON.stringify(testCases) : null,
    xpReward: 10,
    difficulty: (difficulty as any) ?? "easy",
  });

  return { success: true, id: result[0].insertId };
}

export async function submitSolution(
  userId: number,
  exerciseId: number,
  code?: string,
  answer?: any,
  timeSpent?: number
) {
  const db = await getDb();
  if (!db) return { success: true };

  // Check existing submission
  const existing = await getExerciseSubmission(userId, exerciseId);

  if (existing) {
    await db
      .update(exerciseSubmissions)
      .set({
        code: code ?? existing.code,
        passed: true,
        submittedAt: new Date(),
      })
      .where(
        and(
          eq(exerciseSubmissions.userId, userId),
          eq(exerciseSubmissions.exerciseId, exerciseId)
        )
      );
  } else {
    await db.insert(exerciseSubmissions).values({
      userId,
      exerciseId,
      code: code ?? "",
      passed: true,
      xpEarned: 10,
    });
  }

  return { success: true, earnedXP: 10 };
}

export async function getHintForProblem(
  userId: number,
  problemId: number,
  hintIndex: number
) {
  const exercise = await getExerciseById(problemId);
  if (!exercise?.description) {
    return { hint: "No hints available for this problem." };
  }

  return { hint: `Hint: ${exercise.description}` };
}

export async function getProblemStats(userId: number, problemId: number) {
  const db = await getDb();
  if (!db) return { attempts: 0, solved: false, avgTime: 0 };

  const submissions = await db
    .select()
    .from(exerciseSubmissions)
    .where(
      and(
        eq(exerciseSubmissions.userId, userId),
        eq(exerciseSubmissions.exerciseId, problemId)
      )
    );

  return {
    attempts: submissions.length,
    solved: submissions.some((s) => s.passed),
    avgTime: 0,
  };
}
