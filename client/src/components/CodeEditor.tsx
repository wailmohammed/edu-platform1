import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Copy, RotateCcw, Zap } from "lucide-react";
import { toast } from "sonner";

interface CodeEditorProps {
  language?: string;
  defaultCode?: string;
  testCases?: Array<{ input: string; expectedOutput: string; description: string }>;
  onSubmit?: (code: string) => Promise<boolean>;
  readOnly?: boolean;
}

export default function CodeEditor({
  language = "python",
  defaultCode = '# Write your solution here\ndef solve():\n    pass',
  testCases = [],
  onSubmit,
  readOnly = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; description: string }>>([]);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      // Simulate code execution
      // In production, this would call a backend API to execute the code safely
      setOutput("Code executed successfully!\n\nOutput:\nHello, World!");
      toast.success("Code executed!");
    } catch (error) {
      setOutput(`Error: ${error}`);
      toast.error("Execution failed");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!onSubmit) {
      toast.error("Submit not configured");
      return;
    }

    setIsRunning(true);
    try {
      const success = await onSubmit(code);
      if (success) {
        toast.success("Solution submitted successfully!");
        setTestResults(testCases.map(() => ({ passed: true, description: "Passed" })));
      } else {
        toast.error("Solution failed validation");
      }
    } catch (error) {
      toast.error("Submission failed");
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleReset = () => {
    setCode(defaultCode);
    setOutput("");
    setTestResults([]);
  };

  return (
    <div className="space-y-4">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{language.toUpperCase()}</Badge>
          <span className="text-sm text-slate-600">
            {code.split("\n").length} lines
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Code Editor */}
      <Card>
        <CardContent className="p-0">
          <div className="bg-slate-900 rounded-lg overflow-hidden">
            {/* Editor Toolbar */}
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-400">Code Editor</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRun}
                  disabled={isRunning || readOnly}
                  className="gap-2 text-slate-300 hover:text-white"
                >
                  <Play className="w-4 h-4" />
                  Run
                </Button>
                {onSubmit && (
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isRunning || readOnly}
                    className="gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Submit
                  </Button>
                )}
              </div>
            </div>

            {/* Code Area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={readOnly}
              className="w-full h-64 p-4 bg-slate-900 text-slate-100 font-mono text-sm resize-none focus:outline-none border-none"
              placeholder="Write your code here..."
              spellCheck="false"
            />
          </div>
        </CardContent>
      </Card>

      {/* Output & Test Results */}
      <Tabs defaultValue="output" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="output">Output</TabsTrigger>
          <TabsTrigger value="tests">Test Cases ({testCases.length})</TabsTrigger>
        </TabsList>

        {/* Output Tab */}
        <TabsContent value="output">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Console Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm min-h-24 max-h-48 overflow-auto whitespace-pre-wrap break-words">
                {output || (
                  <span className="text-slate-500">
                    Run your code to see output here...
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Cases Tab */}
        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Test Cases</CardTitle>
              <CardDescription>
                {testResults.length > 0
                  ? `${testResults.filter((r) => r.passed).length}/${testResults.length} passed`
                  : "Run your code to test"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {testCases.length === 0 ? (
                <p className="text-sm text-slate-600">No test cases available</p>
              ) : (
                testCases.map((testCase, index) => (
                  <div
                    key={index}
                    className="p-3 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm">
                        Test {index + 1}: {testCase.description}
                      </span>
                      {testResults[index] && (
                        <Badge
                          variant={testResults[index].passed ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {testResults[index].passed ? "✓ Passed" : "✗ Failed"}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p>
                        <span className="font-medium">Input:</span> {testCase.input}
                      </p>
                      <p>
                        <span className="font-medium">Expected:</span>{" "}
                        {testCase.expectedOutput}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            💡 <strong>Tip:</strong> Write clean, well-commented code. Test your solution
            thoroughly before submitting.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
