import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LearningPaths() {
  const { data: paths, isLoading } = trpc.learningPaths.list.useQuery();

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Learning Paths</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paths?.map((path: any) => (
          <Card key={path.id} className="hover:shadow-lg transition-shadow cursor-pointer">
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
  );
}