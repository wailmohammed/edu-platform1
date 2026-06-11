import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquationRenderer, GraphVisualizer } from "@/components/VisualMath";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function VisualMathematics() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Visual Mathematics</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Equation Renderer</CardTitle>
          </CardHeader>
          <CardContent>
            <EquationRenderer equation="E = mc^2" className="text-2xl" />
            <EquationRenderer equation="\int_{0}^{n} x^2 dx = \frac{n^3}{3}" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Graph Visualizer</CardTitle>
          </CardHeader>
          <CardContent>
            <GraphVisualizer
              data={[10, 25, 15, 30, 20, 35]}
              labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
              type="line"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}