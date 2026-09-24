import type {Wash2State} from '../wash2/model';
import type {Wash3State,Wash3Action} from './model';
import {finalistEligible,selectedFinalists} from './model';
import {wash3Events,wash3Fixtures} from './fixtures';
export function startWash3(prior:Wash2State):Wash3State {
 const participants=prior.participants.filter(t=>prior.results[t]?.disposition==='ADVANCE'&&!prior.excluded.includes(t));
 return {status:'RUNNING',cursor:0,participants,prior:structuredClone(prior),results:{},selected:[],excluded:[],decisions:[],finalistsSaved:false};
}
export function reduceWash3(w:Wash3State,a:Wash3Action):Wash3State {
 if(a.type==='WASH3_EVENT'){
  if(w.status==='COMPLETE'||a.index!==w.cursor||!wash3Events[a.index])return w;
  const complete=wash3Events[a.index].type==='WASH_3_COMPLETE';
  return {...w,cursor:w.cursor+1,...(complete?{status:'COMPLETE' as const,results:Object.fromEntries(w.participants.map(t=>[t,structuredClone(wash3Fixtures[t])]))}:{})};
 }
 if(w.status!=='COMPLETE')return w;
 if(a.type==='SELECT_FINALIST'&&w.participants.includes(a.ticker)&&!w.excluded.includes(a.ticker)&&finalistEligible(w.results[a.ticker])){
  const selected=w.selected.includes(a.ticker);
  return {...w,selected:selected?w.selected.filter(t=>t!==a.ticker):[...w.selected,a.ticker],finalistsSaved:false,decisions:[...w.decisions,{ticker:a.ticker,decision:selected?'DESELECTED':'SELECTED',ordinal:w.decisions.length+1}]};
 }
 if(a.type==='CURATE_WASH3'&&w.participants.includes(a.ticker)){
  const excluded=w.excluded.includes(a.ticker);
  return {...w,excluded:excluded?w.excluded.filter(t=>t!==a.ticker):[...w.excluded,a.ticker],selected:w.selected.filter(t=>t!==a.ticker),finalistsSaved:false,decisions:[...w.decisions,{ticker:a.ticker,decision:excluded?'USER_REINCLUDED':'USER_EXCLUDED',ordinal:w.decisions.length+1}]};
 }
 if(a.type==='SAVE_FINALISTS'&&selectedFinalists(w).length)return {...w,finalistsSaved:true};
 return w;
}
