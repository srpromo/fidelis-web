import { ChevronRight } from 'lucide-react';
import type { ExpressionPreference } from '../types';
import { Button, type Props } from './shared';
export const expressionQuestions: {
    key: keyof ExpressionPreference;
    text: string;
    choices: string[];
}[] = [{ key: 'objective', text: 'What should the expression accomplish?', choices: ['Participate in durable appreciation', 'Seek a defined-risk upside opportunity'] }, { key: 'horizon', text: 'What time can you give the thesis to become visible?', choices: ['12–24 months', 'Three to five years'] }, { key: 'path', text: 'How much does the path matter?', choices: ['Uncertain timing', 'Gradual recognition', 'Time-bounded catalyst'] }, { key: 'risk', text: 'Which trade-off can you actually tolerate?', choices: ['Stock-like durability', 'Accept premium loss for convexity', 'Defined risk with capped upside'] }, { key: 'conviction', text: 'How would you describe your conviction, given the opposing case?', choices: ['Conditional; need conversion evidence', 'Stronger, but sensitive to expectations'] }];
export function Expression({ run, dispatch }: Props) {
    const q = expressionQuestions.find(q => !run.preferences[q.key]);
    return <div className="expression-layout">
    <section className="conversation">
    <p className="intro">The company thesis stays fixed. Now make the expression fit the uncertainty.</p>
    <div className="message fidelis">
    <small>FIDELIS</small>
    <p>We’re discussing {run.finalists.filter(f => f.selected).map(f => f.ticker).join(', ')}. We’ll separate thesis validity from price, premium, expiry and path. No option chain or quote will be invented.</p>
    </div>{expressionQuestions.filter(q => run.preferences[q.key]).map(q => <div key={q.key}>
        <div className="message fidelis">
        <small>FIDELIS</small>
        <p>{q.text}</p>
        </div>
        <div className="message user">
        <small>YOU</small>
        <p>{run.preferences[q.key]}</p>
        </div>
        </div>)}{q ? <div className="expression-question">
        <div className="message fidelis">
        <small>FIDELIS</small>
        <p>{q.text}</p>
        </div>
        <div className="suggestions">{q.choices.map(c => <button key={c} onClick={() => dispatch({ type: 'PREFERENCE', key: q.key, value: c })}>{c}<ChevronRight size={14}/>
            </button>)}</div>
        </div> : <div className="lock-action">
        <h3>The thesis and the trade are different questions.</h3>
        <p>The output will preserve both the supporting case and the strongest opposing case.</p>
        <Button onClick={() => dispatch({ type: 'OUTPUT' })}>Complete research output</Button>
        </div>}</section>
    <aside className="expression-note">
    <small>THE EXPRESSION FIREWALL</small>
    <h2>A structure cannot<br />save a broken thesis.</h2>
    <p>Only selected research survivors enter this discussion. Options change exposure, timing and payoff — not the underlying evidence.</p>
    <h3>Three distinct uncertainties</h3>
    <ol>
    <li>Does the business thesis hold?</li>
    <li>Does recognition arrive in time?</li>
    <li>Does the expression compensate for price and risk?</li>
    </ol>
    <small>ILLUSTRATIVE STRUCTURES ONLY</small>
    <p>No strikes, premiums, expiry dates, execution instructions or expected-return estimates are supplied.</p>
    </aside>
    </div>;
}
