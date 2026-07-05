import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Badge variant="outline" className="mb-6">Legal Document</Badge>
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                These Terms of Service constitute a legally binding agreement between you and CodeLearnify 
                governing your use of the educational platform and services.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Description of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                CodeLearnify provides interactive coding education through structured courses, hands-on exercises, 
                coding challenges, and gamified learning experiences. Our platform helps beginners become 
                proficient developers through practical, project-based learning.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Subscription and Billing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">Free Tier</h4>
                <p>Access to beginner courses, basic features, and community content.</p>
              </div>
              <div>
                <h4 className="font-semibold">Premium Tier ($9.99/month or $99.99/year)</h4>
                <p>All courses, AI tutor assistance, certificates, advanced analytics, and priority support.</p>
              </div>
              <div>
                <h4 className="font-semibold">Billing</h4>
                <p>Subscriptions are billed through Paddle. All payments are processed securely.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 13 years old to use our services</li>
                <li>You are responsible for maintaining account security</li>
                <li>You may not share your account with others</li>
                <li>We may terminate accounts that violate these terms</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                All course content, code examples, and platform materials are owned by CodeLearnify. 
                You may not redistribute or resell our content without permission.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                CodeLearnify is provided "as is" without warranties. We are not liable for indirect damages 
                arising from your use of our platform.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}