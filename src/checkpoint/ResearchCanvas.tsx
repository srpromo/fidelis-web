import type {ReactNode} from 'react';
export type ViewedStage = 'Thesis' | 'Discovery' | 'Wash 1' | 'Wash 2' | 'Wash 3';
export function ResearchHeader({locked, started, children}: {locked:boolean; started:boolean; children?:ReactNode}) {
 return <header className={`research-header ${locked?'compact':started?'conversing':''}`} aria-label={locked?'Research navigation':undefined}>
 <img className="canonical-logo" src={`${import.meta.env.BASE_URL}fidelis-logo.svg`} width="720" height="720" alt="Fidelis"/>
 {children}
 {!locked&&<button className="login" disabled title="Login is not available in this checkpoint">Log in</button>}
 </header>;
}
export function ProgressionRail({onNavigate,viewed,discoveryAvailable,discoveryComplete,washAvailable=false,washComplete=false,wash2Available=false,wash2Complete=false,wash3Available=false,wash3Complete=false}: {
 onNavigate:(stage:ViewedStage)=>void; viewed:ViewedStage; discoveryAvailable:boolean; discoveryComplete:boolean;washAvailable?:boolean;washComplete?:boolean;wash2Available?:boolean;wash2Complete?:boolean;wash3Available?:boolean;wash3Complete?:boolean;
}) {
 const labels=['Thesis','Discovery','Wash 1','Wash 2','Wash 3','Expression','Result'];
 const available=[true,discoveryAvailable,washAvailable,wash2Available,wash3Available,false,false];
 const completed=[true,discoveryComplete,washComplete,wash2Complete,wash3Complete,false,false];
 const current=wash3Available?4:wash2Available?3:washAvailable?2:1;
 return <nav className="progression-rail" aria-label="Research progression">{labels.map((label,i)=><div key={label} className={completed[i]?'completed':i===current?'current':'future'}>
 <button disabled={!available[i]} onClick={()=>onNavigate(label as ViewedStage)} aria-current={viewed===label?'location':undefined} aria-label={`${available[i]?'View saved':'Not yet available:'} ${label}`}>
 <span className="progress-circle" aria-hidden="true">{completed[i]?'✓':i===current?<i/>:null}</span><span>{label}</span></button></div>)}</nav>;
}
