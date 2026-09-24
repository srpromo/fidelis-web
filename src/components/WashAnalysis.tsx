import { useState } from 'react';
import { byTicker } from '../data/demo';
import type { Candidate, SpecialistState } from '../types';
function Specialist({ s }: {
    s: SpecialistState;
}) {
    return <details className="specialist">
    <summary>
    <span>
    <small>{s.id}</small>
    <strong>{s.name}</strong>
    </span>
    <span>{s.state}<small>{s.momentum} · {s.confidence} confidence</small>
    </span>
    </summary>
    <div className="specialist-body">
    <b>Evidence</b>
    <p>{s.evidence.text}</p>
    <b>Inference</b>
    <p>{s.inference.text}</p>
    <small>{s.evidence.limitation}</small>
    </div>
    </details>;
}
export function WashAnalysis({ ticker, stage }: {
    ticker: string;
    stage: number;
}) {
    const c = byTicker[ticker];
    return <section className="wash-analysis">
    <div className="section-heading">
    <div>
    <small>{ticker} · {c.company} · SANITIZED DEMONSTRATION</small>
    <h2>{stage === 1 ? 'Reality before recognition.' : stage === 2 ? 'Does the causal chain survive?' : 'The strongest case against it.'}</h2>
    </div>
    <span className="pill">Wash {stage}</span>
    </div>{stage === 1 ? <Reality c={c}/> : stage === 2 ? <Survival c={c}/> : <Adversarial c={c}/>}</section>;
}
function Reality({ c }: {
    c: Candidate;
}) {
    const cycles = ['DORMANT', 'EMERGING', 'EXPANDING', 'CONFIRMED', 'SATURATED', 'DISTRIBUTING', 'CONTRACTING', 'RESET'];
    return <>
    <div className="reality-columns">
    <section>
    <small>INDEPENDENT MEASUREMENT 01</small>
    <h3>Economic Reality</h3>
    <p>What is improving in the business?</p>{c.specialists.slice(0, 2).map(s => <Specialist key={s.id} s={s}/>)}</section>
    <section>
    <small>INDEPENDENT MEASUREMENT 02</small>
    <h3>Market Recognition</h3>
    <p>What is the security already expressing?</p>{c.specialists.slice(2).map(s => <Specialist key={s.id} s={s}/>)}</section>
    </div>
    <div className="gap">
    <small>COMPARE ONLY AFTER BOTH ARE MEASURED</small>
    <h3>{c.gap.toLowerCase()}</h3>
    <p>{c.points[1].why}</p>
    <p className="muted">A discrepancy invites investigation; it is not proof of mispricing. An expensive security can still be justified by duration and growth.</p>
    </div>
    <details className="explain">
    <summary>Inspect the volume cycle & timing hypothesis</summary>
    <div className="cycle">{cycles.map(s => <span className={s === c.volumeCycle ? 'active' : ''} key={s}>{s.toLowerCase()}</span>)}</div>
    <p>Current fixture state: <b>{c.volumeCycle}</b>. Participation and persistence describe demand for the security, independently of demand for the company’s products.</p>
    <p>Technical compression → tentative expansion. Confirmation is incomplete; timing does not establish economic truth.</p>
    </details>
    </>;
}
function Survival({ c }: {
    c: Candidate;
}) {
    const [link, setLink] = useState(0);
    return <>
    <div className="chain" aria-label="Causal transmission links">{c.causalLinks.map((l, i) => <button key={l.label} className={link === i ? 'active' : ''} onClick={() => setLink(i)}>
        <small>0{i + 1}</small>{l.label}<span>{i < 3 ? '→' : '↗'}</span>
        </button>)}</div>
    <div className="chain-detail">
    <small>CT · CAUSAL THESIS / {c.causalLinks[link].state}</small>
    <p>{c.causalLinks[link].explanation}</p>
    </div>
    <div className="analysis-grid">
    <article>
    <small>RF · RISK / FRAGILITY</small>
    <h3>The transmission can break.</h3>
    <p>{c.risk.mechanism}</p>
    <dl>
    <dt>Likelihood</dt>
    <dd>{c.risk.likelihood}</dd>
    <dt>Severity / horizon</dt>
    <dd>{c.risk.severity} / {c.risk.horizon}</dd>
    <dt>Mitigation</dt>
    <dd>{c.risk.mitigation}</dd>
    <dt>Confidence</dt>
    <dd>{c.risk.confidence}</dd>
    </dl>
    </article>
    <article>
    <small>BR · BASE RATES / HISTORICAL ANALOGUES</small>
    <h3>A useful comparison, not a probability.</h3>
    <p>{c.analogue}</p>
    <p className="muted">The historical analogue is illustrative. No empirical probability or backtest is claimed.</p>
    </article>
    </div>
    <details className="explain">
    <summary>Context that changes this particular pathway</summary>
    <div className="context-grid">
    <article>
    <h4>MR · Macro / market regime</h4>
    <p>{c.context.macro}</p>
    </article>
    <article>
    <h4>SI · Sector / industry</h4>
    <p>{c.context.industry}</p>
    </article>
    <article>
    <h4>DC · Dependency / correlation</h4>
    <p>{c.context.dependency}</p>
    </article>
    </div>
    <small>These demonstrate the intended contextual architecture; no historical context engine was executed.</small>
    </details>
    </>;
}
function Adversarial({ c }: {
    c: Candidate;
}) {
    return <>
    <div className="adversarial">
    <small>AR · ADVERSARIAL REVIEW · {c.adversarial.verdict}</small>
    <h3>{c.adversarial.caseAgainst}</h3>
    <div className="analysis-grid">
    <div>
    <h4>Case for</h4>
    <p>{c.adversarial.caseFor}</p>
    </div>
    <div>
    <h4>Alternative explanation</h4>
    <p>{c.adversarial.alternative}</p>
    </div>
    </div>
    <p className="missing">Still missing: {c.adversarial.missing}</p>
    </div>
    <div className="analysis-grid">
    <article>
    <small>SY · COMPARATIVE SYNTHESIS</small>
    <h3>{c.points[3].disposition.replaceAll('_', ' ').toLowerCase()}</h3>
    <p>{c.comparative}</p>
    <p className="muted">Relative merit considers durability, fragility and expectations. No hidden composite ranking is presented.</p>
    </article>
    <article>
    <small>EI · EVIDENCE INTEGRITY</small>
    <dl>{Object.entries(c.integrity).map(([key, v]) => <div key={key}>
        <dt>{key}</dt>
        <dd>{v}</dd>
        </div>)}</dl>
    </article>
    </div>
    <details className="explain">
    <summary>How a future independent model challenge would be compared</summary>
    <p>A primary interpretation could emphasize improving conversion; a challenger could emphasize front-loaded orders. Material disagreement would remain visible and reduce confidence rather than be averaged away.</p>
    <p>Every provider would receive the same frozen evidence and specialist contract. This is an architecture illustration: no second model, provider result or model agreement was generated.</p>
    </details>
    </>;
}
