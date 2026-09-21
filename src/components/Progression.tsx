import { Check, ArrowRight } from "lucide-react";
import type { ResearchRun } from "../types";
export function Progression({
  run,
  stage,
  onComplete,
}: {
  run: ResearchRun;
  stage: number;
  onComplete: () => void;
}) {
  return (
    <section className="progression">
      <div className="eyebrow">{run.id} / DEMONSTRATION IN PROGRESS</div>
      <h1>
        From possibility
        <br />
        to a focused shortlist.
      </h1>
      <p className="intro">{run.thesis}</p>
      <div className="progress-layout">
        <ol className="stage-list">
          {run.stages.map((s, i) => (
            <li
              key={s.id}
              className={i === stage ? "current" : i < stage ? "done" : ""}
              aria-current={i === stage ? "step" : undefined}
            >
              <span className="step-number">
                {i < stage ? (
                  <Check size={15} />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <span>{s.label}</span>
              {i === stage && <ArrowRight size={16} />}
            </li>
          ))}
        </ol>
        <div className="progress-metric" aria-live="polite">
          <span className="eyebrow">{run.stages[stage].label}</span>
          <strong>{run.stages[stage].count}</strong>
          <h2>
            {stage < 2
              ? "Plausible securities"
              : stage === 2
                ? "Verified candidates"
                : stage === 3
                  ? "Eligible securities"
                  : stage === 4
                    ? "Ranked candidates"
                    : "Finalists"}
          </h2>
          <p>{run.stages[stage].description}</p>
          <div className="contraction-meter">
            <div
              style={{
                width: `${Math.max(5, (run.stages[stage].count / 128) * 100)}%`,
              }}
            />
          </div>
          <small>Deterministic presentation · simulated counts</small>
        </div>
      </div>
      <button className="text-button" onClick={onComplete}>
        Complete demo <ArrowRight size={16} />
      </button>
    </section>
  );
}
