import type { ResearchRun, ResearchStage, ThesisVersion, AccessPolicy, NextStageAccess, Chronology, ExpressionAnalysis } from '../types';
import { candidates, byTicker } from '../data/demo';
export const policy: AccessPolicy = { policyVersion: 'alpha-002-demo-v1', authenticationBoundary: 'DISABLED', entitlementBoundary: 'DISABLED' };
export function nextStageAccess(run: ResearchRun, next: ResearchStage): NextStageAccess {
    if (run.policy.authenticationBoundary === next && run.owner.kind === 'anonymous')
        return 'AUTHENTICATION_REQUIRED';
    if (run.policy.entitlementBoundary === next)
        return 'ENTITLEMENT_REQUIRED';
    return 'ALLOWED';
}
export function claimRun(run: ResearchRun, accountId: string): ResearchRun { return { ...run, owner: { kind: 'account', id: accountId } }; }
export function createRun(): ResearchRun { return { runId: 'FID-DEMO-002', sessionId: 'local-demo-session', createdAt: '2026-01-01T00:00:00Z', mode: 'DEMONSTRATION', stage: 'OBSERVATION', owner: { kind: 'anonymous' }, policy: { ...policy }, provider: { primaryProvider: 'FIDELIS_DEFAULT', mode: 'DETERMINISTIC_DEMO' }, usage: { providerCalls: 0 }, provenance: { fixtureVersion: 'alpha-002-v1', evidenceId: 'public-demo-evidence-002', mode: 'DEMONSTRATION', source: 'SANITIZED_FIXTURE', liveData: false }, event: 0, conversation: [], drafts: [], lockedThesis: null, universe: {}, exclusions: [], washes: [], finalists: [], preferences: { objective: '', horizon: '', path: '', risk: '', conviction: '' }, expressions: [], support: null, caseFor: null, caseAgainst: null, exceptions: [], pending: null }; }
export const thesisQuestions = [{ key: 'recognition', text: 'Where is the overlooked economic link: infrastructure that is already improving, or benefits that have yet to reach reported results?', choices: ['Underrecognized physical infrastructure', 'Already improving company economics'] }, { key: 'horizon', text: 'How long should this causal chain have to become visible in revenue and cash flow?', choices: ['12–24 months', 'Three to five years'] }, { key: 'falsifiers', text: 'What observable evidence would make you reconsider the thesis?', choices: ['Orders fail to convert into revenue and cash', 'Customer construction plans are cut or delayed'] }];
function draft(observation: string): ThesisVersion { return { version: 1, observation, mechanism: 'AI infrastructure expansion requires physical capacity, creating demand for enabling suppliers.', beneficiaries: 'Cooling, electrical and network infrastructure suppliers', pathways: 'Compute → connectivity → thermal management → power', exclusions: 'Pure narrative exposure without a causal economic link', recognition: '', horizon: '', falsifiers: '', proposition: '' }; }
export function participants(run: ResearchRun) { return Object.values(run.universe).filter(c => !c.userExcluded && c.trajectory.at(-1)?.disposition !== 'THESIS_FAILURE'); }
export type Action = {
    type: 'OBSERVE';
    text: string;
} | {
    type: 'ANSWER';
    text: string;
} | {
    type: 'EDIT';
    text: string;
} | {
    type: 'LOCK';
} | {
    type: 'BEGIN';
    stage: ResearchStage;
} | {
    type: 'COMPLETE';
} | {
    type: 'CURATE';
    ticker: string;
} | {
    type: 'FINALISTS';
} | {
    type: 'SELECT_FINALIST';
    ticker: string;
} | {
    type: 'EXPRESSION';
} | {
    type: 'PREFERENCE';
    key: keyof ResearchRun['preferences'];
    value: string;
} | {
    type: 'OUTPUT';
} | {
    type: 'RESET';
};
export function reducer(run: ResearchRun, action: Action): ResearchRun {
    const event = run.event + 1;
    if (action.type === 'RESET')
        return createRun();
    if (action.type === 'OBSERVE' && run.stage === 'OBSERVATION' && action.text.trim()) {
        return { ...run, event, stage: 'COMPOSITION', conversation: [{ role: 'user', text: action.text.trim(), event }, { role: 'fidelis', text: 'Let’s make the causal claim testable. This deterministic demo explores AI infrastructure; your observation is preserved verbatim. ' + thesisQuestions[0].text, event }], drafts: [draft(action.text.trim())] };
    }
    if (action.type === 'ANSWER' && run.stage === 'COMPOSITION' && action.text.trim()) {
        const current = run.drafts.at(-1)!;
        const index = thesisQuestions.findIndex(q => !current[q.key as keyof ThesisVersion]);
        if (index < 0)
            return run;
        const next = { ...current, version: current.version + 1, [thesisQuestions[index].key]: action.text.trim() };
        if (index === 2)
            next.proposition = `Over ${next.horizon.toLowerCase()}, AI infrastructure spending may translate into revenue and cash flow for physical infrastructure suppliers. The research will test ${next.recognition.toLowerCase()}, and weaken the thesis if ${next.falsifiers.toLowerCase()}.`;
        return { ...run, event, drafts: [...run.drafts, next], conversation: [...run.conversation, { role: 'user', text: action.text.trim(), event }, { role: 'fidelis', text: index < 2 ? thesisQuestions[index + 1].text : 'The thesis now has a causal path, horizon and falsifier. Review or edit the composition; nothing proceeds until you lock it.', event }] };
    }
    if (action.type === 'EDIT' && run.stage === 'COMPOSITION') {
        const d = run.drafts.at(-1)!;
        return { ...run, event, drafts: [...run.drafts, { ...d, version: d.version + 1, proposition: action.text }] };
    }
    if (action.type === 'LOCK' && run.stage === 'COMPOSITION' && run.drafts.at(-1)?.proposition.trim() && nextStageAccess(run, 'DISCOVERY') === 'ALLOWED')
        return { ...run, event, lockedThesis: { ...run.drafts.at(-1)!, lockedAtEvent: event }, stage: 'DISCOVERY', pending: 'DISCOVERY' };
    if (action.type === 'BEGIN' && !run.pending && participants(run).length && nextStageAccess(run, action.stage) === 'ALLOWED') {
        const sequence: Partial<Record<ResearchStage, ResearchStage>> = { DISCOVERY: 'WASH_1', WASH_1: 'WASH_2', WASH_2: 'WASH_3' };
        if (sequence[run.stage] !== action.stage)
            return run;
        return { ...run, event, stage: action.stage, pending: action.stage };
    }
    if (action.type === 'COMPLETE' && run.pending) {
        const t = ({ DISCOVERY: 0, WASH_1: 1, WASH_2: 2, WASH_3: 3 } as Record<string, Chronology>)[run.pending];
        if (t === undefined)
            return run;
        const universe = { ...run.universe };
        let ids = t === 0 ? candidates.filter(c => !c.recall).map(c => c.ticker) : participants(run).map(c => c.ticker);
        let recallAdded = 0;
        if (t === 1) {
            const recall = candidates.filter(c => c.recall && !universe[c.ticker]);
            ids = [...ids, ...recall.map(c => c.ticker)];
            recallAdded = recall.length;
        }
        for (const ticker of ids) {
            const old = universe[ticker];
            universe[ticker] = { ticker, userExcluded: old?.userExcluded ?? false, introducedAt: old?.introducedAt ?? run.pending, trajectory: [...(old?.trajectory ?? []), { ...byTicker[ticker].points[t] }] };
        }
        const finalPoints = ids.map(id => universe[id].trajectory.at(-1)!);
        return { ...run, event, universe, pending: null, washes: [...run.washes, { stage: run.pending, participants: ids, analyzed: ids.length, advance: finalPoints.filter(p => p.disposition === 'ADVANCE').length, held: finalPoints.filter(p => ['HOLD', 'REVIEW'].includes(p.disposition)).length, failed: finalPoints.filter(p => p.disposition === 'THESIS_FAILURE').length, excluded: Object.values(run.universe).filter(c => c.userExcluded).length, recallAdded, event }], exceptions: t === 3 ? [...run.exceptions, ...ids.filter(id => universe[id].trajectory.at(-1)?.disposition === 'THESIS_FAILURE').map(ticker => ({ ticker, reason: 'Bounded thesis failed in the fixture; inspection remains available.', stage: run.pending! }))] : run.exceptions };
    }
    if (action.type === 'CURATE' && !run.pending && ['DISCOVERY', 'WASH_1', 'WASH_2', 'WASH_3'].includes(run.stage)) {
        const c = run.universe[action.ticker];
        if (!c)
            return run;
        const latest = run.stage === 'DISCOVERY' ? 0 : Number(run.stage.slice(-1));
        if (c.userExcluded && c.trajectory.at(-1)!.t !== latest)
            return run;
        return { ...run, event, universe: { ...run.universe, [c.ticker]: { ...c, userExcluded: !c.userExcluded } }, exclusions: [...run.exclusions, { ticker: c.ticker, decision: c.userExcluded ? 'USER_RESTORED' : 'USER_EXCLUDED', stage: run.stage, event }] };
    }
    if (action.type === 'FINALISTS' && run.stage === 'WASH_3' && !run.pending && nextStageAccess(run, 'FINALISTS') === 'ALLOWED')
        return { ...run, event, stage: 'FINALISTS', finalists: participants(run).filter(c => c.trajectory.at(-1)?.t === 3 && c.trajectory.at(-1)?.disposition === 'ADVANCE').map(c => ({ ticker: c.ticker, selected: false })) };
    if (action.type === 'SELECT_FINALIST' && run.stage === 'FINALISTS')
        return { ...run, event, finalists: run.finalists.map(c => c.ticker === action.ticker ? { ...c, selected: !c.selected } : c) };
    if (action.type === 'EXPRESSION' && run.stage === 'FINALISTS' && run.finalists.some(f => f.selected) && nextStageAccess(run, 'EXPRESSION') === 'ALLOWED')
        return { ...run, event, stage: 'EXPRESSION' };
    if (action.type === 'PREFERENCE' && run.stage === 'EXPRESSION')
        return { ...run, event, preferences: { ...run.preferences, [action.key]: action.value } };
    if (action.type === 'OUTPUT' && run.stage === 'EXPRESSION' && Object.values(run.preferences).every(Boolean) && nextStageAccess(run, 'OUTPUT') === 'ALLOWED') {
        const structure: ExpressionAnalysis['structure'] = run.preferences.risk === 'Stock-like durability' || run.preferences.path === 'Uncertain timing' ? 'Common stock' : run.preferences.risk === 'Accept premium loss for convexity' ? 'Long-duration call' : 'Call debit spread';
        return { ...run, event, stage: 'OUTPUT', expressions: run.finalists.filter(f => f.selected).map(f => ({ ticker: f.ticker, structure, rationale: `Illustrative fit for ${run.preferences.objective.toLowerCase()}, a ${run.preferences.horizon.toLowerCase()} horizon and ${run.preferences.path.toLowerCase()}. ${structure === 'Common stock' ? 'Avoids an expiry requirement while retaining equity downside.' : structure === 'Long-duration call' ? 'Preserves convex upside but the entire premium can be lost.' : 'Defines premium at risk and caps upside; recognition must arrive before expiry.'}`, inheritedRisks: [byTicker[f.ticker].principalRisk, 'Expectations may already reflect the favorable thesis.'], successConditions: structure === 'Common stock' ? ['Economics must support value over the selected horizon.', 'An attractive company can still be a poor entry price.'] : ['The underlying move must cover the premium before expiry.', 'Implied volatility, path and timing must fit the structure; no chain was evaluated.'] })), support: { label: 'Conditional support — demonstration', calibrated: false, evidenceConfidence: 'Moderate', contributors: [{ label: 'Economic reality', state: 'Supportive fixture observations' }, { label: 'Market recognition', state: 'Mixed across selected pathways' }, { label: 'Causal survival', state: 'Conditional on conversion' }, { label: 'Fragility', state: 'Material shared dependencies' }, { label: 'Macro compatibility', state: 'Financing-sensitive' }, { label: 'Adversarial survival', state: 'Challenges retained, not erased' }, { label: 'Evidence confidence', state: 'Limited to sanitized fixtures' }] }, caseFor: { points: ['Physical infrastructure is a necessary link between investment and usable compute capacity.', 'Selected survivors retain a plausible orders-to-cash transmission path.', 'The fixture separates emerging recognition from already demanding expectations.'] }, caseAgainst: { points: ['Orders could be pulled forward and fail to convert as customer construction slows.', 'Power and labor bottlenecks can delay every apparently diversified candidate together.', 'The expected improvement may already be priced in; correct direction can still produce a poor return.', 'Missing contract and cancellation evidence limits confidence in the narrative.'], changeConditions: ['Persistent cancellations or weakening backlog conversion would weaken the demand claim.', 'Flat cash generation despite higher reported orders would break a key causal link.', 'Customer budget cuts or prolonged power delays would invalidate the assumed horizon.'] } };
    }
    return run;
}
