import { useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { observation } from '../data/demo';
import type { Props } from './shared';
export function Opening({ dispatch }: Props) {
    const [text, setText] = useState('');
    return <main id="main" className="opening">
    <div className="opening-top">
    <span className="wordmark">FIDELIS</span>
    <span>ALPHA 002</span>
    </div>
    <div className="opening-content">
    <p className="eyebrow">FOLLOW THE THOUGHT. TEST THE THESIS.</p>
    <h1 id="stage-title">What are<br />you <em>seeing?</em>
    </h1>
    <p className="opening-lead">An observation is a beginning.<br />Let’s find out what it could mean.</p>
    <form onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'OBSERVE', text }); }}>
    <label className="sr-only" htmlFor="observation">Your observation</label>
    <textarea id="observation" value={text} onChange={e => setText(e.target.value)} placeholder="A shift. A bottleneck. Something the market may be missing…" rows={3}/>
    <div className="opening-actions">
    <button type="button" className="text-button" onClick={() => setText(observation)}>Try the AI infrastructure example <ArrowUpRight size={14}/>
    </button>
    <button className="primary light" disabled={!text.trim()}>Explore with Fidelis <ArrowRight size={18}/>
    </button>
    </div>
    </form>
    <p className="opening-note">This demonstration follows an illustrative AI infrastructure thesis.<br />Your words stay in this browser session. No account or provider call.</p>
    </div>
    <div className="opening-bottom">
    <span>FROM OBSERVATION TO CONVICTION</span>
    <span>01 — THESIS / 02 — EVIDENCE / 03 — EXPRESSION</span>
    </div>
    </main>;
}
