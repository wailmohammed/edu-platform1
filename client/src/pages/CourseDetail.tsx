import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BookOpen, Clock, Users, Star, CheckCircle2, Play, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetail() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { user, getLoginUrl } = useAuth();
  const utils = trpc.useUtils();

  const { data: course, isLoading: loadingCourse } = trpc.courses.getBySlug.useQuery(
    { slug: params.slug! },
    { enabled: !!params.slug }
  );

  const { data: lessons, isLoading: loadingLessons } = trpc.lessons.listByCourse.useQuery(
    { courseId: course?.id ?? 0 },
    { enabled: !!course?.id }
  );

  const { data: userProgress } = trpc.progress.getCourseProgress.useQuery(
    { courseId: course?.id ?? 0 },
    { enabled: !!user && !!course?.id }
  );

  const enrollMutation = trpc.enrollment.enroll.useMutation({
    onSuccess: () => {
      toast.success("Successfully enrolled in course!");
      utils.progress.getCourseProgress.invalidate();
    },
    onError: () => {
      toast.error("Failed to enroll in course");
    },
  });

  const handleEnroll = async () => {
    if (!user) {
      window.location.href = getLoginUrl();
      return;
    }
    if (!course) return;
    await enrollMutation.mutateAsync({ courseId: course.id });
  };

  const handleStartLesson = (lessonId: number) => {
    if (!user) {
      window.location.href = getLoginUrl();
      return;
    }
    navigate(`/lesson/${lessonId}`);
  };

  if (loadingCourse) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card>
          <CardContent className="pt-12 text-center">
            <p className="text-slate-600 mb-4">Course not found</p>
            <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPremiumCourse = course.isPremium;
  const isPremiumUser = user?.subscriptionTier === "premium";
  const canAccess = !isPremiumCourse || isPremiumUser;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/courses")} className="mb-4">
            ← Back to Courses
          </Button>
          <div className="flex items-start gap-4">
            <div className="text-4xl">{course.icon || "📚"}</div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
              <p className="text-slate-600 mt-2">{course.description}</p>
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="outline" className="capitalize">
                  {course.category}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {course.difficulty}
                </Badge>
                {isPremiumCourse && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Lock className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold">{course.totalLessons}</p>
                    <p className="text-sm text-slate-600">Lessons</p>
                  </div>
                  <div>
                    <Clock className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold">{course.estimatedHours}h</p>
                    <p className="text-sm text-slate-600">Est. Time</p>
                  </div>
                  <div>
                    <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold">{course.enrollmentCount}</p>
                    <p className="text-sm text-slate-600">Enrolled</p>
                  </div>
                </div>

                {userProgress && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Your Progress</span>
                      <span className="text-sm text-slate-600">
                        {userProgress.progressPercentage}%
                      </span>
                    </div>
                    <Progress value={Number(userProgress.progressPercentage)} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lessons</CardTitle>
                <CardDescription>
                  {loadingLessons ? "Loading lessons..." : `${lessons?.length || 0} lessons in this course`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingLessons ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lessons?.map((lesson) => (
                      <motion.div
                        key={lesson.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{lesson.title}</h3>
                          <p className="text-sm text-slate-600">{lesson.description}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartLesson(lesson.id)}
                          disabled={!canAccess}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Enrollment</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending || !!userProgress}
                >
                  {userProgress ? "Continue Learning" : isPremiumCourse && !isPremiumUser ? "Upgrade to Premium" : "Enroll Now"}
                </Button>

                {isPremiumCourse && !isPremiumUser && (
                  <p className="text-sm text-slate-600 mt-4 text-center">
                    This course requires a premium subscription
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}