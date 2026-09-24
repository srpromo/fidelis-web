import {DiscoveryExperience} from './discovery/DiscoveryExperience';
import { useReducer, useState } from 'react';
import { checkpointReducer, initialCheckpoint, localAssistant } from './checkpoint/research';
import { ThesisChat, FinalThesis } from './checkpoint/ThesisChat';
import { ResearchHeader, ProgressionRail } from './checkpoint/ResearchCanvas';
export default function App() {
    const [run, dispatch] = useReducer(checkpointReducer, undefined, initialCheckpoint);
    const [busy, setBusy] = useState(false);
    const [review, setReview] = useState(false);
    const locked = !!run.lockedThesis;
    const thesis = run.drafts.at(-1);
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
    <ResearchHeader locked={locked} started={!!run.conversation.length}/>
    <main id="continuous-canvas" className="continuous-canvas">
 {locked && <>
        <p className="lock-confirmation" role="status">Thesis locked · {run.runId}</p>
        <ProgressionRail onThesis={() => setReview(!review)} expanded={review} discoveryComplete={run.discovery?.status==='COMPLETE'}/>
        </>}
 <div className={`composition-area ${locked && !review ? 'collapsed' : ''}`} inert={locked && !review} aria-hidden={locked && !review}>
    <div className="composition-inner">
    <ThesisChat messages={run.conversation} thesis={thesis} onSend={send} busy={busy} locked={locked}/>{thesis?.proposition && <FinalThesis thesis={run.lockedThesis ?? thesis} locked={locked} onEdit={text => dispatch({ type: 'EDIT', text })} onLock={() => dispatch({ type: 'LOCK' })}/>}</div>
    </div>
 {locked && <DiscoveryExperience run={run} dispatch={dispatch}/>}
 </main>
    </div>;
}
