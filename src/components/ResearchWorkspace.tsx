import { useState } from 'react';
import { participants } from '../state/research';
import { stageTitles } from '../data/demo';
import type { ResearchStage } from '../types';
import { Button, type Props } from './shared';
import { CausalMap, Trajectory, Contraction } from './ResearchVisuals';
import { WashAnalysis } from './WashAnalysis';
import { Curation } from './CandidateCuration';
export function Research({ run, dispatch, selected, select, inspect }: Props & {
    selected: string;
    select: (id: string) => void;
    inspect: (id: string) => void;
}) {
    const [tab, setTab] = useState('analysis');
    const t = run.stage === 'DISCOVERY' ? 0 : Number(run.stage.slice(-1));
    const next = ({ DISCOVERY: 'WASH_1', WASH_1: 'WASH_2', WASH_2: 'WASH_3' } as Record<string, ResearchStage>)[run.stage];
    return <>
    <div className="stage-intro">
    <p>{t === 0 ? 'A map of plausible exposure, before an investment judgment.' : t === 1 ? 'Company economics and the security’s recognition are measured independently.' : t === 2 ? 'A relevant company is not enough. Test the transmission, fragility and shared dependencies.' : 'Seek disconfirmation before confidence. A failed thesis stays failed.'}</p>
    <span className="snapshot-label">T{t} SNAPSHOT</span>
    </div>
    <div className="segmented view-tabs">
    <button className={tab === 'analysis' ? 'active' : ''} onClick={() => setTab('analysis')}>{t === 0 ? 'Causal map' : 'Research findings'}</button>
    <button className={tab === 'trajectory' ? 'active' : ''} onClick={() => setTab('trajectory')}>OPS / RAP trajectories</button>
    <button className={tab === 'funnel' ? 'active' : ''} onClick={() => setTab('funnel')}>Universe history</button>
    </div>{tab === 'analysis' ? (t === 0 ? <CausalMap run={run} selected={selected} select={id => { select(id); inspect(id); }}/> : <>
        <div className="ticker-strip" aria-label="Inspect candidate findings">{Object.keys(run.universe).filter(id => run.universe[id].trajectory.some(p => p.t === t)).map(id => <button key={id} className={selected === id ? 'active' : ''} onClick={() => select(id)}>{id}</button>)}</div>{run.universe[selected]?.trajectory.some(p => p.t === t) ? <WashAnalysis key={`${selected}-${t}`} ticker={selected} stage={t}/> : <p className="notice">{selected} did not participate in this wash. Its earlier research remains available in candidate detail.</p>}</>) : tab === 'trajectory' ? <Trajectory run={run} selected={selected} select={select}/> : <Contraction run={run}/>}<Curation run={run} dispatch={dispatch} select={select} selected={selected} inspect={inspect}/>
    <div className="stage-next">
    <div>
    <small>YOUR UNIVERSE. YOUR DECISION.</small>
    <p>{participants(run).length} candidates retained for scrutiny. {Object.values(run.universe).filter(c => c.userExcluded).length} excluded by you.</p>
    </div>{next ? <Button disabled={!participants(run).length} onClick={() => { setTab('analysis'); dispatch({ type: 'BEGIN', stage: next }); }}>Continue to {stageTitles[next as keyof typeof stageTitles]}</Button> : <Button onClick={() => dispatch({ type: 'FINALISTS' })}>Choose finalists</Button>}</div>
    </>;
}
