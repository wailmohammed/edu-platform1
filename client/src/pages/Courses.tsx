import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Clock,
  BookOpen,
  Users,
  Lock,
  CheckCircle2,
  Play,
  ChevronDown,
  Zap,
  Trophy,
  SortAsc,
  X,
  ArrowRight,
  Award,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

// ─── Types ────────────────────────────────────────────────────────────────────
type Difficulty = "beginner" | "intermediate" | "advanced";
type Category =
  | "programming"
  | "web-development"
  | "data-science"
  | "mathematics"
  | "algorithms"
  | "databases"
  | "devops"
  | "ai-ml"
  | "other";
type SortOption = "popular" | "newest" | "title" | "difficulty-asc" | "difficulty-desc" | "hours-asc" | "hours-desc";
type ViewMode = "grid" | "list";

interface CourseWithEnrollment {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  category: Category;
  difficulty: Difficulty;
  language: string | null;
  totalLessons: number | null;
  estimatedHours: string | null;
  enrollmentCount: number | null;
  isPremium: boolean | null;
  displayOrder: number | null;
  createdAt: Date;
  updatedAt: Date;
  isEnrolled: boolean;
  progress: {
    completedLessons: number | null;
    totalLessons: number | null;
    progressPercentage: string | null;
    status: string | null;
  } | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES: { value: Category | "all"; label: string; emoji: string }[] = [
  { value: "all", label: "All Courses", emoji: "📚" },
  { value: "programming", label: "Programming", emoji: "💻" },
  { value: "web-development", label: "Web Dev", emoji: "🌐" },
  { value: "data-science", label: "Data Science", emoji: "📊" },
  { value: "databases", label: "Databases", emoji: "🗄️" },
  { value: "algorithms", label: "Algorithms", emoji: "🧮" },
  { value: "devops", label: "DevOps", emoji: "🐳" },
  { value: "mathematics", label: "Math", emoji: "📐" },
  { value: "ai-ml", label: "AI & ML", emoji: "🤖" },
  { value: "other", label: "Security", emoji: "🔐" },
];

const DIFFICULTY_COLORS: Record<Difficulty, { bg: string; text: string; label: string }> = {
  beginner: { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Beginner" },
  intermediate: { bg: "bg-amber-500/20", text: "text-amber-400", label: "Intermediate" },
  advanced: { bg: "bg-rose-500/20", text: "text-rose-400", label: "Advanced" },
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "title", label: "Title A→Z" },
  { value: "difficulty-asc", label: "Difficulty: Easy First" },
  { value: "difficulty-desc", label: "Difficulty: Hard First" },
  { value: "hours-asc", label: "Shortest First" },
  { value: "hours-desc", label: "Longest First" },
];

const DIFF_ORDER: Record<Difficulty, number> = { beginner: 0, intermediate: 1, advanced: 2 };

// ─── CourseCard Grid View ─────────────────────────────────────────────────────
function CourseCardGrid({
  course,
  onEnroll,
  enrollingId,
}: {
  course: CourseWithEnrollment;
  onEnroll: (id: number) => void;
  enrollingId: number | null;
}) {
  const [, navigate] = useLocation();
  const diff = DIFFICULTY_COLORS[course.difficulty];
  const progress = course.progress ? Number(course.progress.progressPercentage || 0) : 0;
  const isCompleted = course.progress?.status === "completed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/courses/${course.slug}`)}
    >
      {/* Premium Badge */}
      {course.isPremium && (
        <div className="absolute top-3 right-3 z-10">
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
            <Zap className="w-3 h-3" /> Premium
          </span>
        </div>
      )}

      {/* Completed Badge */}
      {isCompleted && (
        <div className="absolute top-3 left-3 z-10">
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        </div>
      )}

      {/* Header */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="text-5xl leading-none">{course.icon || "📚"}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>
                {diff.label}
              </span>
            </div>
            <h3 className="font-bold text-white text-lg leading-snug group-hover:text-violet-300 transition-colors line-clamp-2">
              {course.title}
            </h3>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-400 leading-relaxed line-clamp-2">
          {course.description}
        </p>
      </div>

      {/* Progress bar if enrolled */}
      {course.isEnrolled && (
        <div className="px-6 pb-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>{course.progress?.completedLessons || 0}/{course.progress?.totalLessons || course.totalLessons} lessons</span>
            <span className="font-semibold text-violet-400">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-slate-700" />
        </div>
      )}

      {/* Stats */}
      <div className="px-6 py-3 flex items-center gap-4 text-xs text-slate-400 border-t border-white/5">
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          {course.totalLessons} lessons
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {course.estimatedHours}h
        </span>
        <span className="flex items-center gap-1.5 ml-auto">
          <Users className="w-3.5 h-3.5" />
          {(course.enrollmentCount || 0).toLocaleString()}
        </span>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6 pt-2">
        {course.isEnrolled ? (
          <Button
            className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/courses/${course.slug}`);
            }}
          >
            <Play className="w-4 h-4" />
            {isCompleted ? "Review Course" : "Continue Learning"}
          </Button>
        ) : course.isPremium ? (
          <Button
            className="w-full gap-2 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEnroll(course.id);
            }}
            disabled={enrollingId === course.id}
          >
            {enrollingId === course.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            Enroll (Premium)
          </Button>
        ) : (
          <Button
            className="w-full gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEnroll(course.id);
            }}
            disabled={enrollingId === course.id}
          >
            {enrollingId === course.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            Enroll Free
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// ─── CourseCard List View ─────────────────────────────────────────────────────
function CourseCardList({
  course,
  onEnroll,
  enrollingId,
}: {
  course: CourseWithEnrollment;
  onEnroll: (id: number) => void;
  enrollingId: number | null;
}) {
  const [, navigate] = useLocation();
  const diff = DIFFICULTY_COLORS[course.difficulty];
  const progress = course.progress ? Number(course.progress.progressPercentage || 0) : 0;
  const isCompleted = course.progress?.status === "completed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="group flex items-center gap-5 p-5 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 to-slate-800 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-200 cursor-pointer"
      onClick={() => navigate(`/courses/${course.slug}`)}
    >
      {/* Icon */}
      <div className="text-4xl shrink-0">{course.icon || "📚"}</div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>
            {diff.label}
          </span>
          {course.isPremium && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Premium
            </span>
          )}
          {isCompleted && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Completed
            </span>
          )}
        </div>
        <h3 className="font-bold text-white text-base group-hover:text-violet-300 transition-colors truncate">
          {course.title}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{course.description}</p>
        {course.isEnrolled && (
          <div className="mt-2 flex items-center gap-2">
            <Progress value={progress} className="h-1.5 bg-slate-700 flex-1 max-w-[180px]" />
            <span className="text-xs text-violet-400">{Math.round(progress)}%</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-6 text-xs text-slate-400 shrink-0">
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          {course.totalLessons} lessons
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {course.estimatedHours}h
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          {(course.enrollmentCount || 0).toLocaleString()}
        </span>
      </div>

      {/* CTA */}
      <div className="shrink-0">
        {course.isEnrolled ? (
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5"
            onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course.slug}`); }}>
            <Play className="w-3.5 h-3.5" />
            {isCompleted ? "Review" : "Continue"}
          </Button>
        ) : (
          <Button
            size="sm"
            className={course.isPremium
              ? "border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 bg-transparent"
              : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
            }
            onClick={(e) => { e.stopPropagation(); onEnroll(course.id); }}
            disabled={enrollingId === course.id}
          >
            {enrollingId === course.id ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : course.isPremium ? (
              <><Lock className="w-3.5 h-3.5 mr-1" />Enroll</>
            ) : (
              <>Enroll Free</>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Courses() {
  const { isAuthenticated, getLoginUrl } = useAuth();
  const [, navigate] = useLocation();

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<Difficulty>>(new Set());
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showEnrolledOnly, setShowEnrolledOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  // Data
  const { data: courses, isLoading, refetch } = trpc.courses.listWithEnrollment.useQuery();
  const enrollMutation = trpc.enrollment.enroll.useMutation({
    onSuccess: (data, variables) => {
      if (data.alreadyEnrolled) {
        toast.info("You're already enrolled in this course");
      } else {
        toast.success("🎉 Successfully enrolled! Start learning now.");
      }
      refetch();
    },
    onError: (err) => {
      if (err.message.includes("UNAUTHORIZED") || err.message.includes("Forbidden")) {
        toast.error("Please log in to enroll in courses");
        window.location.href = getLoginUrl();
      } else {
        toast.error("Enrollment failed. Please try again.");
      }
    },
    onSettled: () => setEnrollingId(null),
  });

  const handleEnroll = (courseId: number) => {
    if (!isAuthenticated) {
      toast("Please log in to enroll", {
        action: { label: "Login", onClick: () => (window.location.href = getLoginUrl()) },
      });
      return;
    }
    setEnrollingId(courseId);
    enrollMutation.mutate({ courseId });
  };

  // Filtering + Sorting
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    let result = courses as CourseWithEnrollment[];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.description || "").toLowerCase().includes(q) ||
          (c.language || "").toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== "all") {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // Difficulty
    if (selectedDifficulties.size > 0) {
      result = result.filter((c) => selectedDifficulties.has(c.difficulty));
    }

    // Free only
    if (showFreeOnly) {
      result = result.filter((c) => !c.isPremium);
    }

    // Enrolled only
    if (showEnrolledOnly) {
      result = result.filter((c) => c.isEnrolled);
    }

    // Sort
    const sorted = [...result];
    switch (sortBy) {
      case "popular":
        sorted.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "difficulty-asc":
        sorted.sort((a, b) => DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty]);
        break;
      case "difficulty-desc":
        sorted.sort((a, b) => DIFF_ORDER[b.difficulty] - DIFF_ORDER[a.difficulty]);
        break;
      case "hours-asc":
        sorted.sort((a, b) => Number(a.estimatedHours || 0) - Number(b.estimatedHours || 0));
        break;
      case "hours-desc":
        sorted.sort((a, b) => Number(b.estimatedHours || 0) - Number(a.estimatedHours || 0));
        break;
    }

    return sorted;
  }, [courses, searchQuery, selectedCategory, selectedDifficulties, showFreeOnly, showEnrolledOnly, sortBy]);

