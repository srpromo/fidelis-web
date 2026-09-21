import type { Candidate, ResearchRun } from "../types";
export const demoThesis =
  "AI infrastructure spending will create sustained demand for semiconductor manufacturing capacity.";
const rows = [
  [
    "AMAT",
    "Applied Materials",
    "Semiconductor equipment",
    94,
    93,
    "Finalist",
    "Direct exposure to the tools used to expand manufacturing capacity.",
    "Capacity expansion does not imply immediate equipment orders.",
  ],
  [
    "KLAC",
    "KLA Corporation",
    "Process control & metrology",
    91,
    95,
    "Finalist",
    "Manufacturing complexity creates a plausible need for inspection and process control.",
    "Demand varies with process mix and customer investment cycles.",
  ],
  [
    "LRCX",
    "Lam Research",
    "Semiconductor equipment",
    89,
    92,
    "Finalist",
    "Deposition and etch tools are relevant to semiconductor fabrication investment.",
    "Customer concentration and capital intensity remain relevant.",
  ],
  [
    "ONTO",
    "Onto Innovation",
    "Process control & metrology",
    84,
    85,
    "Finalist",
    "Metrology and advanced packaging offer a plausible connection to capacity investment.",
    "Exposure is narrower and execution assumptions need verification.",
  ],
  [
    "NVDA",
    "NVIDIA",
    "Integrated devices",
    82,
    88,
    "Watchlist",
    "Compute demand is related to the thesis, with an indirect manufacturing-capacity link.",
    "Strong thematic relevance is not the same as direct equipment exposure.",
  ],
  [
    "AMD",
    "Advanced Micro Devices",
    "Semiconductor design",
    77,
    86,
    "Watchlist",
    "Compute products create an indirect link to semiconductor capacity demand.",
    "Product competition and foundry dependence are not modeled.",
  ],
  [
    "TER",
    "Teradyne",
    "Test & handling",
    73,
    84,
    "Watchlist",
    "Higher device complexity can increase the need for semiconductor testing.",
    "Test demand need not move in step with wafer capacity.",
  ],
  [
    "TXN",
    "Texas Instruments",
    "Integrated devices",
    62,
    81,
    "Review",
    "Manufacturing investment is relevant; the AI demand connection requires review.",
    "Broad analog exposure makes thesis attribution uncertain.",
  ],
] as const;
export const candidates: Candidate[] = rows.map(
  (
    [
      ticker,
      company,
      domain,
      relevance,
      strength,
      disposition,
      rationale,
      limitations,
    ],
    i,
  ) => ({
    ticker,
    company,
    domain,
    evidence: {
      strength,
      summary:
        "Illustrative business-profile summary representing the type of evidence a future bounded review would inspect. No live filing has been retrieved for this run.",
      sourceTypes: [
        "Annual business descriptions",
        "Issuer product disclosures",
      ],
    },
    inference: { relevance, rationale },
    decision: {
      eligibility: disposition === "Review" ? "Review" : "Eligible",
      rank: i + 1,
      liquidity: i < 3 ? "Tier A" : "Tier B",
      disposition,
    },
    limitations,
  }),
);
export function createDemoRun(thesis: string): ResearchRun {
  return {
    id: "FID-DEMO-001",
    thesis,
    status: "Ready",
    candidates,
    stages: [
      {
        id: "thesis",
        label: "Thesis",
        count: 128,
        description: "Frame the relationship to be tested.",
      },
      {
        id: "discovery",
        label: "Discovery",
        count: 128,
        description: "Identify plausible securities across the value chain.",
      },
      {
        id: "verification",
        label: "Verification",
        count: 42,
        description:
          "Separate plausible relevance from unsupported association.",
      },
      {
        id: "eligibility",
        label: "Eligibility",
        count: 18,
        description: "Apply the demonstration eligibility checks.",
      },
      {
        id: "ranking",
        label: "Ranking",
        count: 8,
        description: "Compare evidence, relevance and practical constraints.",
      },
      {
        id: "analysis",
        label: "Analysis",
        count: 4,
        description: "Inspect the shortlist and retain explicit uncertainty.",
      },
      {
        id: "results",
        label: "Results",
        count: 4,
        description:
          "Four illustrative finalists. The decision remains inspectable.",
      },
    ],
    exceptions: [
      {
        ticker: "TXN",
        reason: "Thesis attribution uncertain",
        consequence: "Retained for review; excluded from demo finalists.",
      },
      {
        ticker: "Run-wide",
        reason: "Simulated research metrics",
        consequence:
          "No valuation, current liquidity, eligibility or investment suitability is established.",
      },
    ],
    provenance: {
      mode: "Demonstration",
      evidence: "Sanitized fixture",
      providerCalls: 0,
      governance: "Reproducible demo",
    },
  };
}
