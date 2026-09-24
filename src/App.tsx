import {discoveryCounts} from './discovery/model';
import {DiscoveryExperience} from './discovery/DiscoveryExperience';
import { useReducer, useState, useEffect } from 'react';
import { checkpointReducer, initialCheckpoint, localAssistant } from './checkpoint/research';
import { ThesisChat, FinalThesis } from './checkpoint/ThesisChat';
import { ResearchHeader, ProgressionRail, type ViewedStage } from './checkpoint/ResearchCanvas';
export default function App() {
    const [run, dispatch] = useReducer(checkpointReducer, undefined, initialCheckpoint);
    const [busy, setBusy] = useState(false);
    const [review, setReview] = useState(false);
    const [viewed, setViewed] = useState<ViewedStage>('Discovery');
    const [navigation, setNavigation] = useState<ViewedStage|null>(null);
    function navigate(stage:ViewedStage) { setReview(true); setViewed(stage); setNavigation(stage); }
    useEffect(()=>{
        if(!navigation)return;
        const target=document.getElementById(navigation==='Thesis'?'saved-thesis':'saved-discovery');
        target?.focus({preventScroll:true});
        target?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
        setNavigation(null);
    },[navigation,review]);
    const locked = !!run.lockedThesis;
    const thesis = run.drafts.at(-1);
    useEffect(()=>{
        if(!locked)return;
        const updateViewed=()=>{
            const header=document.querySelector('.research-header')?.getBoundingClientRect().bottom??0;
            const discovery=document.getElementById('saved-discovery')?.getBoundingClientRect().top??0;
            setViewed(review&&discovery>header+32?'Thesis':'Discovery');
        };
        window.addEventListener('scroll',updateViewed,{passive:true});
        return()=>window.removeEventListener('scroll',updateViewed);
    },[locked,review]);

    async function send(message: string) { if (busy || locked)
        return; setBusy(true); try {
        const response = await localAssistant.respond({ message, thesis: thesis ?? null });
        dispatch({ type: 'REPLY', input: message, response });
    }
    finally {
        setBusy(false);
    } }
    return <div className={`checkpoint ${locked ? 'research-mode' : run.conversation.length ? 'conversation-mode' : 'arrival-mode'}`}>
    <a className="skip-link" href="#continuous-canvas">Skip to canvas</a>
    <ResearchHeader locked={locked} started={!!run.conversation.length}>
    {locked&&<><div className="research-navigation"><ProgressionRail viewed={viewed} onNavigate={navigate} discoveryAvailable={!!run.discovery} discoveryComplete={run.discovery?.status==='COMPLETE'}/><p className="viewing-state">Viewing saved {viewed} · Research: Discovery</p></div>
    {run.discovery?.status==='COMPLETE'&&<div className="sticky-proceed"><button disabled={!discoveryCounts(run.discovery).proceed} onClick={()=>{dispatch({type:'READY_FOR_WASH'});navigate('Discovery')}}>Proceed to Wash 1 <span>· {discoveryCounts(run.discovery).proceed} candidates</span></button>{run.discovery.readyToSave&&<small role="status">Ready · Checkpoint 2 stop</small>}</div>}</>}
    </ResearchHeader>
    <main id="continuous-canvas" className="continuous-canvas">
 {locked && <>
        <p className="lock-confirmation" role="status">Thesis locked · {run.runId}</p>
        </>}
 <div id="saved-thesis" tabIndex={-1} aria-label="Saved thesis" className={`composition-area ${locked && !review ? 'collapsed' : ''}`} inert={locked && !review} aria-hidden={locked && !review}>
    <div className="composition-inner">
    <ThesisChat messages={run.conversation} thesis={thesis} onSend={send} busy={busy} locked={locked}/>{thesis?.proposition && <FinalThesis thesis={run.lockedThesis ?? thesis} locked={locked} onEdit={text => dispatch({ type: 'EDIT', text })} onLock={() => dispatch({ type: 'LOCK' })}/>}</div>
    </div>
 {locked && <div id="saved-discovery" tabIndex={-1} aria-label="Saved Discovery"><DiscoveryExperience run={run} dispatch={dispatch}/></div>}
 </main>
    </div>;
}
