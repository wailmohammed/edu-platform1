import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function InterviewPrep() {
  const [code, setCode] = useState("");
  const { data: questions, isLoading } = trpc.interviewPrep.getQuestions.useQuery({});
  const submitMutation = trpc.interviewPrep.submitSolution.useMutation();

  const handleSubmit = async (questionId: number) => {
    if (!code) return;
    await submitMutation.mutateAsync({
      questionId,
      code,
      language: "javascript",
    });
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Interview Preparation</h1>

      <div className="space-y-6">
        {questions?.map((q: any) => (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle>
                {q.company} - {q.role}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium mb-2">{q.question}</p>
              <p className="text-sm text-gray-600 mb-4">{q.category} • {q.difficulty}</p>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-32 border rounded p-2 font-mono text-sm mb-4"
                placeholder="Write your solution..."
              />

              <Button onClick={() => handleSubmit(q.id)}>Submit Solution</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}