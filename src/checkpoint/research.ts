import {startWash1,reduceWash1} from '../wash1/state';
import {wash1Events,wash1Fixtures} from '../wash1/fixtures';
import type {Wash1State,Wash1Action} from '../wash1/model';
import type { ResearchRun, ThesisVersion } from '../types';
import { createRun } from '../state/research';
import {initialDiscovery,applyDiscoveryEvent,discoveryCounts,type ResearchActivityEvent,type DiscoveryResult,type DiscoveryAction} from '../discovery/model';
export type {ResearchActivityEvent} from '../discovery/model';
export interface CheckpointRun extends ResearchRun {
    activity: ResearchActivityEvent[];
    wash1:Wash1State|null;
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
export function initialCheckpoint(): CheckpointRun { return { ...createRun(), runId: 'FID-DEMO-003', sessionId: 'checkpoint-1', provenance: { fixtureVersion: 'alpha-003-checkpoint-1', evidenceId: 'local-thesis-harness', mode: 'DEMONSTRATION', source: 'SANITIZED_FIXTURE', liveData: false }, activity: [], wash1:null, discovery:null }; }
export type CheckpointAction = Wash1Action | DiscoveryAction | {
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
    if(run.wash1){
        const wash1=reduceWash1(run.wash1,action as Wash1Action);
        if(wash1===run.wash1)return run;
        const completed=wash1.status==='COMPLETE'&&run.wash1.status!=='COMPLETE';
        return {...run,wash1,event:run.event+1,exclusions:action.type==='CURATE_WASH1'?[...run.exclusions,{ticker:action.ticker,decision:wash1.excluded.includes(action.ticker)?'USER_EXCLUDED':'USER_RESTORED',stage:'WASH_1',event:run.event+1}]:run.exclusions,activity:action.type==='WASH1_EVENT'?[...run.activity,wash1Events[action.index]]:run.activity,
          universe:completed?Object.fromEntries(wash1.participants.map(t=>[t,{...run.universe[t],trajectory:[wash1.results[t].t0,wash1.results[t].t1]}])):action.type==='CURATE_WASH1'?{...run.universe,[action.ticker]:{...run.universe[action.ticker],userExcluded:wash1.excluded.includes(action.ticker)}}:run.universe,
          washes:completed?[{stage:'WASH_1',participants:wash1.participants,analyzed:wash1.participants.length,advance:Object.values(wash1.results).filter(r=>r.disposition==='ADVANCE').length,held:Object.values(wash1.results).filter(r=>r.disposition!=='ADVANCE').length,failed:0,excluded:0,recallAdded:0,event:run.event+1}]:run.washes};
    }
    if(action.type==='START_WASH1'&&run.discovery?.status==='COMPLETE'&&discoveryCounts(run.discovery).proceed>0){
        const wash1=startWash1(run.discovery);
        return {...run,wash1,stage:'WASH_1',event:run.event+1,discovery:{...run.discovery,readyToSave:true},universe:Object.fromEntries(wash1.participants.map(t=>[t,{ticker:t,trajectory:[structuredClone(wash1Fixtures[t].t0)],userExcluded:false,introducedAt:'DISCOVERY'}]))};
    }
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
