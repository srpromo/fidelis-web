import type {Confidence,TrajectoryPoint} from '../types';
import type {Wash2State} from '../wash2/model';
export type AdversarialVerdict='CHALLENGE LARGELY ABSORBED'|'CHALLENGE RAISED — THESIS SURVIVES'|'MATERIAL CHALLENGE — THESIS SURVIVES WITH CONDITIONS'|'THESIS MATERIALLY WEAKENED'|'THESIS FAILURE';
export type FinalistState='FINALIST ELIGIBLE'|'SURVIVES — REVIEW'|'HELD'|'THESIS FAILURE';
export interface AdversarialChallenge {title:string;why:string;support:string;survived:string;resolution:string}
export interface EvidenceIntegrityState {authority:Confidence;freshness:string;pointInTime:string;conflicts:{supporting:string;conflicting:string};missing:string;reproducibility:string;confidence:Confidence;limitation:string;sufficient:boolean}
export interface CandidateT3State {
 ticker:string;verdict:AdversarialVerdict;challenged:string;survived:string;weakened:string;unresolved:string;
 caseFor:string[];caseAgainst:string[];challenges:AdversarialChallenge[];
 alternative:{primary:string;alternative:string;distinguish:string};
 pricedIn:string;timing:{direction:string;state:'EARLY'|'BALANCED'|'LATE / RECOGNITION ADVANCED'|'CATALYST-DEPENDENT'|'UNCERTAIN';reason:string};
 integrity:EvidenceIntegrityState;
 comparative:{strength:string;tradeoff:string;conclusion:string;disagreement:string};
 status:FinalistState;causalIntact:boolean;t3:TrajectoryPoint;
 lineage:{fixtureVersion:'alpha-003-wash3-v1';source:'SANITIZED_FIXTURE';prior:'WASH_2_T2';liveData:false};
}
export type Wash3EventType='WASH_3_STARTED'|'ADVERSARIAL_REVIEW_STARTED'|'ASSUMPTION_CHALLENGE_STARTED'|'ASSUMPTION_CHALLENGE_COMPLETE'|'CONTRADICTORY_EVIDENCE_REVIEW_STARTED'|'CONTRADICTORY_EVIDENCE_REVIEW_COMPLETE'|'ALTERNATIVE_EXPLANATION_REVIEW_STARTED'|'ALTERNATIVE_EXPLANATION_REVIEW_COMPLETE'|'ADVERSARIAL_REVIEW_COMPLETE'|'EVIDENCE_INTEGRITY_REVIEW_STARTED'|'EVIDENCE_INTEGRITY_REVIEW_COMPLETE'|'COMPARATIVE_SYNTHESIS_STARTED'|'COMPARATIVE_SYNTHESIS_COMPLETE'|'T3_STATE_FINALIZED'|'WASH_3_COMPLETE';
export interface Wash3State {status:'RUNNING'|'COMPLETE';cursor:number;participants:string[];prior:Wash2State;results:Record<string,CandidateT3State>;selected:string[];excluded:string[];decisions:{ticker:string;decision:'SELECTED'|'DESELECTED'|'USER_EXCLUDED'|'USER_REINCLUDED';ordinal:number}[];finalistsSaved:boolean}
export type Wash3Action={type:'START_WASH3'}|{type:'WASH3_EVENT';index:number}|{type:'SELECT_FINALIST';ticker:string}|{type:'CURATE_WASH3';ticker:string}|{type:'SAVE_FINALISTS'};
// Expression cannot repair an upstream failure. Eligibility is enforced independently of UI controls.
export function finalistEligible(r:CandidateT3State|undefined):boolean {return !!r&&r.status==='FINALIST ELIGIBLE'&&r.verdict!=='THESIS FAILURE'&&r.causalIntact&&r.integrity.sufficient&&r.t3.disposition==='ADVANCE'}
export const selectedFinalists=(w:Wash3State)=>w.selected.filter(t=>w.participants.includes(t)&&!w.excluded.includes(t)&&finalistEligible(w.results[t]));
