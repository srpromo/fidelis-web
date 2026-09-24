import type {ReactNode} from 'react';
export type ViewedStage = 'Thesis' | 'Discovery';
export function ResearchHeader({locked, started, children}: {locked:boolean; started:boolean; children?:ReactNode}) {
 return <header className={`research-header ${locked?'compact':started?'conversing':''}`} aria-label={locked?'Research navigation':undefined}>
 <img className="canonical-logo" src={`${import.meta.env.BASE_URL}fidelis-logo.svg`} width="720" height="720" alt="Fidelis"/>
 {children}
 {!locked&&<button className="login" disabled title="Login is not available in this checkpoint">Log in</button>}
 </header>;
}
export function ProgressionRail({onNavigate,viewed,discoveryAvailable,discoveryComplete}: {
 onNavigate:(stage:ViewedStage)=>void; viewed:ViewedStage; discoveryAvailable:boolean; discoveryComplete:boolean;
}) {
 return <nav className="progression-rail" aria-label="Research progression">{['Thesis','Discovery','Wash 1','Wash 2','Wash 3','Expression','Result'].map((label,i)=>
 <div key={label} className={i===0||i===1&&discoveryComplete?'completed':i===1?'current':'future'}>
 <button disabled={i>1||i===1&&!discoveryAvailable} onClick={()=>onNavigate(label as ViewedStage)} aria-current={viewed===label?'location':undefined} aria-label={`${i>1?'Not yet available:':'View saved'} ${label}`}>
 <span className="progress-circle" aria-hidden="true">{i===0||i===1&&discoveryComplete?'✓':i===1?<i/>:null}</span><span>{label}</span>
 </button></div>)}</nav>;
}
