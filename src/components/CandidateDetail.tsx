import { useEffect, useRef } from "react";
import { X, FileText, ShieldCheck } from "lucide-react";
import type { Candidate, Provenance } from "../types";
export function CandidateDetail({
  candidate: c,
  provenance,
  onClose,
}: {
  candidate: Candidate;
  provenance: Provenance;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="detail"
      aria-labelledby="detail-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="detail-inner">
        <div className="detail-top">
          <span className="eyebrow">CANDIDATE DOSSIER / DEMO</span>
          <button
            className="icon-button"
            aria-label="Close candidate detail"
            onClick={onClose}
            autoFocus
          >
            <X size={20} />
          </button>
        </div>
        <h2 id="detail-title">{c.ticker}</h2>
        <p className="detail-company">{c.company}</p>
        <p className="domain-label">{c.domain}</p>
        <div className="detail-scores">
          <div>
            <span>Demo rank</span>
            <strong>#{c.decision.rank}</strong>
          </div>
          <div>
            <span>Relevance</span>
            <strong>
              {c.inference.relevance}
              <small>/100</small>
            </strong>
          </div>
          <div>
            <span>Evidence</span>
            <strong>
              {c.evidence.strength}
              <small>/100</small>
            </strong>
          </div>
        </div>
        <section>
          <span className="tag evidence">EVIDENCE</span>
          <h3>What the fixture represents</h3>
          <p>{c.evidence.summary}</p>
          <ul className="source-types">
            {c.evidence.sourceTypes.map((s) => (
              <li key={s}>
                <FileText size={14} />
                {s} <small>source type only</small>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <span className="tag inference">INFERENCE</span>
          <h3>Why considered relevant</h3>
          <p>{c.inference.rationale}</p>
        </section>
        <section>
          <span className="tag decision">DECISION</span>
          <h3>{c.decision.disposition}</h3>
          <p>
            {c.decision.eligibility} in this demonstration ·{" "}
            {c.decision.liquidity} simulated liquidity. This disposition
            illustrates a workflow, not an investment recommendation.
          </p>
        </section>
        <section className="limitation">
          <h3>Uncertainty stays visible</h3>
          <p>
            {c.limitations} The fixture establishes no current eligibility,
            valuation or suitability.
          </p>
        </section>
        <div className="provenance">
          <ShieldCheck size={16} />
          <div>
            <strong>FID-DEMO-001 · {provenance.governance}</strong>
            <p>
              {provenance.evidence} · Provider calls: {provenance.providerCalls}
              <br />
              No live source retrieval. No raw filing text.
            </p>
          </div>
        </div>
      </div>
    </dialog>
  );
}
