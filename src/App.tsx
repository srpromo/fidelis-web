import { useEffect, useState } from "react";
import { createDemoRun, demoThesis } from "./data/demo";
import { Shell } from "./components/Shell";
import { ResearchInput } from "./components/ResearchInput";
import { Progression } from "./components/Progression";
import { ResultsWorkspace } from "./components/ResultsWorkspace";
export default function App() {
  const [run, setRun] = useState(() => createDemoRun(demoThesis));
  const [stage, setStage] = useState(0);
  const complete = () => setRun((r) => ({ ...r, status: "Complete" }));
  useEffect(() => {
    if (run.status !== "Running") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      complete();
      return;
    }
    const timer = window.setInterval(
      () => setStage((s) => Math.min(s + 1, 6)),
      650,
    );
    return () => clearInterval(timer);
  }, [run.status]);
  useEffect(() => {
    if (stage === 6 && run.status === "Running") complete();
  }, [stage, run.status]);
  const reset = () => {
    setRun(createDemoRun(demoThesis));
    setStage(0);
  };
  return (
    <Shell onReset={reset}>
      {run.status === "Ready" ? (
        <ResearchInput
          onRun={(thesis) => {
            setStage(0);
            setRun({ ...createDemoRun(thesis), status: "Running" });
          }}
        />
      ) : run.status === "Running" ? (
        <Progression run={run} stage={stage} onComplete={complete} />
      ) : (
        <ResultsWorkspace run={run} onReset={reset} />
      )}
    </Shell>
  );
}
