import { useState } from "react";
import { ArrowLeft, Check, Info } from "lucide-react";
import type { ResearchRun } from "../types";
import { RankingChart, ContractionChart } from "./Charts";
import { CandidateTable } from "./CandidateTable";
import { CandidateDetail } from "./CandidateDetail";
export function ResultsWorkspace({
  run,
  onReset,
}: {
  run: ResearchRun;
  onReset: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const candidate = run.candidates.find((c) => c.ticker === selected);
  return (
    <div className="workspace">
      <div className="workspace-meta">
        <button className="text-button" onClick={onReset}>
          <ArrowLeft size={14} /> New thesis
        </button>
        <span>
          {run.id} <span className="separator">/</span>{" "}
          <span className="completed">
            <Check size={13} /> Demo complete
          </span>
        </span>
      </div>
      <section className="thesis-summary">
        <div>
          <span className="eyebrow">RESEARCH THESIS</span>
          <h1>{run.thesis}</h1>
          <p>
            Fixed semiconductor demonstration · scores and dispositions are
            illustrative
          </p>
        </div>
        <div className="run-seal">
          <span className="dot" /> REPRODUCIBLE<span>Sanitized fixture</span>
        </div>
      </section>
      <div className="metrics">
        {[
          ["128", "Discovered"],
          ["42", "Verified"],
          ["18", "Eligible"],
          ["8", "Ranked"],
          ["4", "Finalists"],
        ].map(([n, label], i) => (
          <div key={label} className={i === 4 ? "metric-final" : ""}>
            <span>
              {String(i + 1).padStart(2, "0")} / {label}
            </span>
            <strong>{n}</strong>
            <small>
              {i === 4 ? "For focused review" : "Simulated securities"}
            </small>
          </div>
        ))}
      </div>
      <div className="chart-grid">
        <RankingChart
          candidates={run.candidates}
          selected={selected}
          onSelect={setSelected}
        />
        <ContractionChart stages={run.stages} />
      </div>
      <CandidateTable
        candidates={run.candidates}
        selected={selected}
        onSelect={setSelected}
      />
      <section className="exceptions">
        <div>
          <span className="eyebrow">EXCEPTIONS & LIMITATIONS</span>
          <h2>Uncertainty is part of the result.</h2>
        </div>
        <div>
          {run.exceptions.map((e) => (
            <article key={e.ticker}>
              <Info size={16} />
              <div>
                <strong>
                  {e.ticker} · {e.reason}
                </strong>
                <p>{e.consequence}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="governance-strip">
        <span>
          Mode <strong>{run.provenance.mode}</strong>
        </span>
        <span>
          Evidence <strong>{run.provenance.evidence}</strong>
        </span>
        <span>
          Provider calls <strong>0</strong>
        </span>
        <span>
          Governance <strong>{run.provenance.governance}</strong>
        </span>
      </div>
      {candidate && (
        <CandidateDetail
          candidate={candidate}
          provenance={run.provenance}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
