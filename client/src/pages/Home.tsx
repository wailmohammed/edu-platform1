import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";

import { ArrowRight, Zap, Users, Trophy, Code, Flame, BookOpen, Award } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CL</span>
            </div>
            <span className="text-xl font-bold text-slate-900">CodeLearnify</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/about" className="text-sm text-slate-600 hover:text-slate-900 transition">About</a>
            <a href="/success-stories" className="text-sm text-slate-600 hover:text-slate-900 transition">Stories</a>
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-600">{user?.name}</span>
                <Button onClick={() => window.location.href = "/dashboard"} variant="default" size="sm">
                  Dashboard
                </Button>
              </>
            ) : (
              <Button onClick={handleGetStarted} variant="default" size="sm">
                Get Started
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="w-fit">
                <Zap className="w-3 h-3 mr-1" />
                Interactive Learning
              </Badge>
              <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight">
                Turn Ideas Into Code
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Learn practical coding with hands-on projects. Write real code, solve challenges, and build your portfolio while earning XP and badges.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleGetStarted} size="lg" className="gap-2 bg-teal-600 hover:bg-teal-700">
                Start Learning Free <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = "/courses"}>
                Browse Courses
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
              <div>
                <div className="text-2xl font-bold text-slate-900">8+</div>
                <div className="text-sm text-slate-600">Learning Paths</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">40+</div>
                <div className="text-sm text-slate-600">Interactive Courses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">10K+</div>
                <div className="text-sm text-slate-600">Active Learners</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-orange-600/20 rounded-3xl blur-3xl" />
            <div className="relative bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-slate-600">javascript</span>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>
                <div className="font-mono text-sm space-y-2 text-slate-700">
                  <div><span className="text-teal-600">function</span> <span className="text-blue-600">ideaToCode</span>(idea) {'{'}</div>
                  <div className="ml-4"><span className="text-orange-600">return</span> <span className="text-green-600">actualCode</span>;</div>
                  <div>{'}'}</div>
                  <div className="mt-4 text-slate-500">→ Your idea is now real code!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-900 text-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Why CodeLearnify?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to learn coding effectively and stay motivated
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: "In-Browser Code Editor",
                description: "Write, run, and test code directly in your browser with instant feedback.",
              },
              {
                icon: Flame,
                title: "Build Your Streak",
                description: "Stay consistent with daily streaks, freeze days, and rewards.",
              },
              {
                icon: Trophy,
                title: "Gamified Learning",
                description: "Earn XP, unlock levels, collect badges, and compete on leaderboards.",
              },
              {
                icon: BookOpen,
                title: "Structured Courses",
                description: "Learn from beginner to advanced with project-based lessons.",
              },
              {
                icon: Users,
                title: "Friend Challenges",
                description: "Challenge friends to coding contests and celebrate wins together.",
              },
              {
                icon: Award,
                title: "Earn Certificates",
                description: "Get verifiable certificates for every course completed.",
              },
            ].map((feature, idx) => (
              <Card key={idx} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                <CardHeader>
                  <feature.icon className="w-8 h-8 text-teal-400 mb-2" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Popular Learning Paths</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Start coding in minutes with our hands-on courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Python Fundamentals", level: "Beginner", lessons: 24, students: "12K+" },
            { title: "JavaScript Essentials", level: "Beginner", lessons: 28, students: "15K+" },
            { title: "Web Development", level: "Intermediate", lessons: 32, students: "8K+" },
            { title: "Data Science", level: "Intermediate", lessons: 26, students: "5K+" },
            { title: "Algorithms", level: "Advanced", lessons: 20, students: "3K+" },
            { title: "Node.js Backend", level: "Intermediate", lessons: 35, students: "4K+" },
            { title: "SQL Mastery", level: "Beginner", lessons: 18, students: "2K+" },
            { title: "React Advanced", level: "Advanced", lessons: 28, students: "6K+" },
          ].map((course, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant={course.level === "Beginner" ? "default" : course.level === "Intermediate" ? "secondary" : "outline"}>
                    {course.level}
                  </Badge>
                  <span className="text-sm text-slate-500">{course.lessons} lessons</span>
                </div>
                <CardTitle className="group-hover:text-teal-600 transition-colors">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{course.students} students</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button onClick={() => window.location.href = "/courses"} size="lg" className="bg-teal-600 hover:bg-teal-700">
            View All Courses <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Loved by Learners</h2>
            <p className="text-xl text-slate-600">Join thousands of students learning to code</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "I went from zero to building my first web app in just 3 months. The gamification kept me motivated!",
                author: "Sarah Chen",
                role: "Software Developer",
              },
              {
                quote: "The streak system is amazing. I've never been more consistent with learning. 45 days and counting!",
                author: "Marcus Johnson",
                role: "Student",
              },
              {
                quote: "The in-browser code editor and instant feedback made learning so much faster. Highly recommend!",
                author: "Emma Rodriguez",
                role: "Career Switcher",
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="border-slate-200">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-slate-600">Start free, upgrade anytime</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-600 ml-2">/month</span>
              </div>
              <ul className="space-y-3">
                {[
                  "8 beginner courses",
                  "In-browser code editor",
                  "Daily streaks & XP",
                  "Basic leaderboard",
                  "Community access",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button onClick={handleGetStarted} variant="outline" className="w-full">
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className="border-2 border-teal-500 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-teal-600">Most Popular</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Premium</CardTitle>
              <CardDescription>For serious learners</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-4xl font-bold text-slate-900">$9.99</span>
                <span className="text-slate-600 ml-2">/month</span>
              </div>
              <ul className="space-y-3">
                {[
                  "All 40+ courses",
                  "Advanced code editor",
                  "AI tutor assistance",
                  "Global leaderboard",
                  "Friend challenges",
                  "Certificate downloads",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="w-2 h-2 bg-teal-600 rounded-full" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button onClick={handleGetStarted} className="w-full bg-teal-600 hover:bg-teal-700">
                Start Premium Trial
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-orange-500 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold">Ready to start coding?</h2>
          <p className="text-xl text-teal-100">
            Join thousands of learners turning ideas into real code
          </p>
          <Button onClick={handleGetStarted} size="lg" variant="secondary" className="gap-2">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/courses" className="hover:text-white transition">Courses</a></li>
                <li><a href="/pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Features</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Follow</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">Discord</a></li>
                <li><a href="#" className="hover:text-white transition">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm">
            <p>&copy; 2026 CodeLearnify. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}