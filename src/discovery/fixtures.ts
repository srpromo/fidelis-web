import type {DiscoveryCandidate,DiscoveryPathway,ResearchActivityEvent} from './model';
export const discoveryPathways:DiscoveryPathway[]=[
 ['compute','Compute','Usable capacity requires processors; a demand customer is not automatically a supplier beneficiary.'],
 ['network','Networking','Larger clusters require systems that move data between processors.'],
 ['thermal','Thermal management','Rack density creates a requirement for cooling and heat removal.'],
 ['electrical','Electrical infrastructure','Facilities require power distribution equipment and physical installation.'],
 ['manufacturing','Semiconductor manufacturing','Demand for chips can transmit into fabrication equipment, subject to capacity decisions.'],
 ['optical','Optical connectivity','Connections between systems create a possible component-demand pathway.']
].map(([id,label,explanation])=>({id,label,relationship:{from:'Data-center buildout',to:label,explanation}}));
export const discoveryCandidates:DiscoveryCandidate[]=[
 {ticker:'NVDA',company:'NVIDIA',pathway:'compute',relationship:'Accelerated compute provides a direct illustrative link between data-center investment and processor demand.',exposure:'High',confidence:'Moderate'},
 {ticker:'AMD',company:'Advanced Micro Devices',pathway:'compute',relationship:'Compute processors provide plausible supplier exposure; adoption and economic capture still require later analysis.',exposure:'Moderate',confidence:'Moderate'},
 {ticker:'ANET',company:'Arista Networks',pathway:'network',relationship:'Cluster connectivity creates an equipment-demand pathway as compute systems scale.',exposure:'High',confidence:'Moderate'},
 {ticker:'VRT',company:'Vertiv',pathway:'thermal',relationship:'Higher rack density requires thermal-management infrastructure before installed compute can be used.',exposure:'High',confidence:'Moderate'},
 {ticker:'ETN',company:'Eaton',pathway:'electrical',relationship:'Power distribution equipment connects facility construction to usable electrical capacity.',exposure:'High',confidence:'Moderate'},
 {ticker:'AMAT',company:'Applied Materials',pathway:'manufacturing',relationship:'Fabrication equipment is a second-order pathway from chip demand to manufacturing capacity investment.',exposure:'Moderate',confidence:'Moderate'},
 {ticker:'GLW',company:'Corning',pathway:'optical',relationship:'Optical connectivity is relevant, but this fixture does not establish sufficient company-wide economic materiality.',exposure:'Unresolved',confidence:'Low',rejection:'Exposure materiality is insufficiently established by this demonstration evidence. This is not a judgment of company quality.'},
 {ticker:'MSFT',company:'Microsoft',pathway:'compute',relationship:'The fixture identifies a source of infrastructure spending rather than a direct physical-infrastructure supplier beneficiary.',exposure:'Low',confidence:'Moderate',rejection:'Customer-side narrative association does not establish the supplier exposure sought by this thesis. This is not a judgment of company quality.'},
 {ticker:'PWR',company:'Quanta Services',pathway:'electrical',relationship:'Recall revisits the physical installation bottleneck: infrastructure requires skilled execution as well as equipment.',exposure:'Moderate',confidence:'Moderate',recall:true}
];
const events:Omit<ResearchActivityEvent,'id'|'sequence'|'origin'>[]=[
 {type:'DISCOVERY_STARTED',message:'Beginning demonstration Discovery'},
 {type:'THESIS_CAUSAL_MAP_STARTED',message:'Mapping thesis causal pathways'},
 {type:'THESIS_CAUSAL_MAP_COMPLETE',message:'Connecting infrastructure investment to data-center buildout'},
 ...discoveryPathways.map(pathway=>({type:'PATHWAY_IDENTIFIED' as const,message:`Identified infrastructure layer: ${pathway.label.toLowerCase()}`,pathway})),
 {type:'CANDIDATE_SEARCH_STARTED',message:'Exploring plausible candidate exposures'},
 ...discoveryCandidates.filter(c=>!c.recall).map(candidate=>({type:'CANDIDATE_IDENTIFIED' as const,message:`Considering ${candidate.ticker} through its causal pathway`,candidate})),
 {type:'EXPOSURE_VALIDATION_STARTED',message:'Validating business relevance and evidence confidence'},
 ...discoveryCandidates.filter(c=>!c.recall).map(c=>({type:c.rejection?'CANDIDATE_REJECTED' as const:'EXPOSURE_VALIDATION_COMPLETE' as const,message:c.rejection?`${c.ticker}: insufficiently established relevance to this thesis`:`${c.ticker}: plausible thesis exposure validated in the fixture`,ticker:c.ticker})),
 {type:'DISCOVERY_RECALL_STARTED',message:'Running Discovery Recall — challenging the initial universe'},
 ...discoveryCandidates.filter(c=>c.recall).map(candidate=>({type:'DISCOVERY_RECALL_CANDIDATE_IDENTIFIED' as const,message:`Recall identified ${candidate.ticker}: ${candidate.relationship}`,candidate})),
 {type:'DISCOVERY_COMPLETE',message:'Candidate universe complete — ready for your review'}
];
// An eventual bounded engine adapter can supply the same ordered event contract.
export const discoveryEvents:ResearchActivityEvent[]=events.map((e,sequence)=>({...e,id:`discovery-${sequence}`,sequence,origin:'LOCAL_DEMO'}));
