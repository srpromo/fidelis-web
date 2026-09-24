import { useState } from 'react';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';
import { byTicker } from '../data/demo';
import type { Props } from './shared';
export function Curation({ run, dispatch, select, selected, inspect }: Props & {
    select: (id: string) => void;
    selected: string;
    inspect: (id: string) => void;
}) {
    const [filter, setFilter] = useState('all');
    const [compare, setCompare] = useState<string[]>([]);
    const current = run.stage === 'DISCOVERY' ? 0 : Number(run.stage.slice(-1));
    const rows = Object.values(run.universe).filter(c => filter === 'all' || (filter === 'excluded' ? c.userExcluded : !c.userExcluded));
    return <section className="curation">
    <div className="section-heading">
    <div>
    <small>CURATE BEFORE YOU CONTINUE</small>
    <h2>Keep the question open.</h2>
    </div>
    <div className="segmented">{['all', 'retained', 'excluded'].map(f => <button key={f} aria-pressed={filter === f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div>
    </div>
    <p className="muted">Inspect a candidate, compare two, or exclude it. Analytical holds do not silently remove a company. Excluded candidates remain in the record.</p>
    <div className="table-scroll">
    <table>
    <thead>
    <tr>
    <th>Compare</th>
    <th>Candidate / exposure</th>
    <th>Research state</th>
    <th>OPS / RAP</th>
    <th>Your decision</th>
    </tr>
    </thead>
    <tbody>{rows.map(c => {
            const candidate = byTicker[c.ticker];
            const p = c.trajectory.at(-1)!;
            return <tr key={c.ticker} className={`${selected === c.ticker ? 'selected-row' : ''} ${c.userExcluded ? 'excluded-row' : ''}`}>
            <td>
            <input type="checkbox" aria-label={`Compare ${c.ticker}`} checked={compare.includes(c.ticker)} disabled={!compare.includes(c.ticker) && compare.length === 2} onChange={() => setCompare(compare.includes(c.ticker) ? compare.filter(id => id !== c.ticker) : [...compare, c.ticker])}/>
            </td>
            <td>
            <button className="candidate-link" aria-label={`Inspect ${c.ticker} ${candidate.company}`} onClick={() => { select(c.ticker); inspect(c.ticker); }}>
            <b>{c.ticker} <ArrowUpRight size={13}/>
            </b>
            <span>{candidate.company}</span>
            </button>
            <small>{candidate.pathway}{candidate.recall ? ' · recalled after Wash 1' : ''}</small>
            </td>
            <td>
            <span className={`status ${p.disposition === 'THESIS_FAILURE' ? 'failure' : ''}`}>{p.t === 0 ? 'NOT YET EVALUATED' : p.disposition.replaceAll('_', ' ')}</span>
            <small>T{p.t} · {candidate.evidenceConfidence} evidence confidence</small>
            </td>
            <td className="coordinates">{p.ops} / {p.rap}</td>
            <td>
            <button className="curate-button" disabled={c.userExcluded && p.t !== current} onClick={() => dispatch({ type: 'CURATE', ticker: c.ticker })}>{c.userExcluded ? <Plus size={13}/> : <Minus size={13}/>} {c.userExcluded ? 'Restore' : 'Exclude'} {c.ticker}</button>{c.userExcluded && p.t !== current && <small>Missed a completed wash;<br />history remains available.</small>}</td>
            </tr>;
        })}</tbody>
    </table>
    </div>{!rows.length && <p className="notice">No candidates in this view.</p>}{compare.length > 0 && <div className="comparison">
        <small>COMPARE {compare.length}/2 · CURRENT RESEARCH ONLY</small>
        <div className="analysis-grid">{compare.map(id => {
                const p = run.universe[id].trajectory.at(-1)!;
                return <article key={id}>
                <h3>{id}</h3>
                <p>{byTicker[id].relationship}</p>
                <b>T{p.t} · OPS {p.ops} / RAP {p.rap}</b>
                <p>{p.why}</p>
                </article>;
            })}</div>{compare.length === 1 && <p>Select one more candidate to compare.</p>}</div>}</section>;
}
