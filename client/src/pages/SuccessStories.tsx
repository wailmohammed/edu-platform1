import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Quote, Star } from "lucide-react";

export default function SuccessStories() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CL</span>
            </div>
            <span className="text-xl font-bold text-slate-900">CodeLearnify</span>
          </Link>
          <Link to="/about">
            <Button variant="ghost" size="sm">About</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
        <Badge variant="outline" className="mb-6">
          Success Stories
        </Badge>
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
          Learn Coding That Actually Sticks
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Real stories from real people who turned their ideas into working code.
        </p>
      </section>

      {/* Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            {
              name: "Sarah Chen",
              role: "Software Developer at TechCorp",
              story: "I was working in marketing with zero coding experience. After 3 months of daily practice on CodeLearnify, I built my first web app and landed a junior developer role.",
              before: "Marketing Coordinator",
              after: "Software Developer",
              months: "3",
            },
            {
              name: "Marcus Johnson",
              role: "Computer Science Student",
              story: "The streak system kept me consistent when other platforms failed. I maintained a 120-day streak while learning Python and built 5 portfolio projects.",
              before: "CS Freshman",
              after: "CS Senior",
              months: "6",
            },
            {
              name: "Emma Rodriguez",
              role: "Freelance Developer",
              story: "As a career switcher, I needed practical skills fast. CodeLearnify's project-based approach helped me build real client websites within 4 months.",
              before: "Project Manager",
              after: "Freelance Developer",
              months: "4",
            },
            {
              name: "David Kim",
              role: "Startup Founder",
              story: "I learned enough to prototype our MVP myself. Saved $50K in development costs and now lead a 10-person tech team.",
              before: "Non-technical Founder",
              after: "Tech Lead",
              months: "2",
            },
          ].map((story, idx) => (
            <Card key={idx} className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Quote className="w-8 h-8 text-teal-600 mb-4" />
                <p className="text-slate-700 mb-6 italic">"{story.story}"</p>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-slate-900">{story.name}</p>
                    <p className="text-sm text-slate-600">{story.role}</p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between text-sm">
                  <div>
                    <span className="text-slate-500">Before:</span>
                    <span className="ml-2 text-slate-700">{story.before}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-600" />
                  <div>
                    <span className="text-slate-500">After:</span>
                    <span className="ml-2 text-slate-700 font-medium">{story.after}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="mt-4">
                  {story.months} months to transformation
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">By the Numbers</h2>
            <p className="text-xl text-teal-100">Your success is our success</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "84%", label: "Job placement rate" },
              { value: "2.3x", label: "Faster learning" },
              { value: "4.9/5", label: "Average rating" },
              { value: "10K+", label: "Success stories" },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-teal-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-6">
          Your story starts here
        </h2>
        <p className="text-xl text-slate-600 mb-8">
          Join thousands turning their ideas into real code.
        </p>
        <Link to="/courses">
          <Button size="lg" className="bg-teal-600 hover:bg-teal-700 gap-2">
            Start Learning Free <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 CodeLearnify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}