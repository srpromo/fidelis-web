import type {StateMomentumConfidence,TrajectoryPoint,CandidateDisposition} from '../types';
import type {CandidateDiscoveryState,UserCandidateDecision} from '../discovery/model';
export type VolumeCycleState='DORMANT'|'EMERGING'|'EXPANDING'|'CONFIRMED'|'SATURATED'|'DISTRIBUTING'|'CONTRACTING'|'RESET';
export type Gap='NEGATIVE GAP'|'ALIGNED'|'POSITIVE GAP'|'LARGE POSITIVE GAP'|'CLOSING POSITIVE GAP';
export interface SpecialistSMC extends StateMomentumConfidence {evidence:string;inference:string;limitation:string}
export interface CandidateT1State {
 ticker:string; economic:StateMomentumConfidence; recognition:StateMomentumConfidence;
 fq:SpecialistSMC; dm:SpecialistSMC; cf:SpecialistSMC; ve:SpecialistSMC; tr:SpecialistSMC;
 cycle:{from:VolumeCycleState;to:VolumeCycleState}; regime:'Compression'|'Transition'|'Expansion'|'Contraction';
 gap:Gap; gapExplanation:string; contradictions:string[]; disposition:Exclude<CandidateDisposition,'THESIS_FAILURE'>;
 t0:TrajectoryPoint; t1:TrajectoryPoint;
 // Illustrative layout coordinates supplied by the result, never calculated from specialists by UI.
 map:{reality:number;recognition:number};
}
export type Wash1EventType='WASH_1_STARTED'|'ECONOMIC_REALITY_STARTED'|'FUNDAMENTAL_QUALITY_ANALYSIS_STARTED'|'FUNDAMENTAL_QUALITY_ANALYSIS_COMPLETE'|'BUSINESS_DEMAND_ANALYSIS_STARTED'|'BUSINESS_DEMAND_ANALYSIS_COMPLETE'|'ECONOMIC_REALITY_FROZEN'|'SECURITY_DEMAND_ANALYSIS_STARTED'|'VOLUME_CYCLE_ANALYSIS_STARTED'|'VOLUME_CYCLE_ANALYSIS_COMPLETE'|'SECURITY_DEMAND_ANALYSIS_COMPLETE'|'EXPECTATIONS_ANALYSIS_STARTED'|'EXPECTATIONS_ANALYSIS_COMPLETE'|'TECHNICAL_REGIME_ANALYSIS_STARTED'|'TECHNICAL_REGIME_ANALYSIS_COMPLETE'|'MARKET_STATE_FROZEN'|'REALITY_RECOGNITION_COMPARISON_STARTED'|'REALITY_RECOGNITION_COMPARISON_COMPLETE'|'WASH_1_SYNTHESIS_STARTED'|'WASH_1_COMPLETE';
export interface Wash1State {
 status:'RUNNING'|'COMPLETE';cursor:number; participants:string[];
 discovery:Record<string,CandidateDiscoveryState>;
 economicFrozen:boolean;marketFrozen:boolean;comparisonComplete:boolean;
 results:Record<string,CandidateT1State>;excluded:string[];decisions:UserCandidateDecision[];readyForWash2:boolean;
}
export const wash1Count=(w:Wash1State)=>w.participants.filter(t=>w.results[t]?.disposition==='ADVANCE'&&!w.excluded.includes(t)).length;
export type Wash1Action={type:'START_WASH1'}|{type:'WASH1_EVENT';index:number}|{type:'CURATE_WASH1';ticker:string}|{type:'READY_FOR_WASH2'};
