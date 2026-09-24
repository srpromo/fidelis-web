import type {CandidateT2State,Wash2EventType} from './model';
import type {ResearchActivityEvent} from '../discovery/model';
// Invented normalized demonstration outputs only. No live company claims or private calculations.
export const wash2Fixtures:Record<string,CandidateT2State>={
  "NVDA": {
    "ticker": "NVDA",
    "ct": {
      "state": "Strong",
      "momentum": "Stable",
      "confidence": "Moderate"
    },
    "chain": [
      {
        "to": "Data-center buildout",
        "state": "Strong",
        "confidence": "High",
        "evidence": "The illustrative case links ai infrastructure capex to a requirement for data-center buildout.",
        "reason": "The fixture establishes a direct requirement, conditional on the next link executing.",
        "weakness": "A pause in the upstream investment can delay downstream realization.",
        "lag": "Sequential project timing; no calibrated lag estimate.",
        "from": "AI infrastructure capex"
      },
      {
        "to": "Accelerated compute",
        "state": "Strong",
        "confidence": "High",
        "evidence": "The illustrative case links data-center buildout to a requirement for accelerated compute.",
        "reason": "Accelerated compute has an economic transmission path; narrative association alone would not establish orders or capture.",
        "weakness": "A pause in the upstream investment can delay downstream realization.",
        "lag": "Sequential project timing; no calibrated lag estimate.",
        "from": "Data-center buildout"
      },
      {
        "to": "Processor systems orders",
        "state": "Strong",
        "confidence": "Moderate",
        "evidence": "The fixture concentrates processor orders in a small customer group with internal design capability.",
        "reason": "Strong causal exposure survives, but concentrated architectures and valuation duration require review.",
        "weakness": "A small customer group can redirect compute spending toward internally designed systems.",
        "lag": "Architecture changes may affect orders over several deployment cycles.",
        "from": "Accelerated compute"
      },
      {
        "to": "Company revenue",
        "state": "Strong",
        "confidence": "High",
        "evidence": "The illustrative case links processor systems orders to a requirement for company revenue.",
        "reason": "The fixture establishes a direct requirement, conditional on the next link executing.",
        "weakness": "A pause in the upstream investment can delay downstream realization.",
        "lag": "Sequential project timing; no calibrated lag estimate.",
        "from": "Processor systems orders"
      },
      {
        "to": "Margin / cash-flow capture",
        "state": "Strong",
        "confidence": "Moderate",
        "evidence": "The fixture concentrates processor orders in a small customer group with internal design capability.",
        "reason": "Strong causal exposure survives, but concentrated architectures and valuation duration require review.",
        "weakness": "A small customer group can redirect compute spending toward internally designed systems.",
        "lag": "Architecture changes may affect orders over several deployment cycles.",
        "from": "Company revenue"
      }
    ],
    "fragilities": [
      {
        "mechanism": "Customer architecture concentration",
        "category": "Customer / technology",
        "likelihood": "Existing condition in fixture",
        "severity": "High if architecture shifts",
        "horizon": "Medium term",
        "mitigability": "Partial through broader adoption",
        "confidence": "Moderate",
        "effect": "A small customer group can redirect compute spending toward internally designed systems."
      }
    ],
    "failureConditions": [
      "Major customers shift architecture before the expected cash-flow duration is realized."
    ],
    "br": {
      "support": "Limited",
      "analogue": "Prior infrastructure capacity-investment cycles",
      "similarity": "Demand for accelerated compute must convert through orders and execution into cash.",
      "difference": "AI customer concentration, technology cadence and valuation duration differ from prior cycles.",
      "confidence": "Low",
      "limitation": "Conceptual analogue only. No historical sample, measured base rate or calibrated probability is supplied."
    },
    "context": {
      "scope": "BROADER_ARCHITECTURE_DEMO",
      "macro": [
        {
          "factor": "Real yields",
          "state": "Adverse",
          "explanation": "Long-duration expectations amplify discount-rate sensitivity without disproving processor demand."
        }
      ],
      "industry": {
        "state": "Expanding",
        "layer": "Accelerated compute",
        "explanation": "The demonstration accelerated compute neighborhood is expanding; this describes commercial conditions, not trading volume or price volatility.",
        "valueAccrual": "Value accrues to scarce compute platforms, but buyer bargaining power can grow with scale."
      },
      "dependencies": [
        "Hyperscaler capex",
        "Customer architecture",
        "Advanced manufacturing capacity"
      ]
    },
    "survival": "SURVIVES WITH CONDITIONS",
    "disposition": "REVIEW",
    "reason": "Strong causal exposure survives, but concentrated architectures and valuation duration require review.",
    "contradictions": [
      "Strong Wash-1 economics coexist with concentrated customers and demanding duration expectations."
    ],
    "t2": {
      "t": 2,
      "ops": 80,
      "rap": 54,
      "why": "Opportunity remains stable because compute demand still transmits. RAP falls as customer architecture concentration and real-yield sensitivity create linked fragility.",
      "disposition": "REVIEW"
    }
  },
  "ANET": {
    "ticker": "ANET",
    "ct": {
      "state": "Strong",
      "momentum": "Improving",
      "confidence": "Moderate"
    },
    "chain": [
      {
        "to": "Data-center buildout",
        "state": "Strong",
        "confidence": "High",
        "evidence": "The illustrative case links ai infrastructure capex to a requirement for data-center buildout.",
        "reason": "The fixture establishes a direct requirement, conditional on the next link executing.",
        "weakness": "A pause in the upstream investment can delay downstream realization.",
        "lag": "Sequential project timing; no calibrated lag estimate.",
        "from": "AI infrastructure capex"
      },
      {
        "to": "Cluster networking",
        "state": "Strong",
        "confidence": "High",
        "evidence": "The illustrative case links data-center buildout to a requirement for cluster networking.",
        "reason": "Cluster networking has an economic transmission path; narrative association alone would not establish orders or capture.",
        "weakness": "A pause in the upstream investment can delay downstream realization.",
        "lag": "Sequential project timing; no calibrated lag estimate.",
        "from": "Data-center buildout"
      },
      {
        "to": "Network deployment orders",
        "state": "Strong",
        "confidence": "Moderate",
        "evidence": "The fixture has repeat network deployments with concentrated but staggered customer schedules.",
        "reason": "Transmission remains strong, with repeat deployments providing a more durable path than a single project.",
        "weakness": "Concentrated deployment schedules can delay otherwise credible networking demand.",
        "lag": "Orders may lag announced buildouts by multiple quarters.",
        "from": "Cluster networking"
      },
      {
        "to": "Company revenue",
        "state": "Strong",
        "confidence": "High",
        "evidence": "The illustrative case links network deployment orders to a requirement for company revenue.",
        "reason": "The fixture establishes a direct requirement, conditional on the next link executing.",
        "weakness": "A pause in the upstream investment can delay downstream realization.",
        "lag": "Sequential project timing; no calibrated lag estimate.",
        "from": "Network deployment orders"
      },
      {
        "to": "Margin / cash-flow capture",
        "state": "Strong",
        "confidence": "Moderate",
        "evidence": "The fixture has repeat network deployments with concentrated but staggered customer schedules.",
        "reason": "Transmission remains strong, with repeat deployments providing a more durable path than a single project.",
        "weakness": "Concentrated deployment schedules can delay otherwise credible networking demand.",
        "lag": "Orders may lag announced buildouts by multiple quarters.",
        "from": "Company revenue"
      }
    ],
    "fragilities": [
      {
        "mechanism": "Deployment cadence",
        "category": "Demand / customer",
        "likelihood": "Plausible delay",
        "severity": "Moderate",
        "horizon": "Next deployment cycle",
        "mitigability": "Phased delivery and varied deployments",
        "confidence": "Moderate",
        "effect": "Concentrated deployment schedules can delay otherwise credible networking demand."
      }
    ],
    "failureConditions": [
      "Cluster construction pauses long enough that repeat deployment orders no longer convert into cash."
    ],
    "br": {
      "support": "Limited",
      "analogue": "Prior infrastructure capacity-investment cycles",
      "similarity": "Demand for cluster networking must convert through orders and execution into cash.",
      "difference": "AI customer concentration, technology cadence and valuation duration differ from prior cycles.",
      "confidence": "Low",
      "limitation": "Conceptual analogue only. No historical sample, measured base rate or calibrated probability is supplied."
    },
    "context": {
      "scope": "BROADER_ARCHITECTURE_DEMO",
      "macro": [
        {
          "factor": "Customer financing conditions",
          "state": "Mixed",
          "explanation": "Well-funded buyers support execution, but tighter financing can defer marginal projects."
        }
      ],
      "industry": {
        "state": "Expanding",
        "layer": "Cluster networking",
        "explanation": "The demonstration cluster networking neighborhood is expanding; this describes commercial conditions, not trading volume or price volatility.",
        "valueAccrual": "Connectivity density supports differentiated switching; not every network supplier captures equal value."
      },
      "dependencies": [
        "Hyperscaler capex",
        "Network architecture"
      ]
    },
    "survival": "STRONG",
    "disposition": "ADVANCE",
    "reason": "Transmission remains strong, with repeat deployments providing a more durable path than a single project.",
    "contradictions": [
      "Strong causal transmission has only limited historical-analogue support for the present scale of AI deployment."
    ],
    "t2": {
      "t": 2,
      "ops": 80,
      "rap": 76,
      "why": "OPS edges higher as repeat networking deployments preserve exposure. RAP improves because the fixture resolves some deployment uncertainty while retaining customer concentration risk.",
      "disposition": "ADVANCE"
    }
  },
  "VRT": {
    "ticker": "VRT",
    "ct": {
      "state": "Moderate",
      "momentum": "Stable",
      "confidence": "Moderate"
    },
    "chain": [
      {
        "to": "Data-center buildout",
        "state": "Strong",
        "confidence": "High",
        "evidence": "The illustrative case links ai infrastructure capex to a requirement for data-center buildout.",
        "reason": "The fixture establishes a direct requirement, conditional on the next link executing.",
        "weakness": "A pause in the upstream investment can delay downstream realization.",
        "lag": "Sequential project timing; no calibrated lag estimate.",
        "from": "AI infrastructure capex"
      },
      {
        "to": "Thermal management",
        "state": "Strong",
        "confidence": "High",
        "evidence": "The illustrative case links data-center buildout to a requirement for thermal management.",
        "reason": "Thermal management has an economic transmission path; narrative association alone would not establish orders or capture.",
        "weakness": "A pause in the upstream investment can delay downstream realization.",
        "lag": "Sequential project timing; no calibrated lag estimate.",
        "from": "Data-center buildout"
      },
      {
        "to": "Cooling installation orders",
        "state": "Moderate",
        "confidence": "Moderate",
        "evidence": "The fixture shows thermal backlog growing faster than qualified installation capacity.",
        "reason": "Thermal demand is causal, but capacity and commissioning remain conditions on capture.",
        "weakness": "Demand can outpace qualified installation capacity even when customer spending remains intact.",
        "lag": "Installation and commissioning can delay revenue and cash by several quarters.",
        "from": "Thermal management"
      },
      {
        "to": "Company revenue",
        "state": "Moderate",
        "confidence": "Moderate",
        "evidence": "The fixture shows thermal backlog growing faster than qualified installation capacity.",
        "reason": "Project awards require executable installation work before revenue can be realized.",
        "weakness": "Demand can outpace qualified installation capacity even when customer spending remains intact.",
        "lag": "Installation and commissioning can delay revenue and cash by several quarters.",
        "from": "Cooling installation orders"
      },
      {
        "to": "Margin / cash-flow capture",
        "state": "Moderate",
        "confidence": "Moderate",
        "evidence": "The fixture shows thermal backlog growing faster than qualified installation capacity.",
        "reason": "Thermal demand is causal, but capacity and commissioning remain conditions on capture.",
        "weakness": "Demand can outpace qualified installation capacity even when customer spending remains intact.",
        "lag": "Installation and commissioning can delay revenue and cash by several quarters.",
        "from": "Company revenue"
      }
    ],
    "fragilities": [
      {
        "mechanism": "Installation capacity",
        "category": "Execution",
        "likelihood": "Binding in the illustrative expansion case",
        "severity": "High if persistent",
        "horizon": "Near to medium term",
        "mitigability": "Capacity expansion with execution lag",
        "confidence": "Moderate",
        "effect": "Demand can outpace qualified installation capacity even when customer spending remains intact."
      }
    ],
    "failureConditions": [
      "Capacity expansion fails to convert thermal backlog into installed systems and cash."
    ],
    "br": {
      "support": "Limited",
      "analogue": "Prior infrastructure capacity-investment cycles",
      "similarity": "Demand for thermal management must convert through orders and execution into cash.",
      "difference": "AI customer concentration, technology cadence and valuation duration differ from prior cycles.",
      "confidence": "Low",
      "limitation": "Conceptual analogue only. No historical sample, measured base rate or calibrated probability is supplied."
    },
    "context": {
      "scope": "BROADER_ARCHITECTURE_DEMO",
      "macro": [
        {
          "factor": "Project credit conditions",
          "state": "Mixed",
          "explanation": "Higher financing costs may extend project timing; committed cooling demand is not automatically cancelled."
        }
      ],
      "industry": {
        "state": "Expanding",
        "layer": "Thermal management",
        "explanation": "The demonstration thermal management neighborhood is expanding; this describes commercial conditions, not trading volume or price volatility.",
        "valueAccrual": "Thermal scarcity supports demand, but installation bottlenecks can retain value outside the supplier."
      },
      "dependencies": [
        "Hyperscaler capex",
        "Power availability",
        "Installation labor"
      ]
    },
    "survival": "SURVIVES WITH CONDITIONS",
    "disposition": "ADVANCE",
    "reason": "Thermal demand is causal, but capacity and commissioning remain conditions on capture.",
    "contradictions": [
      "Strong Wash-1 demand and emerging recognition do not remove the physical installation bottleneck."
    ],
    "t2": {
      "t": 2,
      "ops": 81,
      "rap": 64,
      "why": "OPS moderates because installation capacity limits realizable demand. RAP declines as power availability and commissioning delays compound execution uncertainty.",
      "disposition": "ADVANCE"
    }
  },
  "ETN": {
    "ticker": "ETN",
    "ct": {
      "state": "Strong",
      "momentum": "Improving",
      "confidence": "Moderate"
    },
    "chain": [
      {
        "to": "Data-center buildout",
        "state": "Strong",
        "confidence": "High",
        "evidence": "The illustrative case links ai infrastructure capex to a requirement for data-center buildout.",
        "reason": "The fixture establishes a direct requirement, conditional on the next link executing.",
        "weakness": "A pause in the upstream investment can delay downstream realization.",
        "lag": "Sequential project timing; no calibrated lag estimate.",
        "from": "AI infrastructure capex"
      },
      {
        "to": "Electrical infrastructure",
        "state": "Strong",
        "confidence": "High",
        "evidence": "The illustrative case links data-center buildout to a requirement for electrical infrastructure.",
        "reason": "Electrical infrastructure has an economic transmission path; narrative association alone would not establish orders or capture.",
        "weakness": "A pause in the upstream investment can delay downstream realization.",
        "lag": "Sequential project timing; no calibrated lag estimate.",
        "from": "Data-center buildout"
      },
      {
        "to": "Power distribution orders",
        "state": "Strong",
        "confidence": "Moderate",
        "evidence": "The fixture includes varied electrical end uses, contract repricing lag and utility-access constraints.",
        "reason": "Multiple end uses support durable transmission, although shared power constraints remain.",
        "weakness": "Input costs can rise before contract repricing; constrained utility access may delay installations.",
        "lag": "Pricing and project energization can lag orders.",
        "from": "Electrical infrastructure"
      },
      {
        "to": "Company revenue",
        "state": "Strong",
        "confidence": "High",
        "evidence": "The illustrative case links power distribution orders to a requirement for company revenue.",
        "reason": "The fixture establishes a direct requirement, conditional on the next link executing.",
        "weakness": "A pause in the upstream investment can delay downstream realization.",
        "lag": "Sequential project timing; no calibrated lag estimate.",
        "from": "Power distribution orders"
      },
      {
        "to": "Margin / cash-flow capture",
        "state": "Strong",
        "confidence": "Moderate",
        "evidence": "The fixture includes varied electrical end uses, contract repricing lag and utility-access constraints.",
        "reason": "Multiple end uses support durable transmission, although shared power constraints remain.",
        "weakness": "Input costs can rise before contract repricing; constrained utility access may delay installations.",
        "lag": "Pricing and project energization can lag orders.",
        "from": "Company revenue"
      }
    ],
    "fragilities": [
      {
        "mechanism": "Input costs and power access",
        "category": "Supply / execution",
        "likelihood": "Ongoing exposure",
        "severity": "Moderate with pricing lag",
        "horizon": "Near to medium term",
        "mitigability": "Contract pricing and diversified end uses",
        "confidence": "Moderate",
        "effect": "Input costs can rise before contract repricing; constrained utility access may delay installations."
      }
    ],
    "failureConditions": [
      "Power-access delays and cost inflation persist beyond the ability to reprice and convert backlog."
    ],
    "br": {
      "support": "Limited",
      "analogue": "Prior infrastructure capacity-investment cycles",
      "similarity": "Demand for electrical infrastructure must convert through orders and execution into cash.",
      "difference": "AI customer concentration, technology cadence and valuation duration differ from prior cycles.",
      "confidence": "Low",
      "limitation": "Conceptual analogue only. No historical sample, measured base rate or calibrated probability is supplied."
    },
    "context": {
      "scope": "BROADER_ARCHITECTURE_DEMO",
      "macro": [
        {
          "factor": "Electrical input costs",
          "state": "Mixed",
          "explanation": "Copper-related input pressure affects conversion margins, while repricing limits some exposure."
        }
      ],
      "industry": {
        "state": "Expanding",
        "layer": "Electrical infrastructure",
        "explanation": "The demonstration electrical infrastructure neighborhood is expanding; this describes commercial conditions, not trading volume or price volatility.",
        "valueAccrual": "Long-lead electrical equipment captures scarcity value across multiple infrastructure uses."
      },
      "dependencies": [
        "Hyperscaler capex",
        "Power availability",
        "Electrical input costs"
      ]
    },
    "survival": "STRONG",
    "disposition": "ADVANCE",
    "reason": "Multiple end uses support durable transmission, although shared power constraints remain.",
    "contradictions": [
      "Strong causal durability coexists with dormant Wash-1 participation; timing remains unresolved."
    ],
    "t2": {
      "t": 2,
      "ops": 83,
      "rap": 72,
      "why": "OPS improves modestly as electrical uses broaden. RAP rises as diversified applications and repricing mitigate concentration, while power access remains a common-cause constraint.",
      "disposition": "ADVANCE"
    }
  },
  "PWR": {
    "ticker": "PWR",
    "ct": {
      "state": "Fragile",
      "momentum": "Softening",
      "confidence": "Moderate"
    },
    "chain": [
      {
        "to": "Data-center buildout",
        "state": "Strong",
        "confidence": "High",
        "evidence": "The illustrative case links ai infrastructure capex to a requirement for data-center buildout.",
        "reason": "The fixture establishes a direct requirement, conditional on the next link executing.",
        "weakness": "A pause in the upstream investment can delay downstream realization.",
        "lag": "Sequential project timing; no calibrated lag estimate.",
        "from": "AI infrastructure capex"
      },
      {
        "to": "Physical installation",
        "state": "Strong",
        "confidence": "High",
        "evidence": "The illustrative case links data-center buildout to a requirement for physical installation.",
        "reason": "Physical installation has an economic transmission path; narrative association alone would not establish orders or capture.",
        "weakness": "A pause in the upstream investment can delay downstream realization.",
        "lag": "Sequential project timing; no calibrated lag estimate.",
        "from": "Data-center buildout"
      },
      {
        "to": "Infrastructure project awards",
        "state": "Fragile",
        "confidence": "Moderate",
        "evidence": "The fixture contains project awards with incomplete permitting and unfilled skilled-crew requirements.",
        "reason": "Recall established a real installation pathway; execution dependencies now materially challenge timely capture.",
        "weakness": "Backlog may not become executable work when permits, skilled crews and power access do not align.",
        "lag": "Permitting and staffing can extend project schedules beyond the thesis horizon.",
        "from": "Physical installation"
      },
      {
        "to": "Company revenue",
        "state": "Fragile",
        "confidence": "Moderate",
        "evidence": "The fixture contains project awards with incomplete permitting and unfilled skilled-crew requirements.",
        "reason": "Project awards require executable installation work before revenue can be realized.",
        "weakness": "Backlog may not become executable work when permits, skilled crews and power access do not align.",
        "lag": "Permitting and staffing can extend project schedules beyond the thesis horizon.",
        "from": "Infrastructure project awards"
      },
      {
        "to": "Margin / cash-flow capture",
        "state": "Fragile",
        "confidence": "Moderate",
        "evidence": "The fixture contains project awards with incomplete permitting and unfilled skilled-crew requirements.",
        "reason": "Recall established a real installation pathway; execution dependencies now materially challenge timely capture.",
        "weakness": "Backlog may not become executable work when permits, skilled crews and power access do not align.",
        "lag": "Permitting and staffing can extend project schedules beyond the thesis horizon.",
        "from": "Company revenue"
      }
    ],
    "fragilities": [
      {
        "mechanism": "Labor and permitting synchronization",
        "category": "Execution / regulation",
        "likelihood": "Material delay scenario",
        "severity": "High for cash timing",
        "horizon": "Project duration",
        "mitigability": "Limited while permits and crews remain scarce",
        "confidence": "Moderate",
        "effect": "Backlog may not become executable work when permits, skilled crews and power access do not align."
      }
    ],
    "failureConditions": [
      "Project awards remain unexecutable through the thesis horizon or working-capital demands absorb cash capture."
    ],
    "br": {
      "support": "Limited",
      "analogue": "Prior infrastructure capacity-investment cycles",
      "similarity": "Demand for physical installation must convert through orders and execution into cash.",
      "difference": "AI customer concentration, technology cadence and valuation duration differ from prior cycles.",
      "confidence": "Low",
      "limitation": "Conceptual analogue only. No historical sample, measured base rate or calibrated probability is supplied."
    },
    "context": {
      "scope": "BROADER_ARCHITECTURE_DEMO",
      "macro": [
        {
          "factor": "Project financing",
          "state": "Adverse",
          "explanation": "Higher project financing costs increase deferral risk before construction converts to cash."
        }
      ],
      "industry": {
        "state": "Mixed",
        "layer": "Physical installation",
        "explanation": "The demonstration physical installation neighborhood is mixed; this describes commercial conditions, not trading volume or price volatility.",
        "valueAccrual": "Installation demand expands, but scarce labor and execution obligations may absorb supplier value."
      },
      "dependencies": [
        "Hyperscaler capex",
        "Power availability",
        "Installation labor",
        "Permitting"
      ]
    },
    "survival": "MATERIAL CHALLENGE",
    "disposition": "HOLD",
    "reason": "Recall established a real installation pathway; execution dependencies now materially challenge timely capture.",
    "contradictions": [
      "Improving Wash-1 backlog economics coexist with fragile execution and limited analogue comparability."
    ],
    "t2": {
      "t": 2,
      "ops": 65,
      "rap": 48,
      "why": "OPS falls as executable work is narrower than headline backlog. RAP falls because labor, permitting and financing can fail together, reducing the benefit of apparent backlog duration.",
      "disposition": "HOLD"
    }
  }
};
const sequence:[Wash2EventType,string][]=[["WASH_2_STARTED", "Beginning Wash 2 \u00b7 local demonstration"], ["CAUSAL_THESIS_ANALYSIS_STARTED", "Testing causal transmission"], ["CAUSAL_CHAIN_BUILT", "Tracing thesis effects into company economics"], ["CAUSAL_THESIS_ANALYSIS_COMPLETE", "Identifying weak causal links"], ["FRAGILITY_ANALYSIS_STARTED", "Examining thesis-specific fragility"], ["FRAGILITY_ANALYSIS_COMPLETE", "Testing customer, supplier and execution dependencies"], ["BASE_RATE_ANALYSIS_STARTED", "Comparing conceptual historical analogues"], ["BASE_RATE_ANALYSIS_COMPLETE", "Retaining limited analogue confidence"], ["MACRO_REGIME_CONTEXT_STARTED", "Examining relevant macro sensitivities \u00b7 broader context"], ["MACRO_REGIME_CONTEXT_COMPLETE", "Evaluating thesis-relevant macro conditions"], ["INDUSTRY_CONTEXT_STARTED", "Examining commercial value-chain conditions"], ["INDUSTRY_CONTEXT_COMPLETE", "Distinguishing industry conditions from volume and price regimes"], ["DEPENDENCY_ANALYSIS_STARTED", "Mapping shared candidate dependencies"], ["DEPENDENCY_ANALYSIS_COMPLETE", "Identifying common-cause thesis risk"], ["THESIS_SURVIVAL_SYNTHESIS_STARTED", "Synthesizing conditional survival and contradictions"], ["WASH_2_COMPLETE", "Wash 2 complete \u00b7 T2 established"]];
export const wash2Events:ResearchActivityEvent[]=sequence.map(([type,message],sequence)=>({id:`wash2-${sequence}`,type,message,sequence,origin:'LOCAL_DEMO'}));
