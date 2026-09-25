import type {CheckpointRun} from '../checkpoint/research';
import {selectedFinalists,finalistEligible} from '../wash3/model';
import {expressionFamilies,expressionIntents,expressionComplete,type ExpressionState,type ExpressionAction,type ExpressionContext} from './model';
import {buildExpression,readDemoIntent,openingQuestion,intentNames} from './fixtures';
export function startExpression(run:CheckpointRun):ExpressionState|null {
 const w=run.wash3;if(w?.status!=='COMPLETE'||!run.lockedThesis||!run.wash1||!run.wash2)return null;
 const participants=selectedFinalists(w);
 if(!participants.length||participants.length!==w.selected.length||participants.some(t=>!run.finalists.some(f=>f.ticker===t&&f.selected)||!finalistEligible(w.results[t])||run.universe[t]?.userExcluded))return null;
 return {status:'IN_PROGRESS',participants:[...participants],active:participants[0],readyForResult:false,finalists:Object.fromEntries(participants.map(t=>{
  const context:ExpressionContext=structuredClone({ticker:t,company:run.wash1!.discovery[t].candidate.company,horizon:run.lockedThesis!.horizon,thesis:run.lockedThesis!.proposition,t1:run.wash1!.results[t],t2:run.wash2!.results[t],t3:w.results[t],trajectory:run.universe[t].trajectory,lineage:{runId:run.runId,source:'SANITIZED_FIXTURE',prior:'WASH_3_T3',fixtureVersion:'alpha-003-expression-v1',liveData:false}});
  return [t,{context,draft:'',conversation:[{role:'fidelis',text:openingQuestion(context)}],analysis:null,inspected:'STOCK',confirmed:null,revision:0,confirmationHistory:[]}];
 }))};
}
export function reduceExpression(e:ExpressionState,a:ExpressionAction):ExpressionState {
 if(a.type==='READY_FOR_RESULT')return expressionComplete(e)?{...e,readyForResult:true}:e;
 if(!('ticker' in a)||!e.participants.includes(a.ticker))return e;
 if(a.type==='SWITCH_EXPRESSION_FINALIST')return a.ticker===e.active?e:{...e,active:a.ticker};
 const f=e.finalists[a.ticker];let next=f;
 if(a.type==='EXPRESSION_DRAFT')next={...f,draft:a.text};
 if(a.type==='EXPRESSION_REPLY'&&a.text.trim()){
  const intent=readDemoIntent(a.text);const explicitHorizon=a.text.match(/\bhorizon\s*(?:of|:|=)?\s*(\d+(?:\s*[–-]\s*\d+)?\s*(?:months?|years?))\b/i)?.[1];
  const analysis=buildExpression(f.context,intent,explicitHorizon??f.analysis?.objective.horizon??f.context.horizon);
  next={...f,draft:'',analysis,inspected:analysis.preferred,confirmed:null,revision:f.revision+1,conversation:[...f.conversation,{role:'user',text:a.text.trim()},{role:'fidelis',text:`My local demo reading is “${intentNames[intent]}.” You can correct it below. I’ll compare the three families against ${analysis.objective.horizon}, ${f.context.t3.timing.state.toLowerCase()} timing and the risks already preserved in your research.`}]};
 }
 if(a.type==='EXPRESSION_INTENT'&&f.analysis&&expressionIntents.includes(a.intent)){
  const analysis=buildExpression(f.context,a.intent,f.analysis.objective.horizon);
  next={...f,analysis,inspected:analysis.preferred,confirmed:null,revision:f.revision+1};
 }
 if(a.type==='INSPECT_EXPRESSION_FAMILY'&&f.analysis&&expressionFamilies.includes(a.family))next={...f,inspected:a.family};
 if(a.type==='CONFIRM_EXPRESSION'&&f.analysis&&finalistEligible(f.context.t3)&&expressionFamilies.includes(f.inspected))next={...f,confirmed:f.inspected,confirmationHistory:[...f.confirmationHistory,{family:f.inspected,revision:f.revision}]};
 if(next===f)return e;
 const changed=a.type==='EXPRESSION_REPLY'||a.type==='EXPRESSION_INTENT'||a.type==='CONFIRM_EXPRESSION';
 const result={...e,finalists:{...e.finalists,[a.ticker]:next},readyForResult:changed?false:e.readyForResult};
 return {...result,status:expressionComplete(result)?'COMPLETE':'IN_PROGRESS'};
}
