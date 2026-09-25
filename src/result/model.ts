import type {Confidence,TrajectoryPoint} from '../types';
import type {ExpressionFamily,ExpressionComparison} from '../expression/model';
export type ResultOrigin='Discovery'|'Wash 1'|'Wash 2'|'Wash 3'|'Expression';
export interface ResultFinding {title:string;origin:ResultOrigin;text:string;evidence?:string;inference?:string}
export interface CompletedResearchResult {
 ticker:string;company:string;thesis:string;horizon:string;support:'STRONG SUPPORT'|'FAVORABLE WITH CONDITIONS';confidence:Confidence;conclusion:string;challenge:string;direction:string;timing:string;durability:string;
 findings:ResultFinding[];caseFor:ResultFinding[];caseAgainst:ResultFinding[];contradictions:string[];
 journey:{stage:ResultOrigin;text:string}[];trajectory:TrajectoryPoint[];
 failurePath:{from:string;to:string;condition:string;consequence:string;indicator:string}[];failureConditions:string[];
 changes:{kind:'STRENGTHEN'|'WEAKEN'|'REVIEW'|'INVALIDATE';condition:string;origin:ResultOrigin}[];
 expression:{family:ExpressionFamily;choice:ExpressionComparison;alternative:ExpressionFamily;alternativeWhy:string;inheritedRisks:string[];preferred:boolean};
 integrity:{authority:Confidence;missing:string;limitation:string;supporting:string;conflicting:string};
 lineage:{runId:string;prior:string;fixtureVersion:'alpha-003-result-v1';source:'SANITIZED_FIXTURE';liveData:false};
}
export interface ResultState {status:'RESEARCH_COMPLETE';participants:string[];active:string;outputs:Record<string,CompletedResearchResult>;inspected:Record<string,0|1|2|3>}
export type ResultAction={type:'SWITCH_RESULT_FINALIST';ticker:string}|{type:'INSPECT_RESULT_TRANSITION';ticker:string;t:0|1|2|3};
