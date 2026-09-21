import { useState } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  LabelList,
} from "recharts";
import type { Candidate, ResearchStage } from "../types";
export function RankingChart({
  candidates,
  selected,
  onSelect,
}: {
  candidates: Candidate[];
  selected: string | null;
  onSelect: (ticker: string) => void;
}) {
  const data = candidates.map((c) => ({
    x: c.inference.relevance,
    y: c.evidence.strength,
    ticker: c.ticker,
    rank: c.decision.rank,
  }));
  return (
    <section className="chart-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">01 / CANDIDATE POSITIONING</span>
          <h2>Relevance meets evidence</h2>
        </div>
        <span className="tag inference">INFERENCE</span>
      </div>
      <p className="chart-caption">
        Illustrative scores · select a point to inspect a candidate
      </p>
      <div
        className="chart"
        role="img"
        aria-label="Candidate relevance versus evidence strength; use candidate buttons below for keyboard selection"
      >
        <ResponsiveContainer width="100%" height={255}>
          <ScatterChart margin={{ top: 20, right: 24, bottom: 20, left: 0 }}>
            <CartesianGrid stroke="#e5e8e4" strokeDasharray="3 4" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[55, 100]}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Thesis relevance →",
                position: "bottom",
                offset: 0,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[70, 100]}
              tickLine={false}
              axisLine={false}
              width={35}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <div className="chart-tooltip">
                    <strong>{payload[0].payload.ticker}</strong>
                    <span>Relevance {payload[0].payload.x} / 100</span>
                    <span>Evidence {payload[0].payload.y} / 100</span>
                    <span>Demo rank #{payload[0].payload.rank}</span>
                  </div>
                ) : null
              }
            />
            <Scatter
              data={data}
              onClick={(d) => onSelect(d.payload.ticker)}
              isAnimationActive={false}
            >
              {data.map((d) => (
                <Cell
                  key={d.ticker}
                  fill={selected === d.ticker ? "#a17435" : "#2d6d61"}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
              <LabelList
                dataKey="ticker"
                position="top"
                fill="#334843"
                fontSize={10}
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-legend">
        <span>↑ Evidence strength</span>
        <div>
          {candidates.map((c) => (
            <button
              aria-label={`Inspect ${c.ticker} chart`}
              aria-pressed={selected === c.ticker}
              key={c.ticker}
              onClick={() => onSelect(c.ticker)}
            >
              {c.ticker}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
export function ContractionChart({ stages }: { stages: ResearchStage[] }) {
  const data = stages
    .filter((s) =>
      [
        "discovery",
        "verification",
        "eligibility",
        "ranking",
        "analysis",
      ].includes(s.id),
    )
    .map((s) => ({ ...s, label: s.id === "analysis" ? "Finalists" : s.label }));
  const [active, setActive] = useState(data[0]);
  return (
    <section className="chart-panel contraction">
      <div className="section-heading">
        <div>
          <span className="eyebrow">02 / RESEARCH DISCIPLINE</span>
          <h2>A narrowing universe</h2>
        </div>
        <span className="tag decision">DECISION</span>
      </div>
      <p className="chart-caption">
        Simulated funnel · select a stage to see its purpose
      </p>
      <div
        role="img"
        aria-label="Universe contracts from 128 discovered securities to 4 finalists"
      >
        <ResponsiveContainer width="100%" height={210}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis type="number" hide domain={[0, 145]} />
            <YAxis
              type="category"
              dataKey="label"
              width={85}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: "#f3f4f0" }}
              formatter={(v) => [`${v} securities`, "Simulated count"]}
            />
            <Bar
              dataKey="count"
              barSize={19}
              onClick={(d) => setActive(data.find((s) => s.id === d.id)!)}
              isAnimationActive={false}
            >
              {data.map((s) => (
                <Cell
                  key={s.id}
                  fill={s.id === active.id ? "#255d52" : "#a8c0b7"}
                />
              ))}
              <LabelList
                dataKey="count"
                position="right"
                fill="#334843"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="stage-tabs" aria-label="Inspect research stage">
        {data.map((s) => (
          <button
            key={s.id}
            aria-pressed={active.id === s.id}
            onClick={() => setActive(s)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="stage-explanation" aria-live="polite">
        <strong>{active.count} securities · </strong>
        {active.description}
      </p>
    </section>
  );
}
