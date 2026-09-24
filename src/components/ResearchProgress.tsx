import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { operations } from '../data/demo';
import type { Props } from './shared';
export function Progress({ run, dispatch }: Props) {
    const [step, setStep] = useState(0);
    const stage = run.pending as keyof typeof operations;
    const ops = operations[stage];
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            dispatch({ type: 'COMPLETE' });
            return;
        }
        const timer = window.setInterval(() => setStep(s => s + 1), 650);
        return () => window.clearInterval(timer);
    }, [dispatch]);
    useEffect(() => {
        if (step >= ops.length)
            dispatch({ type: 'COMPLETE' });
    }, [step, ops.length, dispatch]);
    return <section className={`progress-stage progress-${stage}`}>
    <small>DETERMINISTIC RESEARCH REPLAY</small>
    <h2>{stage === 'DISCOVERY' ? 'Following the causal thread.' : stage === 'WASH_1' ? 'Two independent views. One discrepancy.' : stage === 'WASH_2' ? 'Pressure on every link.' : 'Make the opposing case stronger.'}</h2>
    <ol aria-live="polite">{ops.map((op, i) => <li className={i <= step ? 'visible' : ''} key={op}>
        <span>{i < step ? <Check size={15}/> : String(i + 1).padStart(2, '0')}</span>{op}</li>)}</ol>
    <button className="text-button" onClick={() => dispatch({ type: 'COMPLETE' })}>Skip animation → show the same results</button>
    <p className="muted">Playing prepared demonstration findings. No live research is running.</p>
    </section>;
}
