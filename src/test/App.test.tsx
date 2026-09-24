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
