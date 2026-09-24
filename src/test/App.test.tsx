import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';
import { createRun, reducer, claimRun, nextStageAccess, policy, participants, type Action } from '../state/research';
import { expressionQuestions } from '../components/ExpressionStrategy';
import type { ResearchRun } from '../types';
const apply = (r: ResearchRun, ...actions: Action[]) => actions.reduce(reducer, r);
function composed() { return apply(createRun(), { type: 'OBSERVE', text: 'My original observation' }, { type: 'ANSWER', text: 'Underrecognized infrastructure' }, { type: 'ANSWER', text: '12–24 months' }, { type: 'ANSWER', text: 'Orders fail to convert' }); }
function discovered() { return apply(composed(), { type: 'LOCK' }, { type: 'COMPLETE' }); }
function washed() { return apply(discovered(), { type: 'BEGIN', stage: 'WASH_1' }, { type: 'COMPLETE' }, { type: 'BEGIN', stage: 'WASH_2' }, { type: 'COMPLETE' }, { type: 'BEGIN', stage: 'WASH_3' }, { type: 'COMPLETE' }); }
function expressed() {
    let r = apply(washed(), { type: 'FINALISTS' }, { type: 'SELECT_FINALIST', ticker: 'VRT' }, { type: 'EXPRESSION' });
    for (const q of expressionQuestions)
        r = reducer(r, { type: 'PREFERENCE', key: q.key, value: q.choices[0] });
    return reducer(r, { type: 'OUTPUT' });
}
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });
describe('Research continuity and decision boundaries', () => {
    it('preserves observation, conversation, revisions and an immutable locked thesis', () => { const r = composed(); const revised = reducer(r, { type: 'EDIT', text: 'A revised, falsifiable proposition' }); const locked = reducer(revised, { type: 'LOCK' }); expect(locked.drafts).toHaveLength(5); expect(locked.lockedThesis?.observation).toBe('My original observation'); expect(locked.conversation).toHaveLength(8); expect(reducer(locked, { type: 'EDIT', text: 'Cannot change' })).toBe(locked); expect(locked.lockedThesis?.proposition).toBe('A revised, falsifiable proposition'); });
    it('does not discover without an explicit lock or permit skipped wash stages', () => { expect(reducer(createRun(), { type: 'LOCK' }).stage).toBe('OBSERVATION'); const r = discovered(); expect(reducer(r, { type: 'BEGIN', stage: 'WASH_3' })).toBe(r); });
    it('begins with relevance only and adds recall after independent Wash 1', () => { let r = discovered(); expect(Object.keys(r.universe)).toHaveLength(9); expect(r.universe.PWR).toBeUndefined(); r = apply(r, { type: 'BEGIN', stage: 'WASH_1' }, { type: 'COMPLETE' }); expect(r.universe.PWR.trajectory.map(p => p.t)).toEqual([1]); expect(r.washes[1].recallAdded).toBe(1); expect(r.washes[1].held).toBe(5); });
    it('preserves exclusion/restore decisions and never fabricates a missed snapshot', () => { let r = discovered(); r = apply(r, { type: 'CURATE', ticker: 'AMD' }, { type: 'CURATE', ticker: 'AMD' }, { type: 'CURATE', ticker: 'AMD' }, { type: 'BEGIN', stage: 'WASH_1' }, { type: 'COMPLETE' }); expect(r.universe.AMD.userExcluded).toBe(true); expect(r.universe.AMD.trajectory).toHaveLength(1); expect(r.washes[1].analyzed).toBe(9); expect(r.exclusions.map(e => e.decision)).toEqual(['USER_EXCLUDED', 'USER_RESTORED', 'USER_EXCLUDED']); expect(reducer(r, { type: 'CURATE', ticker: 'AMD' })).toBe(r); });
    it('holds remain user-controlled but failures never become finalists', () => { const r = washed(); expect(r.universe.NVDA.userExcluded).toBe(false); expect(participants(r).some(c => c.ticker === 'NVDA')).toBe(true); expect(participants(r).some(c => c.ticker === 'GEV')).toBe(false); const final = reducer(r, { type: 'FINALISTS' }); expect(final.finalists.map(f => f.ticker)).toEqual(['VRT', 'ETN', 'ANET', 'PWR']); expect(reducer(final, { type: 'SELECT_FINALIST', ticker: 'GEV' }).finalists.some(f => f.selected)).toBe(false); expect(r.exceptions[0].ticker).toBe('GEV'); });
    it('does not express without finalists and all conversational preferences', () => { const final = reducer(washed(), { type: 'FINALISTS' }); expect(reducer(final, { type: 'EXPRESSION' })).toBe(final); const exp = apply(final, { type: 'SELECT_FINALIST', ticker: 'VRT' }, { type: 'EXPRESSION' }); expect(reducer(exp, { type: 'OUTPUT' })).toBe(exp); });
    it('retains the case against and separates qualitative support from expression conditions', () => { const r = expressed(); expect(r.stage).toBe('OUTPUT'); expect(r.support?.calibrated).toBe(false); expect(r.caseAgainst!.points.length).toBeGreaterThan(2); expect(r.expressions[0].structure).toBe('Common stock'); expect(r.expressions[0].successConditions).not.toEqual(r.caseFor?.points); expect(r.usage.providerCalls).toBe(0); expect(r.washes.map(w => w.analyzed)).toEqual([9, 10, 10, 10]); expect(r.universe.VRT.trajectory.map(p => p.t)).toEqual([0, 1, 2, 3]); });
    it('changes expression structure without rewriting upstream evidence', () => {
        let r = apply(washed(), { type: 'FINALISTS' }, { type: 'SELECT_FINALIST', ticker: 'ETN' }, { type: 'EXPRESSION' });
        for (const q of expressionQuestions)
            r = reducer(r, { type: 'PREFERENCE', key: q.key, value: q.choices.at(-1)! });
        const baseline = r.universe;
        const out = reducer(r, { type: 'OUTPUT' });
        expect(out.expressions[0].structure).toBe('Call debit spread');
        expect(out.universe).toBe(baseline);
        expect(out.expressions[0].rationale).toContain('caps upside');
    });
    it('keeps authentication separate from entitlement and preserves anonymous run continuity', () => { const r = discovered(); expect(r.policy.authenticationBoundary).toBe('DISABLED'); expect(r.policy.entitlementBoundary).toBe('DISABLED'); expect(r.policy).not.toBe(policy); const gated = { ...r, policy: { ...r.policy, authenticationBoundary: 'WASH_1' as const } }; expect(nextStageAccess(gated, 'WASH_1')).toBe('AUTHENTICATION_REQUIRED'); expect(reducer(gated, { type: 'BEGIN', stage: 'WASH_1' })).toBe(gated); const owned = claimRun(gated, 'demo-account'); expect(owned.universe).toBe(gated.universe); expect(owned.lockedThesis).toBe(gated.lockedThesis); expect(nextStageAccess(owned, 'WASH_1')).toBe('ALLOWED'); expect(nextStageAccess({ ...owned, policy: { ...owned.policy, entitlementBoundary: 'WASH_1' } }, 'WASH_1')).toBe('ENTITLEMENT_REQUIRED'); });
});
function click(name: string | RegExp) { fireEvent.click(screen.getByRole('button', { name })); }
function composeUI() { render(<App />); click(/Try the AI/); click('Explore with Fidelis'); click('Underrecognized physical infrastructure'); click('12–24 months'); click('Orders fail to convert into revenue and cash'); click('Lock thesis & discover'); }
describe('Reviewer journey', () => {
    it('completes opening through research output without authentication or provider requests', () => {
        const fetch = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Unexpected network'));
        composeUI();
        click(/Skip animation/);
        expect(screen.getByLabelText('Discovery causal map')).toBeInTheDocument();
        click('Exclude AMD');
        click('Continue to Reality & Recognition');
        click(/Skip animation/);
        expect(screen.getByText('Economic Reality')).toBeInTheDocument();
        expect(screen.getByText('Market Recognition')).toBeInTheDocument();
        click('Continue to Thesis Survival');
        click(/Skip animation/);
        expect(screen.getByLabelText('Causal transmission links')).toBeInTheDocument();
        click('Continue to Adversarial Confirmation');
        click(/Skip animation/);
        expect(screen.getByText('The strongest case against it.')).toBeInTheDocument();
        click('Choose finalists');
        fireEvent.click(screen.getAllByRole('checkbox')[0]);
        click('Discuss expression strategy');
        for (const q of expressionQuestions)
            click(q.choices[0]);
        click('Complete research output');
        expect(screen.getByText('Conviction, with conditions.')).toBeInTheDocument();
        expect(screen.getByText('THE CASE AGAINST')).toBeInTheDocument();
        expect(fetch).not.toHaveBeenCalled();
    });
    it('allows candidate inspection and preserves the exclusion record', () => { composeUI(); click(/Skip animation/); click('Exclude VRT'); click('Inspect VRT Vertiv'); expect(screen.getByRole('dialog')).toBeVisible(); expect(screen.getByText(/user excluded/i, { selector: '.detail-inner>p' })).toBeInTheDocument(); click('Close candidate detail'); click('Restore VRT'); expect(screen.getByRole('button', { name: 'Exclude VRT' })).toBeInTheDocument(); });
    it('timed progression and skip reveal the same fixture outcome', () => { vi.useFakeTimers(); composeUI(); act(() => { vi.advanceTimersByTime(3000); }); expect(screen.getByText('9 candidates retained for scrutiny. 0 excluded by you.')).toBeInTheDocument(); expect(screen.getByRole('button', { name: 'Continue to Reality & Recognition' })).toBeEnabled(); });
    it('reduced motion bypasses replay without losing results', () => { vi.spyOn(window, 'matchMedia').mockImplementation(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }) as unknown as MediaQueryList); composeUI(); expect(screen.queryByText(/Skip animation/)).not.toBeInTheDocument(); expect(screen.getByLabelText('Discovery causal map')).toBeInTheDocument(); });
});
