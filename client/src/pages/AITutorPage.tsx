import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Zap, BookOpen, Lightbulb, Target, History } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface TutorSession {
  id: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  messages: Message[];
  createdAt: Date;
}

export default function AITutorPage() {
  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const topics = [
    { name: "Python Fundamentals", icon: "🐍", description: "Master Python basics and syntax" },
    { name: "JavaScript ES6+", icon: "⚡", description: "Modern JavaScript features and patterns" },
    { name: "React Hooks", icon: "⚛️", description: "React hooks and state management" },
    { name: "SQL Mastery", icon: "🗄️", description: "Database queries and optimization" },
    { name: "Web Design", icon: "🎨", description: "CSS and responsive design" },
    { name: "Data Structures", icon: "📊", description: "Arrays, linked lists, trees, graphs" },
    { name: "Algorithms", icon: "🔍", description: "Sorting, searching, dynamic programming" },
    { name: "API Design", icon: "🔌", description: "RESTful APIs and GraphQL" },
  ];

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  const createNewSession = (topic: string, difficulty: "beginner" | "intermediate" | "advanced") => {
    const newSession: TutorSession = {
      id: `session-${Date.now()}`,
      topic,
      difficulty,
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I'm your AI tutor. I'm here to help you learn ${topic} at a ${difficulty} level. What would you like to know?`,
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    };

    setSessions([...sessions, newSession]);
    setCurrentSessionId(newSession.id);
    toast.success(`Started ${topic} session!`);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !currentSession) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setSessions(
      sessions.map((s) =>
        s.id === currentSessionId
          ? { ...s, messages: [...s.messages, userMessage] }
          : s
      )
    );

    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const aiResponses = [
        `That's a great question about ${currentSession.topic}! Let me explain...`,
        `I can help you with that. Here's what you need to know...`,
        `Excellent point! Let me break this down for you...`,
        `Great follow-up! Let me provide more context...`,
      ];

      const aiMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date(),
      };

      setSessions(
        sessions.map((s) =>
          s.id === currentSessionId
            ? { ...s, messages: [...s.messages, aiMessage] }
            : s
        )
      );

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CL</span>
            </div>
            <span className="text-xl font-bold text-slate-900">CodeLearnify AI Tutor</span>
          </a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {topics.map((topic) => (
                  <Button
                    key={topic.name}
                    onClick={() => createNewSession(topic.name, "beginner")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <span className="mr-2">{topic.icon}</span>
                    {topic.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {sessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Recent Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sessions.map((session) => (
                    <Button
                      key={session.id}
                      onClick={() => setCurrentSessionId(session.id)}
                      variant={currentSessionId === session.id ? "default" : "outline"}
                      className="w-full justify-start text-sm"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {session.topic}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-3">
            {currentSession ? (
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{currentSession.topic}</CardTitle>
                      <CardDescription>
                        {currentSession.difficulty} level session
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {currentSession.difficulty}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto space-y-4 py-4">
                  {currentSession.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === "user"
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 px-4 py-2 rounded-lg">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                <div className="border-t p-4 space-y-3">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask your question..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="resize-none"
                      rows={2}
                    />
                    <Button onClick={sendMessage} disabled={!inputValue.trim() || isLoading}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="py-12">
                <CardContent className="text-center space-y-6">
                  <div className="flex justify-center">
                    <Zap className="w-16 h-16 text-teal-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Start a Learning Session</h3>
                    <p className="text-slate-600 mb-6">
                      Select a topic to begin your personalized tutoring session
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}