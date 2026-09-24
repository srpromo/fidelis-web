export type DiscoveryEventType='THESIS_LOCKED'|'DISCOVERY_STARTED'|'THESIS_CAUSAL_MAP_STARTED'|'THESIS_CAUSAL_MAP_COMPLETE'|'PATHWAY_IDENTIFIED'|'CANDIDATE_SEARCH_STARTED'|'CANDIDATE_IDENTIFIED'|'EXPOSURE_VALIDATION_STARTED'|'EXPOSURE_VALIDATION_COMPLETE'|'CANDIDATE_REJECTED'|'DISCOVERY_RECALL_STARTED'|'DISCOVERY_RECALL_CANDIDATE_IDENTIFIED'|'DISCOVERY_COMPLETE';
export interface CausalRelationship {from:string;to:string;explanation:string}
export interface DiscoveryPathway {id:string;label:string;relationship:CausalRelationship}
export interface DiscoveryCandidate {ticker:string;company:string;pathway:string;relationship:string;exposure:'High'|'Moderate'|'Low'|'Unresolved';confidence:'High'|'Moderate'|'Low';recall?:boolean;rejection?:string}
export interface ResearchActivityEvent {id:string;type:DiscoveryEventType;origin:'LOCAL_DEMO'|'FIDELIS_SERVICE';message:string;sequence?:number;pathway?:DiscoveryPathway;candidate?:DiscoveryCandidate;ticker?:string}
export interface CandidateDiscoveryState {candidate:DiscoveryCandidate;validation:'PENDING'|'VALIDATED'|'REJECTED';userState:'RETAINED'|'USER_EXCLUDED'}
export interface UserCandidateDecision {ticker:string;decision:'USER_EXCLUDED'|'USER_REINCLUDED';ordinal:number}
export interface DiscoveryResult {status:'RUNNING'|'COMPLETE';cursor:number;pathways:DiscoveryPathway[];candidates:Record<string,CandidateDiscoveryState>;decisions:UserCandidateDecision[];readyToSave:boolean}
export type DiscoveryAction={type:'DISCOVERY_EVENT';event:ResearchActivityEvent}|{type:'CURATE_DISCOVERY';ticker:string}|{type:'READY_FOR_WASH'};
export const initialDiscovery=():DiscoveryResult=>({status:'RUNNING',cursor:0,pathways:[],candidates:{},decisions:[],readyToSave:false});
export function discoveryCounts(d:DiscoveryResult){const all=Object.values(d.candidates);return {examined:all.length,validated:all.filter(c=>c.validation==='VALIDATED').length,rejected:all.filter(c=>c.validation==='REJECTED').length,pending:all.filter(c=>c.validation==='PENDING').length,recall:all.filter(c=>c.candidate.recall&&c.validation==='VALIDATED').length,proceed:all.filter(c=>c.validation==='VALIDATED'&&c.userState==='RETAINED').length}}
export function applyDiscoveryEvent(d:DiscoveryResult,e:ResearchActivityEvent):DiscoveryResult{
 if(d.status==='COMPLETE'||e.sequence!==d.cursor)return d;
 let next={...d,cursor:d.cursor+1};
 if(e.type==='PATHWAY_IDENTIFIED'&&e.pathway)next={...next,pathways:[...d.pathways,e.pathway]};
 if((e.type==='CANDIDATE_IDENTIFIED'||e.type==='DISCOVERY_RECALL_CANDIDATE_IDENTIFIED')&&e.candidate)next={...next,candidates:{...d.candidates,[e.candidate.ticker]:{candidate:e.candidate,validation:e.type==='DISCOVERY_RECALL_CANDIDATE_IDENTIFIED'?'VALIDATED':'PENDING',userState:'RETAINED'}}};
 if((e.type==='EXPOSURE_VALIDATION_COMPLETE'||e.type==='CANDIDATE_REJECTED')&&e.ticker&&d.candidates[e.ticker])next={...next,candidates:{...d.candidates,[e.ticker]:{...d.candidates[e.ticker],validation:e.type==='CANDIDATE_REJECTED'?'REJECTED':'VALIDATED'}}};
 if(e.type==='DISCOVERY_COMPLETE'){if(discoveryCounts(next).pending)return d;next={...next,status:'COMPLETE'}}
 return next;
}
