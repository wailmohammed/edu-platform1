import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Contests() {
  const { data: upcoming } = trpc.contests.getUpcoming.useQuery();
  const { data: divisionInfo } = trpc.rating.getDivisionInfo.useQuery();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Coding Contests</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Division</h2>
        <div className="grid grid-cols-4 gap-4">
          {divisionInfo?.map((d: any) => (
            <Card key={d.division} className="text-center">
              <CardHeader>
                <CardTitle>Division {d.division}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{d.minRating && d.maxRating ? `${d.minRating}-${d.maxRating}` : d.minRating ? `>${d.minRating}` : `<${d.maxRating}`}</p>
                <p className="font-medium">{d.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Contests</h2>
        <div className="space-y-4">
          {upcoming?.map((contest: any) => (
            <Card key={contest.id}>
              <CardHeader>
                <CardTitle>{contest.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  {contest.startTime.toLocaleDateString()} • {contest.duration} minutes
                </p>
                <p className="text-sm mb-4">{contest.problems.length} problems • {contest.participants.toLocaleString()} participants</p>
                {contest.prize && <p className="text-green-600 font-medium">Prize: {contest.prize}</p>}
                <Button className="mt-4">Register Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}