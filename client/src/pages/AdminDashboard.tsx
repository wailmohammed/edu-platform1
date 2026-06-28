import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: stats } = trpc.admin.getStats.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const { data: courses } = trpc.admin.getCourses.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const { data: adConfig } = trpc.admin.getAdConfig.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const utils = trpc.useUtils();
  const createCourse = trpc.admin.createCourse.useMutation({
    onSuccess: () => {
      utils.admin.getCourses.invalidate();
      setForm({
        slug: "",
        title: "",
        description: "",
        category: "programming",
        difficulty: "beginner",
        language: "",
        isPremium: false,
        estimatedHours: 1,
      });
    },
  });

  const updateCourse = trpc.admin.updateCourse.useMutation({
    onSuccess: () => {
      utils.admin.getCourses.invalidate();
      setEditingCourseId(null);
    },
  });

  const deleteCourse = trpc.admin.deleteCourse.useMutation({
    onSuccess: () => {
      utils.admin.getCourses.invalidate();
    },
  });

  const updateApiKey = trpc.admin.updateApiKey.useMutation();
  const updateAdConfig = trpc.admin.updateAdConfig.useMutation();

  const [form, setForm] = useState({
    slug: "",
    title: "",
    description: "",
    category: "programming",
    difficulty: "beginner",
    language: "",
    isPremium: false,
    estimatedHours: 1,
  });

  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    id: 0,
    title: "",
    description: "",
    category: "programming",
    difficulty: "beginner",
    language: "",
    isPremium: false,
    estimatedHours: 1,
  });

  const [apiKeyForm, setApiKeyForm] = useState({
    service: "benefitpay" as const,
    key: "",
    secret: "",
  });

  const [adForm, setAdForm] = useState({
    provider: "googleAdSense" as const,
    enabled: true,
    config: {} as Record<string, any>,
  });

  const updateSeoConfig = trpc.admin.updateSeoConfig.useMutation();

  const [seoForm, setSeoForm] = useState({
    title: "LearnCode - Interactive Learning Platform",
    description: "Master programming, data science, and web development with interactive courses, coding challenges, and real-time battles.",
    keywords: "programming, coding, javascript, python, data science, web development, online learning",
    googleAnalyticsEnabled: false,
    googleAnalyticsId: "",
    sitemapEnabled: true,
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Payment Providers</h3>
              <div className="grid gap-2">
                <div className="p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <span>BenefitPay (Bahrain)</span>
                    <span className="text-sm text-green-600">Configured</span>
                  </div>
                </div>
                <div className="p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <span>Stripe</span>
                    <span className="text-sm text-gray-500">Not configured</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Update API Key</h3>
              <div className="flex gap-2">
                <select
                  value={apiKeyForm.service}
                  onChange={(e) => setApiKeyForm({ ...apiKeyForm, service: e.target.value as any })}
                  className="p-2 border rounded"
                >
                  <option value="benefitpay">BenefitPay</option>
                  <option value="stripe">Stripe</option>
                  <option value="oauth">OAuth</option>
                </select>
                <input
                  type="password"
                  placeholder="API Key"
                  value={apiKeyForm.key}
                  onChange={(e) => setApiKeyForm({ ...apiKeyForm, key: e.target.value })}
                  className="flex-1 p-2 border rounded"
                />
                <Button
                  onClick={() => {
                    updateApiKey.mutate(apiKeyForm);
                    setApiKeyForm({ ...apiKeyForm, key: "", secret: "" });
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ad Monetization (Free Tier)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Ad Providers</h3>
              <div className="grid gap-2">
                <div className="p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <span>Google AdSense</span>
                    <span className="text-sm text-green-600">Enabled</span>
                  </div>
                </div>
                <div className="p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <span>Adsterra</span>
                    <span className="text-sm text-gray-500">Disabled</span>
                  </div>
                </div>
                <div className="p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <span>Monetag</span>
                    <span className="text-sm text-gray-500">Disabled</span>
                  </div>
                </div>
                <div className="p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <span>Amazon Associates</span>
                    <span className="text-sm text-green-600">Enabled</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Configure Ad Provider</h3>
              <div className="flex gap-2">
                <select
                  value={adForm.provider}
                  onChange={(e) => setAdForm({ ...adForm, provider: e.target.value as any })}
                  className="p-2 border rounded"
                >
                  <option value="googleAdSense">Google AdSense</option>
                  <option value="adsterra">Adsterra</option>
                  <option value="monetag">Monetag</option>
                  <option value="amazonAssociates">Amazon Associates</option>
                </select>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={adForm.enabled}
                    onChange={(e) => setAdForm({ ...adForm, enabled: e.target.checked })}
                  />
                  <span>Enabled</span>
                </label>
                <Button
                  onClick={() => {
                    updateAdConfig.mutate(adForm);
                  }}
                >
                  Save
                </Button>
              </div>
</div>
           </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>SEO Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Meta Tags</h3>
              <div className="space-y-2">
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Page Title"
                  value={seoForm.title}
                  onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
                />
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Meta Description"
                  value={seoForm.description}
                  onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
                />
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Keywords (comma separated)"
                  value={seoForm.keywords}
                  onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Analytics & Sitemap</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={seoForm.googleAnalyticsEnabled}
                    onChange={(e) => setSeoForm({ ...seoForm, googleAnalyticsEnabled: e.target.checked })}
                  />
                  <span>Google Analytics</span>
                </label>
                {seoForm.googleAnalyticsEnabled && (
                  <input
                    className="w-full p-2 border rounded"
                    placeholder="GA Measurement ID (G-XXXXXXXXXX)"
                    value={seoForm.googleAnalyticsId}
                    onChange={(e) => setSeoForm({ ...seoForm, googleAnalyticsId: e.target.value })}
                  />
                )}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={seoForm.sitemapEnabled}
                    onChange={(e) => setSeoForm({ ...seoForm, sitemapEnabled: e.target.checked })}
                  />
                  <span>Auto-generate Sitemap</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => {
                  updateSeoConfig.mutate({
                    metaTags: {
                      title: seoForm.title,
                      description: seoForm.description,
                      keywords: seoForm.keywords,
                    },
                    analytics: {
                      googleAnalytics: {
                        enabled: seoForm.googleAnalyticsEnabled,
                        measurementId: seoForm.googleAnalyticsId,
                      },
                    },
                  });
                }}
              >
                Save SEO Config
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {courses && courses.length > 0 ? (
            <div className="space-y-2">
              {courses.map((c: any) => (
                <div key={c.id} className="flex flex-col gap-2 p-4 border-b md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-sm text-gray-500">{c.description || "No description"}</div>
                    <div className="text-xs text-gray-400">{c.category} • {c.difficulty} • {c.language || "Any"}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                      onClick={() => {
                        setEditingCourseId(c.id);
                        setEditForm({
                          id: c.id,
                          title: c.title ?? "",
                          description: c.description ?? "",
                          category: c.category ?? "programming",
                          difficulty: c.difficulty ?? "beginner",
                          language: c.language ?? "",
                          isPremium: c.isPremium ?? false,
                          estimatedHours: c.estimatedHours ?? 1,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded"
                      onClick={() => deleteCourse.mutate({ id: c.id })}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading courses...</p>
          )}
        </CardContent>
      </Card>

      {editingCourseId && (
        <div className="container mx-auto p-6 mt-6 border rounded bg-white shadow-sm">
          <h2 className="text-xl font-bold mb-4">Edit Course</h2>
          <div className="space-y-2 max-w-xl">
            <input
              className="w-full p-2 border rounded"
              placeholder="Title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Description"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
            <div className="flex gap-2">
              <select
                className="flex-1 p-2 border rounded"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              >
                <option value="programming">Programming</option>
                <option value="web-development">Web</option>
                <option value="data-science">Data Science</option>
              </select>
              <select
                className="flex-1 p-2 border rounded"
                value={editForm.difficulty}
                onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 p-2 border rounded"
                placeholder="Language"
                value={editForm.language}
                onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
              />
              <input
                className="w-24 p-2 border rounded"
                type="number"
                min={0}
                value={editForm.estimatedHours}
                onChange={(e) => setEditForm({ ...editForm, estimatedHours: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="edit-premium"
                type="checkbox"
                checked={editForm.isPremium}
                onChange={(e) => setEditForm({ ...editForm, isPremium: e.target.checked })}
              />
              <label htmlFor="edit-premium">Premium</label>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => {
                  updateCourse.mutate({
                    id: editForm.id,
                    title: editForm.title,
                    description: editForm.description,
                    category: editForm.category,
                    difficulty: editForm.difficulty,
                    language: editForm.language,
                    isPremium: editForm.isPremium,
                    estimatedHours: editForm.estimatedHours,
                  });
                }}
              >
                {updateCourse.isLoading ? "Saving…" : "Save Changes"}
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={() => setEditingCourseId(null)}
              >
                Cancel
              </button>
            </div>
            {updateCourse.error && (
              <p className="text-red-600 mt-2">{String(updateCourse.error)}</p>
            )}
          </div>
        </div>
      )}

      <div className="container mx-auto p-6 mt-6">
        <h2 className="text-xl font-bold mb-2">Add Course</h2>
        <div className="space-y-2 max-w-xl">
          <input
            className="w-full p-2 border rounded"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex gap-2">
            <select
              className="flex-1 p-2 border rounded"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="programming">Programming</option>
              <option value="web-development">Web</option>
              <option value="data-science">Data Science</option>
            </select>
            <select
              className="flex-1 p-2 border rounded"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 p-2 border rounded"
              placeholder="Language"
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
            />
            <input
              className="w-24 p-2 border rounded"
              type="number"
              min={0}
              value={form.estimatedHours}
              onChange={(e) => setForm({ ...form, estimatedHours: Number(e.target.value) })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="premium"
              type="checkbox"
              checked={form.isPremium}
              onChange={(e) => setForm({ ...form, isPremium: e.target.checked })}
            />
            <label htmlFor="premium">Premium</label>
          </div>
          <div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => {
                createCourse.mutate({
                  slug: form.slug,
                  title: form.title,
                  description: form.description,
                  category: form.category,
                  difficulty: form.difficulty,
                  language: form.language,
                  isPremium: form.isPremium,
                  estimatedHours: form.estimatedHours,
                });
              }}
            >
              {createCourse.isLoading ? "Creating…" : "Create Course"}
            </button>
            {createCourse.error && (
              <p className="text-red-600 mt-2">{String(createCourse.error)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}