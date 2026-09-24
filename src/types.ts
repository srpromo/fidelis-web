export type ResearchStage = 'OBSERVATION' | 'COMPOSITION' | 'DISCOVERY' | 'WASH_1' | 'WASH_2' | 'WASH_3' | 'FINALISTS' | 'EXPRESSION' | 'OUTPUT';
export type Chronology = 0 | 1 | 2 | 3;
export type Confidence = 'High' | 'Moderate' | 'Low';
export type Provider = 'FIDELIS_DEFAULT' | 'OPENAI' | 'GEMINI' | 'CLAUDE' | 'GROK';
export interface ProviderMetadata {
    primaryProvider: Provider;
    challengeProvider?: Provider;
    mode: 'DETERMINISTIC_DEMO';
    runs?: ProviderRun[];
    comparison?: ModelDivergence;
}
export interface ProviderRun {
    provider: Provider;
    frozenEvidenceId: string;
    specialistContract: string;
    deterministicSnapshotId: string;
    resultId: string;
    reasoning: string;
    limitations: string[];
}
export interface ModelDivergence {
    runs: ProviderRun[];
    agreement: 'HIGH' | 'MODERATE' | 'MATERIAL_DIVERGENCE';
    explanation: string;
}
export interface AccessPolicy {
    policyVersion: string;
    authenticationBoundary: ResearchStage | 'DISABLED';
    entitlementBoundary: ResearchStage | 'DISABLED';
    experimentId?: string;
    cohortId?: string;
}
export type NextStageAccess = 'ALLOWED' | 'AUTHENTICATION_REQUIRED' | 'ENTITLEMENT_REQUIRED';
export interface UsageMetadata {
    providerCalls: number;
    stageDurations?: Partial<Record<ResearchStage, number>>;
    estimatedCost?: number;
}
export interface ThesisConversation {
    role: 'user' | 'fidelis';
    text: string;
    event: number;
}
export interface ThesisVersion {
    version: number;
    observation: string;
    mechanism: string;
    beneficiaries: string;
    pathways: string;
    exclusions: string;
    recognition: string;
    horizon: string;
    falsifiers: string;
    proposition: string;
}
export interface LockedThesis extends ThesisVersion {
    lockedAtEvent: number;
}
export interface StateMomentumConfidence {
    state: string;
    momentum: string;
    confidence: Confidence;
}
export interface EvidenceSummary {
    text: string;
    sourceType: string;
    limitation: string;
}
export interface InferenceSummary {
    text: string;
    confidence: Confidence;
}
export interface DecisionSummary {
    recommendation: CandidateDisposition;
    reason: string;
}
export type CandidateDisposition = 'ADVANCE' | 'HOLD' | 'REVIEW' | 'THESIS_FAILURE';
export interface SpecialistState extends StateMomentumConfidence {
    id: string;
    name: string;
    evidence: EvidenceSummary;
    inference: InferenceSummary;
}
export interface CausalPathway {
    id: string;
    label: string;
    mechanism: string;
    candidateIds: string[];
}
export interface TrajectoryPoint {
    t: Chronology;
    ops: number;
    rap: number;
    why: string;
    disposition: CandidateDisposition;
}
export interface AdversarialFinding {
    verdict: string;
    caseFor: string;
    caseAgainst: string;
    alternative: string;
    missing: string;
}
export interface Candidate {
    ticker: string;
    company: string;
    pathway: string;
    relationship: string;
    exposure: Confidence;
    evidenceConfidence: Confidence;
    recall?: boolean;
    points: TrajectoryPoint[];
    specialists: SpecialistState[];
    gap: string;
    volumeCycle: string;
    causalLinks: {
        label: string;
        state: string;
        explanation: string;
    }[];
    risk: {
        mechanism: string;
        likelihood: string;
        severity: string;
        horizon: string;
        mitigation: string;
        confidence: Confidence;
    };
    analogue: string;
    context: {
        macro: string;
        industry: string;
        dependency: string;
    };
    adversarial: AdversarialFinding;
    comparative: string;
    integrity: {
        authority: string;
        freshness: string;
        completeness: string;
        reproducibility: string;
    };
    principalRisk: string;
}
export interface CandidateResearchState {
    ticker: string;
    trajectory: TrajectoryPoint[];
    userExcluded: boolean;
    introducedAt: ResearchStage;
}
export interface WashState {
    stage: ResearchStage;
    participants: string[];
    analyzed: number;
    advance: number;
    held: number;
    failed: number;
    excluded: number;
    recallAdded: number;
    event: number;
}
export interface CurationEvent {
    ticker: string;
    decision: 'USER_EXCLUDED' | 'USER_RESTORED';
    stage: ResearchStage;
    event: number;
}
export interface Finalist {
    ticker: string;
    selected: boolean;
}
export interface ExpressionPreference {
    objective: string;
    horizon: string;
    path: string;
    risk: string;
    conviction: string;
}
export interface ExpressionAnalysis {
    ticker: string;
    structure: 'Common stock' | 'Long-duration call' | 'Call debit spread';
    rationale: string;
    inheritedRisks: string[];
    successConditions: string[];
}
export interface ThesisSupportState {
    label: string;
    calibrated: false;
    contributors: {
        label: string;
        state: string;
    }[];
    evidenceConfidence: Confidence;
}
export interface CaseFor {
    points: string[];
}
export interface CaseAgainst {
    points: string[];
    changeConditions: string[];
}
export interface Provenance {
    fixtureVersion: string;
    evidenceId: string;
    mode: 'DEMONSTRATION';
    source: 'SANITIZED_FIXTURE';
    liveData: false;
}
export interface ResearchException {
    ticker?: string;
    reason: string;
    stage: ResearchStage;
}
export interface ResearchRun {
    runId: string;
    sessionId: string;
    createdAt: string;
    mode: 'DEMONSTRATION';
    stage: ResearchStage;
    owner: {
        kind: 'anonymous';
    } | {
        kind: 'account';
        id: string;
    };
    policy: AccessPolicy;
    provider: ProviderMetadata;
    usage: UsageMetadata;
    provenance: Provenance;
    event: number;
    conversation: ThesisConversation[];
    drafts: ThesisVersion[];
    lockedThesis: LockedThesis | null;
    universe: Record<string, CandidateResearchState>;
    exclusions: CurationEvent[];
    washes: WashState[];
    finalists: Finalist[];
    preferences: ExpressionPreference;
    expressions: ExpressionAnalysis[];
    support: ThesisSupportState | null;
    caseFor: CaseFor | null;
    caseAgainst: CaseAgainst | null;
    exceptions: ResearchException[];
    pending: ResearchStage | null;
}
