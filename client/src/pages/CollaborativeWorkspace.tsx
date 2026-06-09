import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CollaborativeWorkspaceProps {
  problemId: number;
  sessionId?: string;
}

export default function CollaborativeWorkspace({ problemId, sessionId }: CollaborativeWorkspaceProps) {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [hintIndex, setHintIndex] = useState(0);

  const { data: problem } = trpc.problemBuilder.getById.useQuery(
    { id: problemId },
    { enabled: !!problemId }
  );

  const utils = trpc.useUtils();
  const submitMutation = trpc.problemBuilder.submit.useMutation();

  const handleGetHint = () => {
    if (!user) return;
    utils.problemBuilder.getHint.invalidate();
  };

  const handleSubmit = async () => {
    if (!user) return;
    await submitMutation.mutateAsync({
      problemId,
      answer: code,
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-semibold mb-4">{problem?.title || "Loading..."}</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Solution</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-32 border rounded p-2 font-mono"
            placeholder="Enter your solution here..."
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSubmit}>Submit Solution</Button>
          <Button variant="outline" onClick={handleGetHint}>
            Get Hint ({hintIndex + 1})
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          <p>Collaborative problem solving - share your progress with teammates!</p>
        </div>
      </div>
    </div>
  );
}