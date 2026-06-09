import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export default function Portfolio() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  const { data: portfolio, isLoading } = trpc.portfolio.get.useQuery();
  const utils = trpc.useUtils();

  const updateMutation = trpc.portfolio.update.useMutation({
    onSuccess: () => {
      utils.portfolio.get.invalidate();
      setEditing(false);
      toast.success("Portfolio updated!");
    },
  });

  const addProjectMutation = trpc.portfolio.addProject.useMutation({
    onSuccess: () => {
      utils.portfolio.get.invalidate();
      toast.success("Project added!");
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Portfolio</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <div className="space-y-4">
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
              />
              <Input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="GitHub URL"
              />
              <div className="flex gap-2">
                <Button onClick={() => updateMutation.mutate({ bio, githubUrl })}>
                  Save
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-2">{portfolio?.bio || "No bio yet"}</p>
              {portfolio?.githubUrl && (
                <a href={portfolio.githubUrl} target="_blank" rel="noopener noreferrer">
                  {portfolio.githubUrl}
                </a>
              )}
              <Button className="mt-4" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio?.projects?.length ? (
            <div className="grid gap-4">
              {portfolio.projects.map((p: any) => (
                <Card key={p.id}>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="text-sm text-gray-600">{p.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No projects yet. Add your first project!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}