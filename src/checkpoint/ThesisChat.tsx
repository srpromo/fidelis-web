import { useEffect, useRef, useState } from 'react';
import type { ThesisConversation, ThesisVersion } from '../types';
export function ChatMessage({ message }: {
    message: ThesisConversation;
}) {
    return <article className={`chat-message ${message.role}`}>
    <span>{message.role === 'user' ? 'You' : 'Fidelis'}</span>
    <p>{message.text}</p>
    </article>;
}
export function ThesisStructure({ thesis }: {
    thesis: ThesisVersion;
}) {
    return <details className="formation">
    <summary>Thesis taking shape</summary>
    <dl>{[['Causal mechanism', thesis.mechanism], ['Beneficiary profile', thesis.beneficiaries], ['Market misconception', thesis.recognition], ['Horizon', thesis.horizon], ['Falsifiers', thesis.falsifiers]].map(([label, value]) => <div key={label}>
        <dt>{label}</dt>
        <dd>{value ? 'Established' : label === 'Market misconception' ? 'Developing' : 'Unresolved'}</dd>
        </div>)}</dl>
    </details>;
}
export function ThesisChat({ messages, thesis, onSend, busy, locked }: {
    messages: ThesisConversation[];
    thesis?: ThesisVersion;
    onSend: (text: string) => void;
    busy: boolean;
    locked: boolean;
}) {
    const [text, setText] = useState('');
    const history = useRef<HTMLDivElement>(null);
    const ready = !!thesis?.proposition;
    useEffect(() => { history.current?.scrollTo({ top: history.current.scrollHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }, [messages.length]);
    return <section className={`thesis-chat ${ready ? 'resolved' : ''}`} aria-label="Thesis conversation">
 {messages.length > 0 && <div className="chat-history" ref={history} tabIndex={0} aria-label="Conversation history">
        <div aria-live="polite" aria-relevant="additions">{messages.map((m, i) => <ChatMessage key={i} message={m}/>)}</div>
        </div>}
 {!messages.length && <h1>What are you seeing?</h1>}
 {!ready && !locked && <form className="chat-composer" onSubmit={e => { e.preventDefault(); if (text.trim()) {
            onSend(text.trim());
            setText('');
        } }}>
        <label className="sr-only" htmlFor="thought">{messages.length ? 'Your reply' : 'Your observation'}</label>
        <textarea id="thought" value={text} onChange={e => setText(e.target.value)} rows={messages.length ? 2 : 3} placeholder={messages.length ? 'Your thought…' : 'Tell Fidelis what you’re noticing…'} disabled={busy}/>
        <button type="submit" disabled={!text.trim() || busy} aria-label={messages.length ? 'Send reply' : 'Begin thesis conversation'}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M12 19V5m-6 6 6-6 6 6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        </button>
        </form>}
 {thesis && !ready && <ThesisStructure thesis={thesis}/>}
 {!messages.length && <details className="example">
        <summary>Try an observation</summary>
        <button onClick={() => setText('I keep seeing enormous spending on AI data centers and I don’t think the market fully appreciates how much physical infrastructure has to be built around the GPUs.')}>AI data centers & physical infrastructure ↗</button>
        </details>}
 {!locked && <p className="harness-note">Local conversation demo · AI infrastructure · no external AI</p>}
 </section>;
}
export function FinalThesis({ thesis, onEdit, onLock, locked }: {
    thesis: ThesisVersion;
    onEdit: (text: string) => void;
    onLock: () => void;
    locked: boolean;
}) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(thesis.proposition);
    return <section className="final-thesis" aria-label="Final thesis">
    <span className="overline">{locked ? 'Frozen thesis' : 'Ready to research'}</span>{editing ? <>
        <label htmlFor="thesis-edit">Edit your thesis</label>
        <textarea id="thesis-edit" value={value} onChange={e => setValue(e.target.value)} rows={7}/>
        <div className="thesis-actions">
        <button onClick={() => { onEdit(value); setEditing(false); }} disabled={!value.trim()}>Save thesis</button>
        <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
        </> : <>
        <h2>{thesis.proposition}</h2>
        <details className="thesis-foundations">
        <summary>Explore the thesis foundations</summary>
        <dl>{[['Observation', thesis.observation], ['Causal mechanism', thesis.mechanism], ['Beneficiary profile', thesis.beneficiaries], ['Market misconception', thesis.recognition], ['Horizon', thesis.horizon], ['Falsifiers', thesis.falsifiers]].map(([k, v]) => <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
            </div>)}</dl>
        </details>{!locked && <div className="thesis-actions">
            <button className="quiet" onClick={() => { setValue(thesis.proposition); setEditing(true); }}>Edit thesis</button>
            <button className="commit-thesis" onClick={onLock}>Lock & begin research <span aria-hidden="true">→</span>
            </button>
            </div>}</>}</section>;
}
