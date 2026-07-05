import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Badge variant="outline" className="mb-6">Legal Document</Badge>
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Refund Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Money-Back Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We offer a 30-day money-back guarantee for all premium subscriptions. If you're not 
                satisfied with CodeLearnify for any reason, contact us for a full refund.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Refund Eligibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Refunds are available for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Premium subscriptions within 30 days of purchase</li>
                <li>Course purchases where content was not accessed</li>
                <li>Technical issues that prevented platform use</li>
              </ul>
              <p className="mt-4">Refunds are not available for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Subscriptions older than 30 days</li>
                <li>Courses where significant content was accessed</li>
                <li>Violations of our Terms of Service</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>How to Request a Refund</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Email support@codelearnify.com with your order details and reason for refund. 
                We process refunds within 5-10 business days.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Processor</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                All payments are processed securely by Paddle. Paddle handles the refund process 
                for credit card transactions. You will receive email confirmation when your refund is processed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}