  const stats = useMemo(() => {
    if (!courses) return { total: 0, enrolled: 0, free: 0, completed: 0 };
    return {
      total: courses.length,
      enrolled: (courses as CourseWithEnrollment[]).filter((c) => c.isEnrolled).length,
      free: courses.filter((c) => !c.isPremium).length,
      completed: (courses as CourseWithEnrollment[]).filter((c) => c.progress?.status === "completed").length,
    };
  }, [courses]);

  const toggleDifficulty = (d: Difficulty) => {
    setSelectedDifficulties((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDifficulties(new Set());
    setShowFreeOnly(false);
    setShowEnrolledOnly(false);
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedDifficulties.size > 0 || showFreeOnly || showEnrolledOnly;

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white">
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/30 via-indigo-900/10 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-violet-400 text-sm font-medium mb-3">
              <BookOpen className="w-4 h-4" /> Course Catalog
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-300 mb-3">
              Explore All Courses
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Master programming, data science, AI, and more with{" "}
              <span className="text-white font-semibold">{stats.total}+ expert-crafted courses</span>.
              Start for free, upgrade when ready.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 mt-6 text-sm">
              {[
                { icon: BookOpen, label: `${stats.total} Courses`, color: "text-violet-400" },
                { icon: Award, label: `${stats.free} Free`, color: "text-emerald-400" },
                { icon: Trophy, label: `${stats.enrolled} Enrolled`, color: "text-amber-400" },
                { icon: CheckCircle2, label: `${stats.completed} Completed`, color: "text-blue-400" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className={`flex items-center gap-1.5 ${color} font-medium`}>
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Category Pills ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.value
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Search + Filters bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search courses, topics, languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500 h-10"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                onClick={() => setSearchQuery("")}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Difficulty filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`gap-2 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white ${
                  selectedDifficulties.size > 0 ? "border-violet-500/50 text-violet-300" : ""
                }`}
              >
                <Filter className="w-4 h-4" />
                Difficulty
                {selectedDifficulties.size > 0 && (
                  <span className="bg-violet-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {selectedDifficulties.size}
                  </span>
                )}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-white/10 text-white w-48">
              <DropdownMenuLabel className="text-slate-400 text-xs">Select Difficulty</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              {(["beginner", "intermediate", "advanced"] as Difficulty[]).map((d) => (
                <DropdownMenuCheckboxItem
                  key={d}
                  checked={selectedDifficulties.has(d)}
                  onCheckedChange={() => toggleDifficulty(d)}
                  className="capitalize"
                >
                  <span className={DIFFICULTY_COLORS[d].text + " mr-2"}>●</span>
                  {DIFFICULTY_COLORS[d].label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More filters */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                More
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-white/10 text-white w-48">
              <DropdownMenuLabel className="text-slate-400 text-xs">More Filters</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuCheckboxItem
                checked={showFreeOnly}
                onCheckedChange={setShowFreeOnly}
              >
                <span className="text-emerald-400 mr-2">●</span> Free Only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showEnrolledOnly}
                onCheckedChange={setShowEnrolledOnly}
              >
                <span className="text-violet-400 mr-2">●</span> My Courses
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <SortAsc className="w-4 h-4" />
                Sort
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-white/10 text-white w-52">
              <DropdownMenuLabel className="text-slate-400 text-xs">Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              {SORT_OPTIONS.map((opt) => (
                <DropdownMenuCheckboxItem
                  key={opt.value}
                  checked={sortBy === opt.value}
                  onCheckedChange={() => setSortBy(opt.value)}
                >
                  {opt.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View mode */}
          <div className="flex rounded-lg border border-white/10 overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Active Filters ── */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-xs text-slate-500">Active filters:</span>
            {searchQuery && (
              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/10 text-slate-300">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-violet-500/20 text-violet-300">
                {CATEGORIES.find((c) => c.value === selectedCategory)?.label}
                <button onClick={() => setSelectedCategory("all")} className="hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            )}
            {Array.from(selectedDifficulties).map((d) => (
              <span key={d} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${DIFFICULTY_COLORS[d].bg} ${DIFFICULTY_COLORS[d].text}`}>
                {DIFFICULTY_COLORS[d].label}
                <button onClick={() => toggleDifficulty(d)} className="hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            ))}
            {showFreeOnly && (
              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                Free Only <button onClick={() => setShowFreeOnly(false)} className="hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            )}
            {showEnrolledOnly && (
              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                My Courses <button onClick={() => setShowEnrolledOnly(false)} className="hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-slate-500 hover:text-white underline underline-offset-2 ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── Results count ── */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-400">
            Showing{" "}
            <span className="text-white font-semibold">{filteredCourses.length}</span>{" "}
            {filteredCourses.length === 1 ? "course" : "courses"}
          </p>
        </div>

        {/* ── Course Grid/List ── */}
        {isLoading ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" : "space-y-3"}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/5 bg-white/3 animate-pulse"
                style={{ height: viewMode === "grid" ? 320 : 90 }}
              />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
            <p className="text-slate-400 mb-6">Try adjusting your filters or search term</p>
            <Button onClick={clearFilters} className="bg-violet-600 hover:bg-violet-700">
              Clear All Filters
            </Button>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course) => (
                <CourseCardGrid
                  key={course.id}
                  course={course}
                  onEnroll={handleEnroll}
                  enrollingId={enrollingId}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div layout className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course) => (
                <CourseCardList
                  key={course.id}
                  course={course}
                  onEnroll={handleEnroll}
                  enrollingId={enrollingId}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Premium Upsell ── */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 rounded-2xl bg-gradient-to-r from-violet-900/60 to-indigo-900/60 border border-violet-500/30 p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-indigo-600/10" />
            <div className="relative">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-white mb-3">Start Your Learning Journey</h2>
              <p className="text-slate-300 mb-6 max-w-lg mx-auto">
                Join thousands of developers leveling up their skills. Sign up free and get instant access to{" "}
                <strong className="text-white">{stats.free}+ free courses</strong>.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
