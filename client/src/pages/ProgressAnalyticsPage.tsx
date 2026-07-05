import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Target, Award, Clock, Zap } from "lucide-react";

interface CourseProgress {
  name: string;
  progress: number;
  lessons: number;
  completed: number;
  difficulty: string;
}

interface LearningStats {
  totalHours: number;
  lessonsCompleted: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
}

const mockCourseProgress: CourseProgress[] = [
  { name: "Python Fundamentals", progress: 85, lessons: 24, completed: 20, difficulty: "Beginner" },
  { name: "JavaScript Essentials", progress: 60, lessons: 28, completed: 17, difficulty: "Beginner" },
  { name: "Web Development", progress: 40, lessons: 32, completed: 13, difficulty: "Intermediate" },
  { name: "SQL Mastery", progress: 75, lessons: 18, completed: 14, difficulty: "Beginner" },
  { name: "React Advanced", progress: 30, lessons: 28, completed: 8, difficulty: "Advanced" },
];

const mockStats: LearningStats = {
  totalHours: 156,
  lessonsCompleted: 72,
  averageScore: 87.5,
  currentStreak: 32,
  longestStreak: 45,
};

const weeklyData = [
  { day: "Mon", hours: 2.5, lessons: 3 },
  { day: "Tue", hours: 3.0, lessons: 4 },
  { day: "Wed", hours: 1.5, lessons: 2 },
  { day: "Thu", hours: 4.0, lessons: 5 },
  { day: "Fri", hours: 2.0, lessons: 3 },
  { day: "Sat", hours: 3.5, lessons: 4 },
  { day: "Sun", hours: 2.5, lessons: 3 },
];

const topicsData = [
  { topic: "Python", percentage: 25, color: "bg-teal-500" },
  { topic: "JavaScript", percentage: 20, color: "bg-orange-500" },
  { topic: "React", percentage: 18, color: "bg-blue-500" },
  { topic: "SQL", percentage: 15, color: "bg-green-500" },
  { topic: "Web Design", percentage: 22, color: "bg-purple-500" },
];

export default function ProgressAnalyticsPage() {
  const maxHours = Math.max(...weeklyData.map((d) => d.hours));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-teal-500" />
            <h1 className="text-4xl font-bold text-white">Learning Analytics</h1>
          </div>
          <p className="text-gray-400">Track your progress and learning insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-slate-800 border-slate-700 hover:border-teal-500/50 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-6 h-6 text-teal-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white tabular-nums">{mockStats.totalHours}</p>
                <p className="text-sm text-gray-400 mt-1">Total Hours</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white tabular-nums">{mockStats.lessonsCompleted}</p>
                <p className="text-sm text-gray-400 mt-1">Lessons Done</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="text-center">
                <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white tabular-nums">{mockStats.averageScore}%</p>
                <p className="text-sm text-gray-400 mt-1">Avg Score</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-teal-500/50 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="text-center">
                <Zap className="w-6 h-6 text-teal-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white tabular-nums">{mockStats.currentStreak}</p>
                <p className="text-sm text-gray-400 mt-1">Current Streak</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="text-center">
                <Calendar className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white tabular-nums">{mockStats.longestStreak}</p>
                <p className="text-sm text-gray-400 mt-1">Best Streak</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
            <TabsTrigger value="courses" className="text-gray-300 data-[state=active]:text-white">
              Course Progress
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-gray-300 data-[state=active]:text-white">
              Weekly Activity
            </TabsTrigger>
            <TabsTrigger value="topics" className="text-gray-300 data-[state=active]:text-white">
              Topic Distribution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            {mockCourseProgress.map((course, index) => (
              <Card key={course.name} className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{course.name}</h3>
                        <p className="text-sm text-gray-400">
                          {course.completed}/{course.lessons} lessons completed
                        </p>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {course.difficulty}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white font-semibold">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Weekly Learning Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {weeklyData.map((day) => (
                  <div key={day.day}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">{day.day}</span>
                      <span className="text-sm text-gray-400">
                        {day.hours}h • {day.lessons} lessons
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="bg-teal-500 rounded-full h-8 transition-all duration-300"
                        style={{ width: `${(day.hours / maxHours) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Learning by Topic</CardTitle>
                <CardDescription className="text-gray-400">
                  Distribution of your learning time across topics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {topicsData.map((item) => (
                  <div key={item.topic}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">{item.topic}</span>
                      <span className="text-sm text-gray-400">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}