export function ResearchHeader({ locked, started }: {
    locked: boolean;
    started: boolean;
}) {
    return <header className={`research-header ${locked ? 'compact' : started ? 'conversing' : ''}`}>
    <img className="canonical-logo" src={`${import.meta.env.BASE_URL}fidelis-logo.svg`} width="720" height="720" alt="Fidelis"/>
    <button className="login" disabled title="Login is not available in this checkpoint">Log in</button>
    </header>;
}
export function ProgressionRail({ onThesis, expanded, discoveryComplete=false }: {
    onThesis: () => void;
    expanded: boolean;
    discoveryComplete?:boolean;
}) {
    return <nav className="progression-rail" aria-label="Research progression">{['Thesis', 'Discovery', 'Wash 1', 'Wash 2', 'Wash 3', 'Expression', 'Result'].map((label, i) => <div key={label} className={i === 0 || (i===1&&discoveryComplete) ? 'completed' : i === 1 ? 'current discovery-running' : i===2&&discoveryComplete?'current next-ready':'future'} aria-current={(discoveryComplete?i===2:i===1) ? 'step' : undefined}>{i === 0 ? <button onClick={onThesis} aria-expanded={expanded} aria-label="Review completed thesis">
            <span className="progress-circle">✓</span>
            <span>{label}</span>
            </button> : <>
            <span className="progress-circle">{i === 1 ? discoveryComplete?'✓':<i /> : i===2&&discoveryComplete?<i/>:null}</span>
            <span>{label}</span>
            </>}</div>)}</nav>;
}
