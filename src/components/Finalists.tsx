import { ArrowUpRight } from 'lucide-react';
import { byTicker } from '../data/demo';
import { Button, type Props } from './shared';
export function Finalists({ run, dispatch, inspect }: Props & {
    inspect: (id: string) => void;
}) {
    return <>
    <p className="intro">These candidates survived the full demonstration. Choose the ones worth discussing as expressions of your thesis.</p>
    <div className="finalist-grid">{run.finalists.map(f => {
            const c = byTicker[f.ticker];
            return <article className={`finalist ${f.selected ? 'chosen' : ''}`} key={f.ticker}>
            <label>
            <input type="checkbox" checked={f.selected} onChange={() => dispatch({ type: 'SELECT_FINALIST', ticker: f.ticker })}/>
            <span>SELECT FINALIST</span>
            </label>
            <h2>{f.ticker}<small>{c.company}</small>
            </h2>
            <p>{c.comparative}</p>
            <div className="mini-trail">{run.universe[f.ticker].trajectory.map(p => <span key={p.t}>T{p.t}<b>{p.ops}/{p.rap}</b>
                </span>)}</div>
            <small>PRINCIPAL RESIDUAL RISK</small>
            <p>{c.principalRisk}</p>
            <button className="text-button" onClick={() => inspect(f.ticker)}>Inspect complete research <ArrowUpRight size={14}/>
            </button>
            </article>;
        })}</div>{!run.finalists.length && <p className="notice">No retained candidate survived all three washes. No expression can be produced from a held or failed thesis.</p>}<details className="explain">
    <summary>Inspect candidates that did not advance</summary>
    <div className="ticker-strip">{Object.keys(run.universe).filter(id => !run.finalists.some(f => f.ticker === id)).map(id => <button key={id} onClick={() => inspect(id)}>{id} · {run.universe[id].userExcluded ? 'user excluded' : run.universe[id].trajectory.at(-1)?.disposition}</button>)}</div>
    <p>Holds and thesis failures remain visible. An option structure cannot repair upstream research failure.</p>
    </details>
    <div className="stage-next">
    <p>{run.finalists.filter(f => f.selected).length} selected. No automatic winner.</p>
    <Button disabled={!run.finalists.some(f => f.selected)} onClick={() => dispatch({ type: 'EXPRESSION' })}>Discuss expression strategy</Button>
    </div>
    </>;
}
