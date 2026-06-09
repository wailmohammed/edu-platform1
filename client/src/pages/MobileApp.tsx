import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MobileApp() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mobile Learning</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>iOS App</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Download on the App Store for iPhone and iPad</p>
            <ul className="list-disc pl-5 mb-4 text-sm">
              <li>Offline mode for lessons</li>
              <li>Daily streaks and XP</li>
              <li>15+ programming languages</li>
              <li>AI hints when stuck</li>
            </ul>
            <Button>Download for iOS</Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle>Android App</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Get it on Google Play for Android devices</p>
            <ul className="list-disc pl-5 mb-4 text-sm">
              <li>Real code in your pocket</li>
              <li>5-minute daily lessons</li>
              <li>Sync progress across devices</li>
              <li>Free certificates on completion</li>
            </ul>
            <Button>Download for Android</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}