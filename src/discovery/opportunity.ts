// Hand-authored demonstration hypotheses; no live company research or scoring.
export const opportunity:Record<string,{potential:string;test:string}>={
 NVDA:{potential:'Processor demand could support earnings growth; share-price upside would require results beyond expectations.',test:'Can demand and margins persist, and how much is already priced in?'},
 AMD:{potential:'Supplier adoption could expand revenue and earnings if the company captures incremental compute demand.',test:'Test adoption, competitive capture and the expectations already reflected in price.'},
 ANET:{potential:'Larger clusters could increase networking content and earnings, with upside if durable demand is underappreciated.',test:'Test customer concentration, order durability and valuation.'},
 VRT:{potential:'Cooling requirements could translate into orders, cash flow and potentially underrecognized earnings.',test:'Test backlog conversion, capacity constraints and cash conversion.'},
 ETN:{potential:'Electrical capacity investment could sustain equipment demand and incremental cash generation.',test:'Test economic materiality, delivery timing and embedded expectations.'},
 AMAT:{potential:'Fabrication investment could transmit chip demand into equipment revenue and earnings.',test:'Test the investment lag, cyclicality and whether new capacity is actually required.'},
 PWR:{potential:'Installation bottlenecks could support project demand and earnings if execution remains profitable.',test:'Test project margins, labor constraints and the timing of cash receipts.'}
};
// Explicitly invented illustration, not historical or current observed market data.
export const demoReturns:Record<string,number>={NVDA:6.4,AMD:-2.1,ANET:3.2,VRT:4.8,ETN:0,AMAT:-1.3,PWR:2.7};
export const returnProvenance={start:'2025-05-30',end:'2025-06-30',asOf:'2025-06-30',source:'Fidelis Alpha hand-authored demonstration fixture',kind:'Illustrative price return — excludes dividends'};
// Future live adapter: last completed trading close versus the last available
// session on/before the corresponding prior calendar-month date. Apply consistent
// corporate-action adjustments to both closes. Price return is not total return.
