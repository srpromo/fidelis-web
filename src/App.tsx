import { useEffect, useReducer, useState } from 'react';
import { Check, LockKeyhole } from 'lucide-react';
import { createRun, reducer } from './state/research';
import type { ResearchStage } from './types';
import { Opening } from './components/Opening';
import { Composition } from './components/ThesisComposition';
import { Progress } from './components/ResearchProgress';
import { Research } from './components/ResearchWorkspace';
import { CandidateDetail } from './components/CandidateDetail';
import { Finalists } from './components/Finalists';
import { Expression } from './components/ExpressionStrategy';
import { Output } from './components/CompletedOutput';
const labels: Record<ResearchStage, string> = { OBSERVATION: 'Observation', COMPOSITION: 'Compose', DISCOVERY: 'Discover', WASH_1: 'Reality & Recognition', WASH_2: 'Thesis Survival', WASH_3: 'Adversarial Confirmation', FINALISTS: 'Finalists', EXPRESSION: 'Expression', OUTPUT: 'Research output' };
const stages = Object.keys(labels) as ResearchStage[];
export default function App() {
    const [run, dispatch] = useReducer(reducer, undefined, createRun);
    const [selected, select] = useState('VRT');
    const [detail, setDetail] = useState<string | null>(null);
    const [showThesis, setShowThesis] = useState(false);
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); document.getElementById('stage-title')?.focus(); }, [run.stage]);
    return <>
    <a className="skip-link" href="#main">Skip to research</a>{run.stage === 'OBSERVATION' ? <Opening run={run} dispatch={dispatch}/> : <>
        <header className="header">
        <span className="wordmark">FIDELIS<span className="alpha">ALPHA 002</span>
        </span>
        <span className="demo-label">DEMONSTRATION · NO LIVE RESEARCH</span>{run.lockedThesis && <button className="locked-button" onClick={() => setShowThesis(!showThesis)} aria-expanded={showThesis}>
            <LockKeyhole size={13}/>Thesis v{run.lockedThesis.version}</button>}</header>
        <nav className="journey" aria-label="Research journey">{stages.filter(s => s !== 'OBSERVATION').map((s, i) => <span key={s} aria-current={run.stage === s ? 'step' : undefined} className={`${stages.indexOf(run.stage) > stages.indexOf(s) ? 'done' : ''} ${run.stage === s ? 'current' : ''}`}>
            <i>{stages.indexOf(run.stage) > stages.indexOf(s) ? <Check size={11}/> : String(i + 1).padStart(2, '0')}</i>{labels[s]}</span>)}</nav>{showThesis && run.lockedThesis && <div className="locked-summary">
            <small>LOCKED THESIS · IMMUTABLE VERSION {run.lockedThesis.version}</small>
            <p>{run.lockedThesis.proposition}</p>
            <p>
            <b>Falsifier:</b> {run.lockedThesis.falsifiers}</p>
            </div>}<main id="main" className="workspace">
        <div className="page-heading">
        <small>FIDELIS RESEARCH / {String(stages.indexOf(run.stage)).padStart(2, '0')}</small>
        <h1 id="stage-title" tabIndex={-1}>{labels[run.stage]}</h1>
        </div>{run.stage === 'COMPOSITION' ? <Composition run={run} dispatch={dispatch}/> : run.pending ? <Progress run={run} dispatch={dispatch}/> : ['DISCOVERY', 'WASH_1', 'WASH_2', 'WASH_3'].includes(run.stage) ? <Research run={run} dispatch={dispatch} selected={selected} select={select} inspect={setDetail}/> : run.stage === 'FINALISTS' ? <Finalists run={run} dispatch={dispatch} inspect={setDetail}/> : run.stage === 'EXPRESSION' ? <Expression run={run} dispatch={dispatch}/> : <Output run={run} selected={selected} select={select} inspect={setDetail}/>}</main>
        <footer>FIDELIS · Thesis to expression<span>Sanitized fixtures. No live prices, research or execution.</span>
        </footer>
        </>}{detail && <CandidateDetail run={run} ticker={detail} close={() => setDetail(null)}/>}</>;
}
