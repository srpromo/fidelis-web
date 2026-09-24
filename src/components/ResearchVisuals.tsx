import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine, Cell } from 'recharts';
import { byTicker, pathways, stageTitles } from '../data/demo';
import type { ResearchRun, Chronology } from '../types';
export function CausalMap({ run, select, selected }: {
    run: ResearchRun;
    select: (id: string) => void;
    selected: string;
}) {
    const [branch, setBranch] = useState('thermal');
    const current = pathways.find(p => p.id === branch)!;
    return <section className="causal-map" aria-label="Discovery causal map">
    <div className="map-origin">
    <small>LOCKED THESIS → ECONOMIC MECHANISM</small>
    <h2>More compute needs<br />
    <em>more than chips.</em>
    </h2>
    <p>Infrastructure spending → physical capacity → company demand → cash realization</p>
    </div>
    <div className="map-branches">{pathways.map(p => <button key={p.id} className={branch === p.id ? 'selected' : ''} onClick={() => setBranch(p.id)} aria-pressed={branch === p.id}>
        <span className="branch-line"/>{p.label}<small>{p.candidateIds.filter(id => run.universe[id]).length} exposures</small>
        </button>)}</div>
    <div className="pathway">
    <div>
    <small>CAUSAL PATHWAY</small>
    <h3>{current.label}</h3>
    <p>{current.mechanism}</p>
    <p className="muted">Relevance is a starting hypothesis. Economics and security attractiveness are not yet established.</p>
    </div>
    <div className="map-companies">{current.candidateIds.filter(id => run.universe[id]).map(id => <button key={id} className={selected === id ? 'selected' : ''} onClick={() => select(id)}>
        <b>{id}</b>
        <span>{byTicker[id].company}</span>
        <small>{run.universe[id].userExcluded ? 'Excluded by you' : byTicker[id].recall ? 'Discovery recall' : 'Inspect exposure'} →</small>
        </button>)}</div>
    </div>
    </section>;
}
const colors = ['#9dabb5', '#6d94ac', '#c39d57', '#3e6968'];
export function Trajectory({ run, selected, select }: {
    run: ResearchRun;
    selected: string;
    select: (id: string) => void;
}) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const max = Math.max(0, ...Object.values(run.universe).flatMap(c => c.trajectory.map(p => p.t))) as Chronology;
    const [view, setView] = useState<Chronology | null>(null);
    const t = view === null ? max : Math.min(view, max) as Chronology;
    const state = run.universe[selected];
    const trail = state?.trajectory.filter(p => p.t <= t) ?? [];
    const dots = Object.values(run.universe).flatMap(c => { const p = c.trajectory.find(p => p.t === t); return p ? [{ ...p, ticker: c.ticker, excluded: c.userExcluded }] : []; });
    return <section className="trajectory">
    <div className="section-heading">
    <div>
    <small>HOW THE RESEARCH CHANGED</small>
    <h2>Opportunity, with a memory.</h2>
    </div>
    <div className="segmented" aria-label="Trajectory snapshots">{Array.from({ length: max + 1 }, (_, i) => <button key={i} aria-pressed={t === i} className={t === i ? 'active' : ''} onClick={() => setView(i as Chronology)}>T{i}</button>)}{view !== null && <button onClick={() => setView(null)}>Latest</button>}</div>
    </div>
    <p className="muted">OPS · Opportunity Potential / RAP · Risk Adjusted Potential. Illustrative coordinates, not probabilities or proprietary scores.</p>
    <div className="plot-grid">
    <div className="plot" role="img" aria-label={`T${t} opportunity and risk adjusted potential. Exact coordinates and movement explanations follow.`}>
    <span className="axis-title">RAP ↑</span>
    <ResponsiveContainer width="100%" height={330}>
    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
    <CartesianGrid strokeDasharray="2 6" stroke="#e0e5e4"/>
    <XAxis type="number" dataKey="ops" domain={[0, 100]} name="OPS" tickLine={false}/>
    <YAxis type="number" dataKey="rap" domain={[0, 100]} name="RAP" tickLine={false}/>
    <ReferenceLine x={50} stroke="#ccd4d2"/>
    <ReferenceLine y={50} stroke="#ccd4d2"/>
    <Tooltip cursor={false} content={({ payload }) => payload?.length ? <div className="chart-tip">{String(payload[0].payload.ticker ?? selected)} · OPS {payload[0].payload.ops} / RAP {payload[0].payload.rap}</div> : null}/>
    <Scatter data={dots} fill="#bac5c9" isAnimationActive={!reducedMotion} animationDuration={450} onClick={(p) => {
            const id = (p.payload as {
                ticker?: string;
            })?.ticker;
            if (id)
                select(id);
        }}/>
    <Scatter data={trail} line={{ stroke: colors[t], strokeWidth: 2 }} fill={colors[t]} isAnimationActive={!reducedMotion} animationDuration={450}>{trail.map(p => <Cell key={p.t} fill={colors[p.t]}/>)}</Scatter>
    </ScatterChart>
    </ResponsiveContainer>
    <span className="x-title">OPS →</span>
    </div>
    <div className="movement">
    <small>{selected} · RESEARCH TRAJECTORY</small>{trail.map(p => <div className="movement-step" key={p.t}>
        <span style={{ background: colors[p.t] }}>T{p.t}</span>
        <div>
        <b>OPS {p.ops} · RAP {p.rap}</b>
        <p>{p.why}</p>
        </div>
        </div>)}{!trail.length && <p>This candidate had not entered the universe at this snapshot.</p>}</div>
    </div>
    <div className="ticker-strip" aria-label="Select trajectory">{Object.keys(run.universe).map(id => <button key={id} aria-pressed={selected === id} className={selected === id ? 'active' : ''} onClick={() => select(id)}>{id}{run.universe[id].userExcluded ? ' · excluded' : ''}</button>)}</div>
    </section>;
}
export function Contraction({ run }: {
    run: ResearchRun;
}) {
    const [open, setOpen] = useState<string | null>(null);
    return <section className="contraction">
    <div className="section-heading">
    <div>
    <small>LESS BREADTH. MORE DEPTH.</small>
    <h2>Your research funnel.</h2>
    </div>
    <p className="muted">Recommendations and your exclusions stay separate.</p>
    </div>
    <div className="funnel">{run.washes.map((w, i) => <div key={w.stage}>
        <button aria-expanded={open === w.stage} onClick={() => setOpen(open === w.stage ? null : w.stage)}>
        <small>T{i} · {stageTitles[w.stage as keyof typeof stageTitles]}</small>
        <div className="funnel-bar" style={{ width: `${35 + w.analyzed / 10 * 65}%` }}>
        <b>{w.analyzed}</b> examined</div>
        <span>{w.advance} advance · {w.held} held/review · {w.failed} failed</span>
        </button>{open === w.stage && <p>{w.participants.join(', ')}. Excluded before this pass: {w.excluded}. Recall additions: {w.recallAdded}.</p>}</div>)}</div>
    <p className="muted">Current user exclusions: {Object.values(run.universe).filter(c => c.userExcluded).length}. Analytical holds remain eligible for further scrutiny; a failed thesis cannot enter expression selection.</p>
    </section>;
}
