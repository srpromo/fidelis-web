import type { ResearchRun, ThesisVersion } from '../types';
import { createRun } from '../state/research';
import {initialDiscovery,applyDiscoveryEvent,discoveryCounts,type ResearchActivityEvent,type DiscoveryResult,type DiscoveryAction} from '../discovery/model';
export type {ResearchActivityEvent} from '../discovery/model';
export interface CheckpointRun extends ResearchRun {
    activity: ResearchActivityEvent[];
    discovery: DiscoveryResult | null;
}
export interface AssistantRequest {
    message: string;
    thesis: ThesisVersion | null;
}
export interface AssistantResponse {
    message: string;
    thesis: ThesisVersion;
}
// Replace this adapter with a bounded service response; chat rendering owns no provider logic.
export interface ThesisAssistant {
    respond(request: AssistantRequest): Promise<AssistantResponse>;
}
export const localAssistant: ThesisAssistant = { async respond({ message, thesis }) {
        if (!thesis)
            return { message: 'There is a researchable idea here: spending on compute also requires physical infrastructure. Are you looking for businesses where the benefit is already appearing in results, or where it has not yet become visible?', thesis: { version: 1, observation: message, mechanism: 'AI data-center investment requires power, cooling and connectivity to turn compute spending into usable capacity.', beneficiaries: 'Suppliers of essential physical infrastructure around compute', pathways: 'Power, cooling and connectivity', exclusions: 'Narrative exposure without a direct economic link', recognition: '', horizon: '', falsifiers: '', proposition: '' } };
        const next = { ...thesis, version: thesis.version + 1 };
        if (!next.recognition) {
            next.recognition = message;
            return { thesis: next, message: /already|appearing|results/i.test(message) ? 'Then the distinction is between improving economics and how much the market already recognizes. We should look for conversion into revenue and cash, not simply more orders. Over what horizon should that difference become visible?' : 'Then we are testing a lag between infrastructure commitments and visible company economics. The missing link is conversion, not enthusiasm about AI. How long should that conversion have to become visible?' };
        }
        ;
        if (!next.horizon) {
            next.horizon = message;
            return { thesis: next, message: `We’ll hold the idea to that horizon: ${message}. What would make you reconsider — orders failing to turn into cash, customer projects being delayed, or a different observation?` };
        }
        ;
        next.falsifiers = message;
        const focus = /already|appearing|results/i.test(next.recognition) && !/not|yet|before/i.test(next.recognition) ? 'improving company economics that market expectations may not fully reflect' : 'committed infrastructure demand whose economic contribution is not yet fully visible';
        next.proposition = `Over ${next.horizon}, AI data-center investment may benefit suppliers of power, cooling and connectivity before the market fully recognizes their contribution. The research will focus on ${focus}, testing whether orders become durable revenue and cash flow. The thesis weakens if ${next.falsifiers.replace(/[.!?]$/, '')}.`;
        return { thesis: next, message: 'This thesis is ready to research. We have a causal claim, a horizon and a way to be wrong. Review the proposition below before holding it fixed.' };
    } };
export function initialCheckpoint(): CheckpointRun { return { ...createRun(), runId: 'FID-DEMO-003', sessionId: 'checkpoint-1', provenance: { fixtureVersion: 'alpha-003-checkpoint-1', evidenceId: 'local-thesis-harness', mode: 'DEMONSTRATION', source: 'SANITIZED_FIXTURE', liveData: false }, activity: [], discovery:null }; }
export type CheckpointAction = DiscoveryAction | {
    type: 'REPLY';
    input: string;
    response: AssistantResponse;
} | {
    type: 'EDIT';
    text: string;
} | {
    type: 'LOCK';
};
export function checkpointReducer(run: CheckpointRun, action: CheckpointAction): CheckpointRun {
    if (run.lockedThesis && run.discovery) {
        if(action.type==='DISCOVERY_EVENT') {const discovery=applyDiscoveryEvent(run.discovery,action.event);return discovery===run.discovery?run:{...run,discovery,activity:[...run.activity,action.event]};}
        if(action.type==='CURATE_DISCOVERY'&&run.discovery.status==='COMPLETE') {
            const old=run.discovery.candidates[action.ticker];if(!old||old.validation!=='VALIDATED')return run;
            const excluding=old.userState==='RETAINED';return {...run,discovery:{...run.discovery,readyToSave:false,candidates:{...run.discovery.candidates,[action.ticker]:{...old,userState:excluding?'USER_EXCLUDED':'RETAINED'}},decisions:[...run.discovery.decisions,{ticker:action.ticker,decision:excluding?'USER_EXCLUDED':'USER_REINCLUDED',ordinal:run.discovery.decisions.length+1}]}};
        }
        if(action.type==='READY_FOR_WASH'&&run.discovery.status==='COMPLETE'&&discoveryCounts(run.discovery).proceed>0)return {...run,discovery:{...run.discovery,readyToSave:true}};
        return run;
    }
    const event = run.event + 1;
    if (action.type === 'REPLY')
        return { ...run, event, stage: 'COMPOSITION', drafts: [...run.drafts, action.response.thesis], conversation: [...run.conversation, { role: 'user', text: action.input, event }, { role: 'fidelis', text: action.response.message, event }] };
    if (action.type === 'EDIT' && action.text.trim() && run.drafts.at(-1)?.proposition) {
        return { ...run, event, drafts: [...run.drafts, { ...run.drafts.at(-1)!, version: run.drafts.at(-1)!.version + 1, proposition: action.text.trim() }] };
    }
    if (action.type === 'LOCK' && run.drafts.at(-1)?.proposition)
        return { ...run, event, stage: 'DISCOVERY', discovery:initialDiscovery(), lockedThesis: { ...run.drafts.at(-1)!, lockedAtEvent: event }, activity: [{ id: 'thesis-locked', type: 'THESIS_LOCKED', origin: 'LOCAL_DEMO', message: 'Thesis locked · FID-DEMO-003' }] };
    return run;
}
