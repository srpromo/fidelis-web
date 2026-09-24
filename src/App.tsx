import {Wash2Experience} from './wash2/Wash2Experience';
import {wash2Count} from './wash2/model';
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
    const [expandedStage,setExpandedStage]=useState<ViewedStage|null>(null);
    const [review, setReview] = useState(false);
    const [viewed, setViewed] = useState<ViewedStage>('Discovery');
    const [navigation, setNavigation] = useState<ViewedStage|null>(null);
    function navigate(stage:ViewedStage) { setReview(true); setExpandedStage(stage); setViewed(stage); setNavigation(stage); }
    useEffect(()=>{
        if(!navigation)return;
        const target=document.getElementById(navigation==='Wash 2'?'saved-wash2':navigation==='Thesis'?'saved-thesis':navigation==='Wash 1'?'saved-wash1':'saved-discovery');
        target?.focus({preventScroll:true});
        target?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
        setNavigation(null);
    },[navigation,review,expandedStage]);
    const locked = !!run.lockedThesis;
    const thesis = run.drafts.at(-1);
    useEffect(()=>{
        if(!locked)return;
        const updateViewed=()=>{
            const header=document.querySelector('.research-header')?.getBoundingClientRect().bottom??0;
            const discovery=document.getElementById('saved-discovery')?.getBoundingClientRect().top??0;
            const wash=document.getElementById('saved-wash1')?.getBoundingClientRect().top;
            const wash2=document.getElementById('saved-wash2')?.getBoundingClientRect().top;
            setViewed(wash2!==undefined&&wash2<=header+32?'Wash 2':wash!==undefined&&wash<=header+32?'Wash 1':review&&discovery>header+32?'Thesis':'Discovery');
        };
        window.addEventListener('scroll',updateViewed,{passive:true});
        return()=>window.removeEventListener('scroll',updateViewed);
    },[locked,review,!!run.wash1,!!run.wash2]);

    useEffect(()=>{if(run.wash1){setViewed('Wash 1');setNavigation('Wash 1')}},[!!run.wash1]);
    useEffect(()=>{if(run.wash2){setExpandedStage(null);setReview(false);setViewed('Wash 2');setNavigation('Wash 2')}},[!!run.wash2]);
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
    {locked&&<><div className="research-navigation"><ProgressionRail viewed={viewed} onNavigate={navigate} discoveryAvailable={!!run.discovery} discoveryComplete={run.discovery?.status==='COMPLETE'} washAvailable={!!run.wash1} washComplete={run.wash1?.status==='COMPLETE'} wash2Available={!!run.wash2} wash2Complete={run.wash2?.status==='COMPLETE'}/><p className="viewing-state">Viewing saved {viewed} · Research: {run.wash2?'Wash 2':run.wash1?'Wash 1':'Discovery'}</p></div>
    {run.wash2?.status==='COMPLETE'?<div className="sticky-proceed"><button disabled={!wash2Count(run.wash2)} onClick={()=>{dispatch({type:'READY_FOR_WASH3'});navigate('Wash 2')}}>Proceed to Wash 3 · {wash2Count(run.wash2)} candidates</button>{run.wash2.readyForWash3&&<small role="status">Ready · Checkpoint 4 stop</small>}</div>:!run.wash2&&run.wash1?.status==='COMPLETE'?<div className="sticky-proceed"><button disabled={!wash1Count(run.wash1)} onClick={()=>dispatch({type:'START_WASH2'})}>Proceed to Wash 2 · {wash1Count(run.wash1)} candidates</button>{run.wash1.readyForWash2&&<small role="status">Ready · Checkpoint 3 stop</small>}</div>:!run.wash1&&run.discovery?.status==='COMPLETE'?<div className="sticky-proceed"><button disabled={!discoveryCounts(run.discovery).proceed} onClick={()=>dispatch({type:'START_WASH1'})}>Proceed to Wash 1 · {discoveryCounts(run.discovery).proceed} candidates</button></div>:null}</>}

    </ResearchHeader>
    <main id="continuous-canvas" className="continuous-canvas">
 {locked && <>
        <p className="lock-confirmation" role="status">Thesis locked · {run.runId}</p>
        </>}
 {run.wash2&&expandedStage!=='Thesis'&&<div className="saved-stage-summary"><span>Thesis · locked research anchor</span><button onClick={()=>navigate('Thesis')}>Inspect saved Thesis</button></div>}
 <div id="saved-thesis" tabIndex={-1} aria-label="Saved thesis" className={`composition-area ${locked && (!review||!!run.wash2&&expandedStage!=='Thesis') ? 'collapsed' : ''}`} inert={locked && (!review||!!run.wash2&&expandedStage!=='Thesis')} aria-hidden={locked && (!review||!!run.wash2&&expandedStage!=='Thesis')}>
    <div className="composition-inner">
    <ThesisChat messages={run.conversation} thesis={thesis} onSend={send} busy={busy} locked={locked}/>{thesis?.proposition && <FinalThesis thesis={run.lockedThesis ?? thesis} locked={locked} onEdit={text => dispatch({ type: 'EDIT', text })} onLock={() => dispatch({ type: 'LOCK' })}/>}</div>
    </div>
 {locked && <div id="saved-discovery" tabIndex={-1} aria-label="Saved Discovery">{run.wash2&&expandedStage!=='Discovery'&&<div className="saved-stage-summary"><span>Discovery · frozen candidate universe</span><button onClick={()=>navigate('Discovery')}>Inspect saved Discovery</button></div>}<div hidden={!!run.wash2&&expandedStage!=='Discovery'}><DiscoveryExperience run={run} dispatch={dispatch}/></div></div>}
 {run.wash1&&<div id="saved-wash1" tabIndex={-1} aria-label="Saved Wash 1">{run.wash2&&expandedStage!=='Wash 1'&&<div className="saved-stage-summary"><span>Wash 1 · frozen Reality & Recognition</span><button onClick={()=>navigate('Wash 1')}>Inspect saved Wash 1</button></div>}<div hidden={!!run.wash2&&expandedStage!=='Wash 1'}><Wash1Experience run={run} dispatch={dispatch}/></div></div>}
 {run.wash2&&<div id="saved-wash2" tabIndex={-1} aria-label="Saved Wash 2"><Wash2Experience run={run} dispatch={dispatch}/></div>}
 </main>
    </div>;
}
