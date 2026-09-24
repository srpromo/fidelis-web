import type {Confidence,StateMomentumConfidence,TrajectoryPoint} from '../types';
import type {UserCandidateDecision} from '../discovery/model';
import type {CandidateT1State} from '../wash1/model';
export type CausalLinkState='Strong'|'Moderate'|'Fragile'|'Unresolved'|'Broken';
export interface CausalLink {from:string;to:string;state:CausalLinkState;confidence:Confidence;evidence:string;reason:string;weakness:string;lag:string}
export interface MaterialFragility {mechanism:string;category:string;likelihood:string;severity:string;horizon:string;mitigability:string;confidence:Confidence;effect:string}
export interface HistoricalAnalogue {support:'Limited'|'Moderate'|'Unresolved';analogue:string;similarity:string;difference:string;confidence:Confidence;limitation:string}
export interface MacroContext {factor:string;state:'Supportive'|'Neutral'|'Mixed'|'Adverse'|'Indeterminate';explanation:string}
export interface IndustryContext {state:'Expanding'|'Stable'|'Compressing'|'Mixed';layer:string;explanation:string;valueAccrual:string}
export interface CandidateT2State {
 ticker:string;ct:StateMomentumConfidence;chain:CausalLink[];fragilities:MaterialFragility[];failureConditions:string[];
 br:HistoricalAnalogue;
 // MR/SI/DC are illustrative broader-architecture context, not a claim about historical minimum execution.
 context:{scope:'BROADER_ARCHITECTURE_DEMO';macro:MacroContext[];industry:IndustryContext;dependencies:string[]};
 survival:'STRONG'|'SURVIVES WITH CONDITIONS'|'MATERIAL CHALLENGE'|'WEAKENED'|'FAILS / UNRESOLVED';
 disposition:'ADVANCE'|'REVIEW'|'HOLD';reason:string;contradictions:string[];t2:TrajectoryPoint;
}
export type Wash2EventType='WASH_2_STARTED'|'CAUSAL_THESIS_ANALYSIS_STARTED'|'CAUSAL_CHAIN_BUILT'|'CAUSAL_THESIS_ANALYSIS_COMPLETE'|'FRAGILITY_ANALYSIS_STARTED'|'FRAGILITY_ANALYSIS_COMPLETE'|'BASE_RATE_ANALYSIS_STARTED'|'BASE_RATE_ANALYSIS_COMPLETE'|'MACRO_REGIME_CONTEXT_STARTED'|'MACRO_REGIME_CONTEXT_COMPLETE'|'INDUSTRY_CONTEXT_STARTED'|'INDUSTRY_CONTEXT_COMPLETE'|'DEPENDENCY_ANALYSIS_STARTED'|'DEPENDENCY_ANALYSIS_COMPLETE'|'THESIS_SURVIVAL_SYNTHESIS_STARTED'|'WASH_2_COMPLETE';
export interface Wash2State {status:'RUNNING'|'COMPLETE';cursor:number;participants:string[];prior:Record<string,CandidateT1State>;results:Record<string,CandidateT2State>;excluded:string[];decisions:UserCandidateDecision[];readyForWash3:boolean}
export type Wash2Action={type:'START_WASH2'}|{type:'WASH2_EVENT';index:number}|{type:'CURATE_WASH2';ticker:string}|{type:'READY_FOR_WASH3'};
export const wash2Count=(w:Wash2State)=>w.participants.filter(t=>w.results[t]?.disposition==='ADVANCE'&&!w.excluded.includes(t)).length;
