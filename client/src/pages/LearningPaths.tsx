import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LearningPaths() {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<string>("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const { data: paths, isLoading } = trpc.learningPaths.list.useQuery({
    type: filterType || undefined,
    difficulty: filterDifficulty || undefined,
    search: search || undefined,
  });

  const { data: recommended } = trpc.learningPaths.recommendations.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: progressPaths } = trpc.learningPaths.listWithProgress.useQuery(undefined, {
    enabled: !!user,
  });

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Learning Paths</h1>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            className={`px-4 py-2 rounded ${filterType === "role" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setFilterType(filterType === "role" ? "" : "role")}
          >
            Role-based
          </button>
          <button
            className={`px-4 py-2 rounded ${filterType === "domain" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setFilterType(filterType === "domain" ? "" : "domain")}
          >
            Domain-based
          </button>
          <select
            className="px-4 py-2 border rounded"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="">All difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <input
          className="w-full max-w-xs px-4 py-2 border rounded"
          placeholder="Search paths"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {user && recommended?.length ? (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Recommended for you</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((path: any) => (
              <Card key={path.id} className="border-blue-200 border hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{path.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{path.description}</p>
                  <p className="text-xs text-gray-500">{path.estimatedHours} hours • {path.difficulty}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paths?.map((path: any) => {
          const progress = progressPaths?.find((p: any) => p.pathId === path.id)?.progress;
          return (
            <Card key={path.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{path.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{path.description}</p>
                <div className="mb-2">
                  <span className="text-xs text-gray-500">{path.estimatedHours} hours • {path.difficulty}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {path.tags?.map((tag: string) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>
                {progress !== undefined ? (
                  <div className="text-sm text-green-700">Progress: {progress}% complete</div>
                ) : (
                  <div className="text-sm text-gray-500">Login to see your ETA and progress.</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}