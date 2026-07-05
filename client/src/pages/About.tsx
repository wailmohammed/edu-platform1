import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Code, Users, Trophy, Zap, Heart, Target } from "lucide-react";

export default function About() {
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
          <div className="flex items-center gap-4">
            <Link to="/success-stories">
              <Button variant="ghost" size="sm">Success Stories</Button>
            </Link>
            <Link to="/courses">
              <Button variant="ghost" size="sm">Courses</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
        <Badge variant="outline" className="mb-6">
          <Heart className="w-3 h-3 mr-1" />
          Our Story
        </Badge>
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
          Turn Ideas Into Code
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          We believe learning to code should be practical, enjoyable, and accessible to everyone. 
          CodeLearnify helps you build real projects from day one.
        </p>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 mb-4">
              Traditional coding education leaves students overwhelmed with theory but no real skills. 
              We flip that — start with ideas, end with working code.
            </p>
            <p className="text-lg text-slate-600">
              Our interactive platform combines hands-on exercises, gamification, and community 
              to make coding stick. Whether you're a beginner or career switcher, we help you 
              build the skills that actually matter.
            </p>
          </div>
          <Card className="bg-gradient-to-br from-teal-50 to-orange-50 border-teal-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">8+</div>
                  <div className="text-sm text-slate-600">Learning Paths</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">10K+</div>
                  <div className="text-sm text-slate-600">Learners</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Drives Us</h2>
            <p className="text-xl text-slate-300">The principles behind our platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: "Practical First",
                description: "Every lesson builds toward real projects you can show off.",
              },
              {
                icon: Zap,
                title: "Stay Motivated",
                description: "Streaks, XP, and badges keep you consistent and rewarded.",
              },
              {
                icon: Trophy,
                title: "Community Powered",
                description: "Learn together with friends, compete on leaderboards, celebrate wins.",
              },
            ].map((value, idx) => (
              <Card key={idx} className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6 text-center">
                  <value.icon className="w-10 h-10 text-teal-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-slate-300">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-6">
          Ready to build real skills?
        </h2>
        <p className="text-xl text-slate-600 mb-8">
          Join thousands turning their ideas into working code.
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