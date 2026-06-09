import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface EquationRendererProps {
  equation: string;
  className?: string;
}

export function EquationRenderer({ equation, className }: EquationRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.textContent = equation;
    }
  }, [equation]);

  return (
    <div
      ref={containerRef}
      className={cn("text-lg font-math", className)}
      data-latex={equation}
    />
  );
}

interface AlgebraManipulatorProps {
  expression: string;
  onChange?: (newExpression: string) => void;
}

export function AlgebraManipulator({ expression, onChange }: AlgebraManipulatorProps) {
  return (
    <div className="border rounded-lg p-4 bg-slate-50">
      <div className="mb-2 font-medium">Algebraic Expression</div>
      <div className="text-2xl font-math mb-4">{expression}</div>
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-blue-500 text-white rounded">Expand</button>
        <button className="px-3 py-1 bg-blue-500 text-white rounded">Factor</button>
        <button className="px-3 py-1 bg-blue-500 text-white rounded">Simplify</button>
      </div>
    </div>
  );
}

interface GeometryToolProps {
  shape: "triangle" | "circle" | "square" | "line";
  onConstructionComplete?: (data: any) => void;
}

export function GeometryConstructionTool({ shape, onConstructionComplete }: GeometryToolProps) {
  return (
    <div className="border rounded-lg p-4 bg-slate-50">
      <div className="mb-2 font-medium">Geometry Tool: {shape}</div>
      <div className="h-48 bg-white border border-slate-200 rounded flex items-center justify-center">
        <div className="text-slate-400">Drawing canvas for {shape}</div>
      </div>
    </div>
  );
}

interface GraphVisualizerProps {
  data: number[];
  labels?: string[];
  type?: "line" | "bar" | "scatter";
}

export function GraphVisualizer({ data, labels, type = "line" }: GraphVisualizerProps) {
  const maxVal = Math.max(...data, 1);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="mb-2 font-medium">Graph ({type})</div>
      <div className="h-48 flex items-end justify-around gap-1">
        {data.map((val, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className="bg-blue-500 w-8 rounded-t"
              style={{ height: `${(val / maxVal) * 120}px` }}
            />
            {labels && <span className="text-xs mt-1">{labels[i]}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

interface MatrixVectorVisualizerProps {
  matrix: number[][];
  vector?: number[];
  operation?: "multiply" | "transform" | "eigen";
}

export function MatrixVectorVisualizer({ matrix, vector, operation = "multiply" }: MatrixVectorVisualizerProps) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="mb-2 font-medium">Matrix {operation === "multiply" ? "×" : "Transformation"}</div>
      <div className="overflow-x-auto">
        <div className="inline-block">
          <div className="grid gap-1 mb-4">
            {matrix.map((row, i) => (
              <div key={i} className="flex gap-1">
                {row.map((val, j) => (
                  <div key={j} className="w-12 h-12 border border-slate-300 flex items-center justify-center text-sm font-mono">
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {vector && (
            <div className="flex gap-1 mb-2">
              {vector.map((val, i) => (
                <div key={i} className="w-12 h-12 border border-green-300 flex items-center justify-center text-sm font-mono bg-green-50">
                  {val}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}