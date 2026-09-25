import type {CheckpointRun} from '../checkpoint/research';
import type {CompletedResearchResult,ResultFinding,ResultState} from './model';
import {expressionComplete} from '../expression/model';
import {selectedFinalists,finalistEligible} from '../wash3/model';
// A public demonstration synthesis of saved findings, never a research or scoring pass.
export function completeResult(run:CheckpointRun):ResultState|null {
 const e=run.expression,w=run.wash3;
 if(!e||e.status!=='COMPLETE'||!expressionComplete(e)||!w||w.status!=='COMPLETE'||!run.lockedThesis)return null;
 const selected=selectedFinalists(w);
 if(selected.length!==e.participants.length||e.participants.some(t=>!selected.includes(t)||!run.finalists.some(f=>f.ticker===t&&f.selected)||run.universe[t]?.userExcluded))return null;
 if(e.participants.some(t=>{const f=e.finalists[t];return !f?.analysis||!f.confirmed||!finalistEligible(f.context.t3)||!f.analysis.comparisons.some(x=>x.family===f.confirmed)||run.universe[t].trajectory.map(p=>p.t).join()!=='0,1,2,3'}))return null;
 const outputs=Object.fromEntries(e.participants.map(t=>{
  const f=e.finalists[t],a=f.analysis!,c=f.context,{t1,t2,t3}=c;
  const choice=a.comparisons.find(x=>x.family===f.confirmed)!;
  const alternative=f.confirmed===a.preferred?a.alternative:a.preferred;
  const alt=a.comparisons.find(x=>x.family===alternative)!;
  const support=t3.verdict==='CHALLENGE LARGELY ABSORBED'&&t2.survival==='STRONG'?'STRONG SUPPORT':'FAVORABLE WITH CONDITIONS';
  const finding=(title:string,origin:ResultFinding['origin'],text:string):ResultFinding=>({title,origin,text});
  const output:CompletedResearchResult={ticker:t,company:c.company,thesis:c.thesis,horizon:c.horizon,support,confidence:t3.integrity.confidence,
   conclusion:`${t3.comparative.conclusion} ${t3.weakened}`,challenge:t3.unresolved,direction:t3.timing.direction,timing:t3.timing.state,durability:t2.survival,
   findings:[{...finding('Economic transmission','Wash 1',t1.dm.inference),evidence:t1.dm.evidence,inference:t1.gapExplanation},finding('Causal durability','Wash 2',t2.reason),finding('What survived challenge','Wash 3',t3.survived)],
   caseFor:[...t3.caseFor.map((text,i)=>finding(i===0?'Surviving causal evidence':'Economic support','Wash 3',text)),finding('Comparative strength','Wash 3',t3.comparative.strength)],
   caseAgainst:[...t3.caseAgainst.map((text,i)=>finding(i===0?'Shared exposure':'Expectations and recognition','Wash 3',text)),finding('Alternative explanation','Wash 3',t3.alternative.alternative),finding('Principal fragility','Wash 2',t2.fragilities[0].effect)],
   contradictions:[...t1.contradictions,...t2.contradictions,t3.integrity.conflicts.conflicting,t3.comparative.disagreement],
   journey:[{stage:'Discovery',text:run.wash1!.discovery[t].candidate.relationship},...c.trajectory.filter(p=>p.t>0).map(p=>({stage:('Wash '+p.t) as 'Wash 1'|'Wash 2'|'Wash 3',text:p.why})),{stage:'Expression',text:choice.fits.join(' ')}],trajectory:c.trajectory,
   failurePath:t2.chain.map(link=>({from:link.from,to:link.to,condition:link.weakness,consequence:`Transmission to ${link.to.toLowerCase()} is at risk. ${link.lag}`,indicator:link.evidence})),failureConditions:t2.failureConditions,
   changes:[{kind:'STRENGTHEN',condition:t3.alternative.distinguish,origin:'Wash 3'},{kind:'WEAKEN',condition:t2.fragilities[0].effect,origin:'Wash 2'},{kind:'REVIEW',condition:`Resolve the missing evidence: ${t3.integrity.missing}. Reassess ${t3.unresolved.charAt(0).toLowerCase()+t3.unresolved.slice(1)}`,origin:'Wash 3'},...t2.failureConditions.map(condition=>({kind:'INVALIDATE' as const,condition,origin:'Wash 2' as const}))],
   expression:{family:f.confirmed!,choice,alternative,alternativeWhy:alt.fits[2],inheritedRisks:a.inheritedRisks,preferred:f.confirmed===a.preferred},
   integrity:{authority:t3.integrity.authority,missing:t3.integrity.missing,limitation:t3.integrity.limitation,...t3.integrity.conflicts},
   lineage:{runId:run.runId,prior:c.lineage.fixtureVersion,fixtureVersion:'alpha-003-result-v1',source:'SANITIZED_FIXTURE',liveData:false}};
  return [t,structuredClone(output)];
 }));
 return {status:'RESEARCH_COMPLETE',participants:[...e.participants],active:e.active,outputs,inspected:Object.fromEntries(e.participants.map(t=>[t,3 as const]))};
}
