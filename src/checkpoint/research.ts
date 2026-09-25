import {startExpression,reduceExpression} from '../expression/state';
import type {ExpressionState,ExpressionAction} from '../expression/model';
import {startWash3,reduceWash3} from '../wash3/state';
import {wash3Events,wash3Fixtures} from '../wash3/fixtures';
import {selectedFinalists,finalistEligible,type Wash3State,type Wash3Action} from '../wash3/model';
import {wash2Count} from '../wash2/model';
import {startWash2,reduceWash2} from '../wash2/state';
import {wash2Events} from '../wash2/fixtures';
import {wash1Count} from '../wash1/model';
import type {Wash2State,Wash2Action} from '../wash2/model';
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
    wash2:Wash2State|null;
    wash3:Wash3State|null;
    expression:ExpressionState|null;
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
export function initialCheckpoint(): CheckpointRun { return { ...createRun(), runId: 'FID-DEMO-003', sessionId: 'checkpoint-1', provenance: { fixtureVersion: 'alpha-003-checkpoint-1', evidenceId: 'local-thesis-harness', mode: 'DEMONSTRATION', source: 'SANITIZED_FIXTURE', liveData: false }, activity: [], wash1:null, wash2:null, wash3:null, expression:null, discovery:null }; }
export type CheckpointAction = ExpressionAction | Wash3Action | Wash2Action | Wash1Action | DiscoveryAction | {
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
    if(run.expression){
        const expression=reduceExpression(run.expression,action as ExpressionAction);
        return expression===run.expression?run:{...run,expression,event:run.event+1};
    }
    if(action.type==='START_EXPRESSION'){
        const expression=startExpression(run);
        return expression?{...run,expression,stage:'EXPRESSION',event:run.event+1}:run;
    }
    if(run.wash3){
        const wash3=reduceWash3(run.wash3,action as Wash3Action);
        if(wash3===run.wash3)return run;
        const completed=wash3.status==='COMPLETE'&&run.wash3.status!=='COMPLETE';
        const universe={...run.universe};
        if(completed)for(const t of wash3.participants)universe[t]={...universe[t],trajectory:[...universe[t].trajectory,wash3.results[t].t3]};
        if(action.type==='CURATE_WASH3')universe[action.ticker]={...universe[action.ticker],userExcluded:wash3.excluded.includes(action.ticker)};
        return {...run,wash3,universe,event:run.event+1,
          finalists:wash3.participants.filter(t=>finalistEligible(wash3.results[t])&&!wash3.excluded.includes(t)).map(ticker=>({ticker,selected:selectedFinalists(wash3).includes(ticker)})),
          activity:action.type==='WASH3_EVENT'?[...run.activity,wash3Events[action.index]]:run.activity,
          exclusions:action.type==='CURATE_WASH3'?[...run.exclusions,{ticker:action.ticker,decision:wash3.excluded.includes(action.ticker)?'USER_EXCLUDED':'USER_RESTORED',stage:'WASH_3',event:run.event+1}]:run.exclusions,
          washes:completed?[...run.washes,{stage:'WASH_3',participants:wash3.participants,analyzed:wash3.participants.length,advance:Object.values(wash3.results).filter(finalistEligible).length,held:Object.values(wash3.results).filter(r=>!finalistEligible(r)&&r.status!=='THESIS FAILURE').length,failed:Object.values(wash3.results).filter(r=>r.status==='THESIS FAILURE').length,excluded:0,recallAdded:0,event:run.event+1}]:run.washes};
    }
    if(action.type==='START_WASH3'&&run.wash2?.status==='COMPLETE'&&wash2Count(run.wash2)>0){
        const wash3=startWash3(run.wash2);
        if(wash3.participants.some(t=>!wash3Fixtures[t]))return run;
        return {...run,wash3,wash2:{...run.wash2,readyForWash3:true},stage:'WASH_3',event:run.event+1};
    }
    if(run.wash2){
        const wash2=reduceWash2(run.wash2,action as Wash2Action);
        if(wash2===run.wash2)return run;
        const completed=wash2.status==='COMPLETE'&&run.wash2.status!=='COMPLETE';
        const universe={...run.universe};
        if(completed)for(const t of wash2.participants)universe[t]={...universe[t],trajectory:[...universe[t].trajectory,wash2.results[t].t2]};
        if(action.type==='CURATE_WASH2')universe[action.ticker]={...universe[action.ticker],userExcluded:wash2.excluded.includes(action.ticker)};
        return {...run,wash2,universe,event:run.event+1,
          activity:action.type==='WASH2_EVENT'?[...run.activity,wash2Events[action.index]]:run.activity,
          exclusions:action.type==='CURATE_WASH2'?[...run.exclusions,{ticker:action.ticker,decision:wash2.excluded.includes(action.ticker)?'USER_EXCLUDED':'USER_RESTORED',stage:'WASH_2',event:run.event+1}]:run.exclusions,
          washes:completed?[...run.washes,{stage:'WASH_2',participants:wash2.participants,analyzed:wash2.participants.length,advance:Object.values(wash2.results).filter(r=>r.disposition==='ADVANCE').length,held:Object.values(wash2.results).filter(r=>r.disposition!=='ADVANCE').length,failed:0,excluded:0,recallAdded:0,event:run.event+1}]:run.washes};
    }
    if(action.type==='START_WASH2'&&run.wash1?.status==='COMPLETE'&&wash1Count(run.wash1)>0){
        return {...run,wash2:startWash2(run.wash1),wash1:{...run.wash1,readyForWash2:true},stage:'WASH_2',event:run.event+1};
    }
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
