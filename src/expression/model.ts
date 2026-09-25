import type {CandidateT1State} from '../wash1/model';
import type {CandidateT2State} from '../wash2/model';
import type {CandidateT3State} from '../wash3/model';
import type {TrajectoryPoint} from '../types';
export type ExpressionFamily='STOCK'|'LONG_CALL'|'CALL_SPREAD';
export type ExpressionIntent='UNSPECIFIED'|'OWNERSHIP'|'CONVEXITY'|'DEFINED_RISK';
export interface ExpressionContext {
 ticker:string;company:string;horizon:string;thesis:string;t1:CandidateT1State;t2:CandidateT2State;t3:CandidateT3State;trajectory:TrajectoryPoint[];
 lineage:{runId:string;source:'SANITIZED_FIXTURE';prior:'WASH_3_T3';fixtureVersion:'alpha-003-expression-v1';liveData:false};
}
export interface ExpressionObjective {intent:ExpressionIntent;horizon:string;horizonSource:'Inherited from thesis'|'User refinement';risk:string;convexity:string;timingTolerance:string;path:string}
export interface ExpressionComparison {family:ExpressionFamily;dimensions:{label:string;value:string}[];fits:string[];constraints:string[];risks:string[];conditions:string[]}
export interface ExpressionAnalysis {objective:ExpressionObjective;comparisons:ExpressionComparison[];preferred:ExpressionFamily;alternative:ExpressionFamily;why:string;alternativeWhy:string;tradeoff:string;changes:string[];inheritedRisks:string[];limitation:string}
export interface FinalistExpressionState {context:ExpressionContext;draft:string;conversation:{role:'user'|'fidelis';text:string}[];analysis:ExpressionAnalysis|null;inspected:ExpressionFamily;confirmed:ExpressionFamily|null;revision:number;confirmationHistory:{family:ExpressionFamily;revision:number}[]}
export interface ExpressionState {status:'IN_PROGRESS'|'COMPLETE';participants:string[];active:string;finalists:Record<string,FinalistExpressionState>;readyForResult:boolean}
export type ExpressionAction={type:'START_EXPRESSION'}|{type:'SWITCH_EXPRESSION_FINALIST';ticker:string}|{type:'EXPRESSION_DRAFT';ticker:string;text:string}|{type:'EXPRESSION_REPLY';ticker:string;text:string}|{type:'EXPRESSION_INTENT';ticker:string;intent:ExpressionIntent}|{type:'INSPECT_EXPRESSION_FAMILY';ticker:string;family:ExpressionFamily}|{type:'CONFIRM_EXPRESSION';ticker:string}|{type:'READY_FOR_RESULT'};
export const expressionFamilies:ExpressionFamily[]=['STOCK','LONG_CALL','CALL_SPREAD'];
export const expressionIntents:ExpressionIntent[]=['UNSPECIFIED','OWNERSHIP','CONVEXITY','DEFINED_RISK'];
export const expressionComplete=(e:ExpressionState)=>e.participants.length>0&&e.participants.every(t=>!!e.finalists[t]?.confirmed);
