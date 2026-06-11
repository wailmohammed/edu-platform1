import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Certifications() {
  const { data: certs } = trpc.certifications.list.useQuery();
  const startMutation = trpc.certifications.startAttempt.useMutation();

  const handleStart = async (certId: number) => {
    await startMutation.mutateAsync({ certificationId: certId });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Certifications</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs?.map((cert: any) => (
          <Card key={cert.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{cert.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{cert.description}</p>
              <p className="text-xs mb-1">{cert.questions} questions • {cert.duration} minutes</p>
              <p className="text-xs text-gray-500 mb-4">{cert.attempts.toLocaleString()} attempts</p>
              <Button onClick={() => handleStart(cert.id)}>Start Certification</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}