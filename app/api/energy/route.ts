import {unstable_cache} from 'next/cache';
export const runtime='nodejs';
export const maxDuration=300;
import {eia,numeric} from '../../../lib/eia';
async function computeEnergy(){const year=String(new Date().getUTCFullYear()-1);const [gen,retail]=await Promise.all([eia('electricity/electric-power-operational-data',{'frequency':'monthly','data[0]':'generation','facets[sectorid][]':'99','facets[fueltypeid][]':['COL','NG','NUC','WND','SUN','HYC','GEO','WWW','PET'],'start':year+'-01','end':year+'-12'}),eia('electricity/retail-sales',{'frequency':'monthly','data[0]':'price','facets[sectorid][]':'RES','start':year+'-01','end':year+'-12'})]);
 const states=new Map<string,any>();for(const r of gen){if(r.location.length!==2||r.location==='US')continue;const s=states.get(r.location)||{code:r.location,name:r['stateDescription']||r.location,total:0,renewable:0,fuels:{},prices:[],months:new Set()};const v=numeric(r.generation);if(v===null)continue;s.total+=v;s.fuels[r.fueltypeid]=(s.fuels[r.fueltypeid]||0)+v;if(['WND','SUN','HYC','GEO','WWW'].includes(r.fueltypeid))s.renewable+=v;s.months.add(r.period);states.set(r.location,s);}
 for(const r of retail){const s=states.get(r.stateid);const p=numeric(r.price);if(s&&p!==null)s.prices.push(p);}
 const payload={year,source:'EIA-923 / EIA retail sales',fetchedAt:new Date().toISOString(),states:[...states.values()].filter(s=>s.prices.length).map(s=>({...s,months:s.months.size,renewableShare:100*s.renewable/s.total,price:s.prices.reduce((a:number,b:number)=>a+b,0)/s.prices.length,prices:undefined}))};return payload;
}
const cachedEnergy=unstable_cache(computeEnergy,['gridlens-energy-v1'],{revalidate:86400});
export async function GET(){try{return Response.json(await cachedEnergy(),{headers:{'Cache-Control':'public, max-age=3600'}});}catch(e){return Response.json({error:e instanceof Error?e.message:'Energy data unavailable'},{status:503});}}
