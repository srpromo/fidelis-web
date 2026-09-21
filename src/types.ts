export type ResearchStage = {
  id: string;
  label: string;
  count: number;
  description: string;
};
export type EvidenceSummary = {
  strength: number;
  summary: string;
  sourceTypes: string[];
};
export type InferenceSummary = { relevance: number; rationale: string };
export type DecisionSummary = {
  eligibility: "Eligible" | "Review";
  rank: number;
  liquidity: string;
  disposition: "Finalist" | "Watchlist" | "Review";
};
export type Provenance = {
  mode: "Demonstration";
  evidence: string;
  providerCalls: 0;
  governance: string;
};
export type Candidate = {
  ticker: string;
  company: string;
  domain: string;
  evidence: EvidenceSummary;
  inference: InferenceSummary;
  decision: DecisionSummary;
  limitations: string;
};
export type ResearchException = {
  ticker: string;
  reason: string;
  consequence: string;
};
export type ResearchRun = {
  id: string;
  thesis: string;
  status: "Ready" | "Running" | "Complete";
  stages: ResearchStage[];
  candidates: Candidate[];
  exceptions: ResearchException[];
  provenance: Provenance;
};
