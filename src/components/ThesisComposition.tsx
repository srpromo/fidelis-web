import { useState } from 'react';
import { ArrowRight, ChevronRight, LockKeyhole } from 'lucide-react';
import { thesisQuestions } from '../state/research';
import { Button, type Props } from './shared';
export function Composition({ run, dispatch }: Props) {
    const [answer, setAnswer] = useState('');
    const [editing, setEditing] = useState(false);
    const [edited, setEdited] = useState('');
    const d = run.drafts.at(-1)!;
    const q = thesisQuestions.find(q => !d[q.key as keyof typeof d]);
    const submit = (text: string) => { dispatch({ type: 'ANSWER', text }); setAnswer(''); };
    return <div className="composition">
    <section className="conversation" aria-label="Thesis conversation">
    <p className="intro">Turn the intuition into a claim that can be challenged.</p>{run.conversation.map((m, i) => <div key={i} className={`message ${m.role}`}>
        <small>{m.role === 'user' ? 'YOU' : 'FIDELIS'}</small>
        <p>{m.text}</p>
        </div>)}{q ? <>
        <div className="suggestions">{q.choices.map(c => <button key={c} onClick={() => submit(c)}>{c}<ChevronRight size={14}/>
            </button>)}</div>
        <form onSubmit={(e) => { e.preventDefault(); submit(answer); }} className="reply">
        <label className="sr-only" htmlFor="reply">Your thesis response</label>
        <input id="reply" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Or put it in your own words…"/>
        <button disabled={!answer.trim()} aria-label="Send thesis response">
        <ArrowRight size={18}/>
        </button>
        </form>
        </> : <div className="lock-action">
        <LockKeyhole size={22}/>
        <h3>Ready to hold the thesis still?</h3>
        <p>Discovery will test this exact composition. The locked version and your conversation remain part of the research.</p>
        <Button disabled={editing} onClick={() => dispatch({ type: 'LOCK' })}>Lock thesis & discover</Button>
        </div>}</section>
    <aside className="thesis-paper">
    <small>THESIS COMPOSITION · VERSION {d.version}</small>
    <h2>A claim takes shape.</h2>{[['Mechanism', d.mechanism], ['Beneficiaries', d.beneficiaries], ['Causal pathways', d.pathways], ['Exclusions', d.exclusions], ['Recognition hypothesis', d.recognition], ['Time horizon', d.horizon], ['Falsifier', d.falsifiers]].map(([key, value]) => <div className={`thesis-field ${value ? 'revealed' : 'pending-field'}`} key={key}>
        <small>{key}</small>
        <p>{value || 'Still to be composed'}</p>
        </div>)}{d.proposition && <div className="proposition">
        <small>PROPOSED THESIS</small>{editing ? <>
            <textarea aria-label="Edit thesis proposition" rows={7} value={edited} onChange={e => setEdited(e.target.value)}/>
            <button onClick={() => { dispatch({ type: 'EDIT', text: edited }); setEditing(false); }} disabled={!edited.trim()}>Save revision</button>
            </> : <>
            <p>{d.proposition}</p>
            <button className="text-button" onClick={() => { setEdited(d.proposition); setEditing(true); }}>Revise wording</button>
            </>}</div>}</aside>
    </div>;
}
