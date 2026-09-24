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
// One pass accelerates Alpha UX testing only. Production stops at thesis sufficiency,
// with consequential clarification as needed, never at a fixed number of turns.
export const localAssistant: ThesisAssistant = { async respond({ message }) {
    return {message: 'I’ve structured your observation into a testable infrastructure thesis: investment creates demand for power, cooling and connectivity suppliers, while the market may underestimate the lag into revenue and cash. This demo uses a two-year horizon; delayed projects or failed cash conversion would weaken it. Review or edit those assumptions before locking.',
    thesis: {version:1, observation:message,
        mechanism:'AI data-center investment requires power, cooling and connectivity to turn compute spending into usable capacity.',
        beneficiaries:'Suppliers of essential physical infrastructure around compute',
        pathways:'Power, cooling and connectivity', exclusions:'Narrative exposure without a direct economic link',
        recognition:'The market may underestimate committed demand whose economic contribution is not yet visible.',
        horizon:'two years', falsifiers:'Projects are delayed or orders fail to convert into durable cash flow',
        proposition:'Over two years, AI data-center investment may benefit suppliers of power, cooling and connectivity before the market fully recognizes their contribution. Research will test whether committed demand becomes durable revenue and cash flow. The thesis weakens if projects are delayed or orders fail to convert into cash.'}};
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
