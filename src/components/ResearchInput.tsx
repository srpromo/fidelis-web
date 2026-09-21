import { ArrowRight, Layers3, ScanLine, GitBranch } from "lucide-react";
import { useState } from "react";
import { demoThesis } from "../data/demo";
export function ResearchInput({ onRun }: { onRun: (thesis: string) => void }) {
  const [thesis, setThesis] = useState(demoThesis);
  return (
    <section className="launch">
      <div className="eyebrow">A DISCIPLINED PATH FROM THESIS TO CANDIDATE</div>
      <h1>
        Conviction begins
        <br />
        with <em>evidence.</em>
      </h1>
      <p className="intro">
        Turn a market thesis into an inspectable research shortlist.
        <br />
        Follow the evidence. Understand the inference. Own the decision.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (thesis.trim()) onRun(thesis.trim());
        }}
        className="thesis-form"
      >
        <label htmlFor="thesis">
          YOUR RESEARCH THESIS <span>01 / DEFINE</span>
        </label>
        <textarea
          id="thesis"
          maxLength={600}
          value={thesis}
          onChange={(e) => setThesis(e.target.value)}
          rows={3}
        />
        <div className="input-bottom">
          <span>
            Alpha uses a fixed semiconductor demonstration.
            <br />
            Editing the thesis does not change fixture results.
          </span>
          <button className="primary" disabled={!thesis.trim()} type="submit">
            Run Fidelis <ArrowRight size={17} />
          </button>
        </div>
      </form>
      <div className="principles">
        <article>
          <Layers3 />
          <h2>Evidence first</h2>
          <p>Keep source observations separate from what they might mean.</p>
        </article>
        <article>
          <ScanLine />
          <h2>Bounded verification</h2>
          <p>
            Narrow the universe through deliberate, inspectable research steps.
          </p>
        </article>
        <article>
          <GitBranch />
          <h2>Decisions in context</h2>
          <p>See why a candidate advances—and what remains uncertain.</p>
        </article>
      </div>
      <p className="demo-note">
        FID-DEMO-001 <span>•</span> No live research or market data{" "}
        <span>•</span> All scores are illustrative
      </p>
    </section>
  );
}
