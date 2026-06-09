import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: stats } = trpc.admin.getStats.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const { data: courses } = trpc.admin.getCourses.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You must be an admin to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalUsers ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalCourses ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.activeUsers ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${stats?.monthlyRevenue ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {courses && courses.length > 0 ? (
            <div className="space-y-2">
              {courses.map((c: any) => (
                <div key={c.id} className="flex justify-between p-2 border-b">
                  <span>{c.title}</span>
                  <span>{c.students} students</span>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading courses...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}