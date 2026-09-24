import { useEffect } from 'react';
import { X } from 'lucide-react';
import { byTicker } from '../data/demo';
import type { ResearchRun } from '../types';
import { WashAnalysis } from './WashAnalysis';
export function CandidateDetail({ run, ticker, close }: {
    run: ResearchRun;
    ticker: string;
    close: () => void;
}) {
    const c = byTicker[ticker];
    const state = run.universe[ticker];
    useEffect(() => { const dialog = document.getElementById('candidate-dialog') as HTMLDialogElement; dialog.showModal(); return () => dialog.close(); }, []);
    return <dialog id="candidate-dialog" aria-label={`${ticker} research detail`} className="candidate-dialog" onCancel={close} onClick={e => {
            if (e.target === e.currentTarget)
                close();
        }}>
    <div className="detail-inner">
    <button autoFocus className="close-button" onClick={close} aria-label="Close candidate detail">
    <X size={20}/>
    </button>
    <small>RESEARCH RECORD · {state.userExcluded ? 'EXCLUDED BY YOU' : 'RETAINED'}</small>
    <h2>{ticker}<span>{c.company}</span>
    </h2>
    <h3>Why it entered the thesis</h3>
    <p>{c.relationship}</p>
    <p>Exposure: {c.exposure}. Evidence confidence: {c.evidenceConfidence}. Sanitized fixture, not verified company research.</p>{state.trajectory.map(p => <div className="detail-snapshot" key={p.t}>
        <small>T{p.t} · OPS {p.ops} / RAP {p.rap} · {p.t === 0 ? 'NOT YET EVALUATED' : p.disposition}</small>
        <p>{p.why}</p>{p.t > 0 && <details>
            <summary>Inspect Wash {p.t} findings</summary>
            <WashAnalysis ticker={ticker} stage={p.t}/>
            </details>}</div>)}<h3>Decision history</h3>{run.exclusions.filter(e => e.ticker === ticker).length ? run.exclusions.filter(e => e.ticker === ticker).map(e => <p key={e.event}>{e.stage}: {e.decision.replaceAll('_', ' ').toLowerCase()}</p>) : <p>No user exclusions recorded.</p>}<small>Fixture {run.provenance.fixtureVersion} · {run.provenance.evidenceId}</small>
    </div>
    </dialog>;
}
