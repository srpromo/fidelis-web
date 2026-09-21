import { useState } from "react";
import { ArrowDownUp, ArrowUpRight } from "lucide-react";
import type { Candidate } from "../types";
type Sort = "rank" | "ticker" | "relevance" | "evidence";
export function CandidateTable({
  candidates,
  selected,
  onSelect,
}: {
  candidates: Candidate[];
  selected: string | null;
  onSelect: (ticker: string) => void;
}) {
  const [sort, setSort] = useState<Sort>("rank");
  const [asc, setAsc] = useState(true);
  function change(key: Sort) {
    setAsc(key === sort ? !asc : key === "ticker" || key === "rank");
    setSort(key);
  }
  const value = (c: Candidate) =>
    sort === "ticker"
      ? c.ticker
      : sort === "rank"
        ? c.decision.rank
        : sort === "relevance"
          ? c.inference.relevance
          : c.evidence.strength;
  const rows = [...candidates].sort((a, b) => {
    const av = value(a),
      bv = value(b);
    return (
      (typeof av === "string"
        ? av.localeCompare(String(bv))
        : Number(av) - Number(bv)) * (asc ? 1 : -1)
    );
  });
  const head = (key: Sort, label: string) => (
    <th
      scope="col"
      aria-sort={sort === key ? (asc ? "ascending" : "descending") : "none"}
    >
      <button onClick={() => change(key)}>
        {label}
        <ArrowDownUp size={12} />
      </button>
    </th>
  );
  return (
    <section className="table-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">03 / CANDIDATE REVIEW</span>
          <h2>
            The research shortlist <span className="count">08</span>
          </h2>
        </div>
        <span className="muted">Select a company to inspect its reasoning</span>
      </div>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="Scrollable candidate table">
        <table>
          <caption className="sr-only">
            Illustrative candidate scores, eligibility and dispositions. All
            metrics are simulated.
          </caption>
          <thead>
            <tr>
              {head("rank", "Rank")}
              {head("ticker", "Company")}
              <th>Domain</th>
              {head("relevance", "Relevance")}
              {head("evidence", "Evidence")}
              <th>Eligibility</th>
              <th>Liquidity*</th>
              <th>Disposition</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.ticker}
                className={selected === c.ticker ? "selected" : ""}
              >
                <td className="rank">
                  {String(c.decision.rank).padStart(2, "0")}
                </td>
                <td>
                  <button
                    className="company-button"
                    onClick={() => onSelect(c.ticker)}
                    aria-label={`Inspect ${c.ticker}`}
                  >
                    <strong>
                      {c.ticker}
                      <ArrowUpRight size={13} />
                    </strong>
                    <span>{c.company}</span>
                  </button>
                </td>
                <td className="domain-cell">{c.domain}</td>
                <td>
                  <span className="score">
                    {c.inference.relevance}
                    <span className="mini-bar">
                      <i style={{ width: `${c.inference.relevance}%` }} />
                    </span>
                  </span>
                </td>
                <td>
                  <span className="score evidence-score">
                    {c.evidence.strength}
                    <span className="mini-bar">
                      <i style={{ width: `${c.evidence.strength}%` }} />
                    </span>
                  </span>
                </td>
                <td>
                  <span
                    className={
                      c.decision.eligibility === "Eligible"
                        ? "eligible"
                        : "review"
                    }
                  >
                    {c.decision.eligibility}
                  </span>
                </td>
                <td>{c.decision.liquidity}</td>
                <td>
                  <span
                    className={`disposition ${c.decision.disposition.toLowerCase()}`}
                  >
                    {c.decision.disposition}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="table-note">
        * Demo liquidity tiers and all numerical scores are simulated—not
        current market measurements.
      </p>
    </section>
  );
}
