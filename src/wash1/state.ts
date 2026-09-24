import type {DiscoveryResult} from '../discovery/model';
import type {Wash1State,Wash1Action} from './model';
import {wash1Count} from './model';
import {wash1Events,wash1Fixtures} from './fixtures';
export function startWash1(d:DiscoveryResult):Wash1State {
 const participants=Object.values(d.candidates).filter(c=>c.validation==='VALIDATED'&&c.userState==='RETAINED').map(c=>c.candidate.ticker);
 return {status:'RUNNING',cursor:0,participants,discovery:structuredClone(d.candidates),economicFrozen:false,marketFrozen:false,comparisonComplete:false,results:{},excluded:[],decisions:[],readyForWash2:false};
}
export function reduceWash1(w:Wash1State,a:Wash1Action):Wash1State {
 if(a.type==='WASH1_EVENT'){
  if(w.status==='COMPLETE'||a.index!==w.cursor||!wash1Events[a.index])return w;
  const type=wash1Events[a.index].type;
  if(type==='REALITY_RECOGNITION_COMPARISON_STARTED'&&(!w.economicFrozen||!w.marketFrozen))return w;
  if(type==='WASH_1_COMPLETE'&&!w.comparisonComplete)return w;
  return {...w,cursor:w.cursor+1,economicFrozen:w.economicFrozen||type==='ECONOMIC_REALITY_FROZEN',marketFrozen:w.marketFrozen||type==='MARKET_STATE_FROZEN',comparisonComplete:w.comparisonComplete||type==='REALITY_RECOGNITION_COMPARISON_COMPLETE',...(type==='WASH_1_COMPLETE'?{status:'COMPLETE' as const,results:Object.fromEntries(w.participants.map(t=>[t,structuredClone(wash1Fixtures[t])]))}:{})};
 }
 if(a.type==='CURATE_WASH1'&&w.status==='COMPLETE'&&w.participants.includes(a.ticker)){
  const excluded=w.excluded.includes(a.ticker);return {...w,readyForWash2:false,excluded:excluded?w.excluded.filter(t=>t!==a.ticker):[...w.excluded,a.ticker],decisions:[...w.decisions,{ticker:a.ticker,decision:excluded?'USER_REINCLUDED':'USER_EXCLUDED',ordinal:w.decisions.length+1}]};
 }
 if(a.type==='READY_FOR_WASH2'&&w.status==='COMPLETE'&&wash1Count(w)>0)return {...w,readyForWash2:true};
 return w;
}
