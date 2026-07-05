import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Pricing from "@/pages/Pricing";
import Leaderboard from "@/pages/Leaderboard";
import LessonViewer from "@/pages/LessonViewer";
import Profile from "@/pages/Profile";
import Onboarding from "@/pages/Onboarding";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import SuccessStories from "./pages/SuccessStories";
import Portfolio from "./pages/Portfolio";
import VisualMathematics from "./pages/VisualMathematics";
import LearningPaths from "./pages/LearningPaths";
import InterviewPrep from "./pages/InterviewPrep";
import MobileApp from "./pages/MobileApp";
import Contests from "./pages/Contests";
import Certifications from "./pages/Certifications";
import ProgressAnalyticsPage from "./pages/ProgressAnalyticsPage";
import AITutorPage from "./pages/AITutorPage";
import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
    }),
  ],
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/success-stories" component={SuccessStories} />
      <Route path="/ai-tutor" component={AITutorPage} />
      <Route path="/analytics" component={ProgressAnalyticsPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:slug" component={CourseDetail} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/lesson/:lessonId" component={LessonViewer} />
      <Route path="/profile" component={Profile} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/visual-math" component={VisualMathematics} />
      <Route path="/learning-paths" component={LearningPaths} />
      <Route path="/interview-prep" component={InterviewPrep} />
      <Route path="/mobile" component={MobileApp} />
      <Route path="/contests" component={Contests} />
      <Route path="/certifications" component={Certifications} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light">
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}

export default App;