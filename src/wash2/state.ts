import type {Wash1State} from '../wash1/model';
import type {Wash2State,Wash2Action} from './model';
import {wash2Count} from './model';
import {wash2Events,wash2Fixtures} from './fixtures';
export function startWash2(prior:Wash1State):Wash2State {
 const participants=prior.participants.filter(t=>prior.results[t].disposition==='ADVANCE'&&!prior.excluded.includes(t));
 return {status:'RUNNING',cursor:0,participants,prior:structuredClone(prior.results),results:{},excluded:[],decisions:[],readyForWash3:false};
}
export function reduceWash2(w:Wash2State,a:Wash2Action):Wash2State {
 if(a.type==='WASH2_EVENT'){
  if(w.status==='COMPLETE'||a.index!==w.cursor||!wash2Events[a.index])return w;
  const complete=wash2Events[a.index].type==='WASH_2_COMPLETE';
  return {...w,cursor:w.cursor+1,...(complete?{status:'COMPLETE' as const,results:Object.fromEntries(w.participants.map(t=>[t,structuredClone(wash2Fixtures[t])]))}:{})};
 }
 if(a.type==='CURATE_WASH2'&&w.status==='COMPLETE'&&w.participants.includes(a.ticker)){
  const excluded=w.excluded.includes(a.ticker);
  return {...w,readyForWash3:false,excluded:excluded?w.excluded.filter(t=>t!==a.ticker):[...w.excluded,a.ticker],decisions:[...w.decisions,{ticker:a.ticker,decision:excluded?'USER_REINCLUDED':'USER_EXCLUDED',ordinal:w.decisions.length+1}]};
 }
 if(a.type==='READY_FOR_WASH3'&&w.status==='COMPLETE'&&wash2Count(w)>0)return {...w,readyForWash3:true};
 return w;
}
