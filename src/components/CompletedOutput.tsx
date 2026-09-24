import { useState } from 'react';
import { Check } from 'lucide-react';
import type { ResearchRun } from '../types';
import { CausalMap, Trajectory, Contraction } from './ResearchVisuals';
import { WashAnalysis } from './WashAnalysis';
export function Output({ run, selected, select, inspect }: {
    run: ResearchRun;
    selected: string;
    select: (id: string) => void;
    inspect: (id: string) => void;
}) {
    const [tab, setTab] = useState('Conclusion');
    const [history, setHistory] = useState(3);
    return <>
    <section className="completion">
    <small>RESEARCH COMPLETE · DEMONSTRATION</small>
    <h2>Conviction, with conditions.</h2>
    <p>{run.lockedThesis?.proposition}</p>
    <div className="completion-meta">
    <span>{run.expressions.map(e => e.ticker).join(' / ')}</span>
    <span>3 washes completed</span>
    <span>Case against retained</span>
    </div>
    </section>
    <div className="output-tabs" role="tablist" aria-label="Completed research">{['Conclusion', 'Expressions', 'Research history', 'Evidence & boundaries'].map(t => <button role="tab" aria-selected={t === tab} key={t} onClick={() => setTab(t)}>{t}</button>)}</div>
    <div role="tabpanel" aria-label={tab}>{tab === 'Conclusion' ? <>
        <section className="support">
        <small>PROBABILITY / THESIS SUPPORT</small>
        <h2>{run.support?.label}</h2>
        <p>This is a qualitative support state, not a calibrated probability of thesis success, stock appreciation or option profit.</p>
        <div className="support-contributors">{run.support?.contributors.map(c => <div key={c.label}>
            <small>{c.label}</small>
            <p>{c.state}</p>
            </div>)}</div>
        </section>
        <div className="case-grid">
        <section>
        <small>THE CASE FOR</small>
        <h2>What must keep working.</h2>
        <ul>{run.caseFor?.points.map(p => <li key={p}>{p}</li>)}</ul>
        </section>
        <section className="case-against">
        <small>THE CASE AGAINST</small>
        <h2>Where the thesis breaks.</h2>
        <ul>{run.caseAgainst?.points.map(p => <li key={p}>{p}</li>)}</ul>
        </section>
        </div>
        <section className="falsifiers">
        <small>WHAT WOULD CHANGE THE CONCLUSION</small>
        <h2>Keep the falsifiers in view.</h2>
        <ul>
        <li>
        <b>Your locked falsifier:</b> {run.lockedThesis?.falsifiers}</li>{run.caseAgainst?.changeConditions.map(p => <li key={p}>{p}</li>)}</ul>
        </section>
        </> : tab === 'Expressions' ? <>
        <p className="intro">Illustrative structural fit. This is not an order, a live options comparison or a claim that a security is attractively priced.</p>{run.expressions.map(e => <article key={e.ticker} className="expression-result">
            <small>{e.ticker} · SELECTED FINALIST</small>
            <h2>{e.structure}</h2>
            <p>{e.rationale}</p>
            <div className="analysis-grid">
            <div>
            <h3>Expression-specific conditions</h3>
            <ul>{e.successConditions.map(p => <li key={p}>{p}</li>)}</ul>
            </div>
            <div>
            <h3>Inherited business & recognition risk</h3>
            <ul>{e.inheritedRisks.map(p => <li key={p}>{p}</li>)}</ul>
            </div>
            </div>
            <details>
            <summary>Compare structural alternatives</summary>
            <table>
            <thead>
            <tr>
            <th>Structure</th>
            <th>Why consider it</th>
            <th>What it costs</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td>Common stock</td>
            <td>No expiry; greater timing tolerance</td>
            <td>Full equity downside and capital commitment</td>
            </tr>
            <tr>
            <td>Long-duration call</td>
            <td>Convex upside with limited initial premium</td>
            <td>Premium loss, volatility sensitivity, finite time</td>
            </tr>
            <tr>
            <td>Call debit spread</td>
            <td>Defined premium exposure</td>
            <td>Capped upside; both strikes and expiry require live evaluation</td>
            </tr>
            </tbody>
            </table>
            </details>
            </article>)}</> : tab === 'Research history' ? <>
        <details className="explain">
        <summary>Original observation & thesis conversation</summary>{run.conversation.map((m, i) => <p key={i}>
            <b>{m.role}: </b>{m.text}</p>)}<p>Draft versions preserved: {run.drafts.map(d => d.version).join(', ')}. Locked version: {run.lockedThesis?.version}.</p>
        </details>
        <CausalMap run={run} selected={selected} select={id => { select(id); inspect(id); }}/>
        <Trajectory run={run} selected={selected} select={select}/>
        <Contraction run={run}/>
        <div className="segmented">{[1, 2, 3].map(i => <button key={i} className={history === i ? 'active' : ''} onClick={() => setHistory(i)}>Wash {i}</button>)}</div>{run.universe[selected]?.trajectory.some(p => p.t === history) ? <WashAnalysis ticker={selected} stage={history}/> : <p>No snapshot: this candidate did not participate.</p>}<div className="ticker-strip">{Object.keys(run.universe).map(id => <button key={id} onClick={() => inspect(id)}>Inspect {id}</button>)}</div>
        <h3>User decisions</h3>{run.exclusions.length ? run.exclusions.map(e => <p key={e.event}>{e.ticker} · {e.decision} · {e.stage}</p>) : <p>All initial candidates were retained for research.</p>}</> : <section className="evidence-boundaries">
        <h2>What this output is built on.</h2>
        <dl>
        <dt>Evidence source</dt>
        <dd>Sanitized deterministic demonstration fixtures. No current primary documents or market observations retrieved.</dd>
        <dt>Evidence identity</dt>
        <dd>{run.provenance.evidenceId} · {run.provenance.fixtureVersion}</dd>
        <dt>Provider activity</dt>
        <dd>0 calls. No model comparison executed. Future providers share a frozen evidence contract.</dd>
        <dt>Confidence boundary</dt>
        <dd>Qualitative, uncalibrated. Missing contract, cancellation and cash-conversion checks are material.</dd>
        <dt>Point-in-time integrity</dt>
        <dd>No claim of historical completeness or current freshness.</dd>
        <dt>Account / entitlement gates</dt>
        <dd>Disabled for this demonstration. No authentication or payment required.</dd>
        <dt>Completion boundary</dt>
        <dd>This run ends at research output. No monitoring, portfolio, order, allocation or production action follows.</dd>
        </dl>
        <h3>Expression preferences preserved</h3>{Object.entries(run.preferences).map(([k, v]) => <p key={k}>
            <b>{k}:</b> {v}</p>)}</section>}</div>
    <div className="end-mark">
    <Check size={16}/> End of research · no action has been executed.</div>
    </>;
}
