import {Wash1Experience} from './wash1/Wash1Experience';
import {wash1Count} from './wash1/model';
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
        const target=document.getElementById(navigation==='Thesis'?'saved-thesis':navigation==='Wash 1'?'saved-wash1':'saved-discovery');
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
            const wash=document.getElementById('saved-wash1')?.getBoundingClientRect().top;
            setViewed(wash!==undefined&&wash<=header+32?'Wash 1':review&&discovery>header+32?'Thesis':'Discovery');
        };
        window.addEventListener('scroll',updateViewed,{passive:true});
        return()=>window.removeEventListener('scroll',updateViewed);
    },[locked,review,!!run.wash1]);

    useEffect(()=>{if(run.wash1){setViewed('Wash 1');setNavigation('Wash 1')}},[!!run.wash1]);
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
    {locked&&<><div className="research-navigation"><ProgressionRail viewed={viewed} onNavigate={navigate} discoveryAvailable={!!run.discovery} discoveryComplete={run.discovery?.status==='COMPLETE'} washAvailable={!!run.wash1} washComplete={run.wash1?.status==='COMPLETE'}/><p className="viewing-state">Viewing saved {viewed} · Research: {run.wash1?'Wash 1':'Discovery'}</p></div>
    {run.wash1?.status==='COMPLETE'?<div className="sticky-proceed"><button disabled={!wash1Count(run.wash1)} onClick={()=>{dispatch({type:'READY_FOR_WASH2'});navigate('Wash 1')}}>Proceed to Wash 2 · {wash1Count(run.wash1)} candidates</button>{run.wash1.readyForWash2&&<small role="status">Ready · Checkpoint 3 stop</small>}</div>:!run.wash1&&run.discovery?.status==='COMPLETE'?<div className="sticky-proceed"><button disabled={!discoveryCounts(run.discovery).proceed} onClick={()=>dispatch({type:'START_WASH1'})}>Proceed to Wash 1 · {discoveryCounts(run.discovery).proceed} candidates</button></div>:null}</>}

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
 {run.wash1&&<div id="saved-wash1" tabIndex={-1} aria-label="Saved Wash 1"><Wash1Experience run={run} dispatch={dispatch}/></div>}
 </main>
    </div>;
}
