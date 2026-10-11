import {unstable_cache} from 'next/cache';
export const runtime='nodejs';
export const maxDuration=300;
import {eia,numeric} from '../../../lib/eia';
import {analyze,Hour} from '../../../lib/forecast';
async function computeGrid(ba:string){
 const start=new Date(Date.now()-60*86400000).toISOString().slice(0,13);const raw=await eia('electricity/rto/region-data',{'frequency':'hourly','data[0]':'value','facets[respondent][]':ba,'facets[type][]':['D','DF','NG','TI'],'start':start,'sort[0][column]':'period','sort[0][direction]':'asc'});
 const map=new Map<string,Hour>();for(const r of raw){const time=r.period+':00:00Z';const row=map.get(time)||{time,demand:null,eia:null,generation:null,interchange:null};const field=({D:'demand',DF:'eia',NG:'generation',TI:'interchange'} as const)[r.type as 'D'];if(field)row[field]=numeric(r.value);map.set(time,row);}
 const sorted=[...map.values()].sort((a,b)=>a.time.localeCompare(b.time));const rows:Hour[]=[];if(sorted.length){const end=new Date(sorted.at(-1)!.time).getTime();for(let t=new Date(sorted[0].time).getTime();t<=end;t+=3600000){const time=new Date(t).toISOString().replace('.000Z','Z');rows.push(map.get(time)||{time,demand:null,eia:null,generation:null,interchange:null});}}
 const latest=rows.filter(r=>r.demand!==null).at(-1);const payload={ba,source:'EIA-930',fetchedAt:new Date().toISOString(),latest,rows,analysis:analyze(rows),quality:{observed:rows.filter(r=>r.demand!==null).length,expected:rows.length,missing:rows.filter(r=>r.demand===null).length}};return payload;
}
const cachedGrid=unstable_cache(computeGrid,['gridlens-grid-v1'],{revalidate:600});
export async function GET(request:Request){
 const ba=new URL(request.url).searchParams.get('ba')||'PJM';
 if(!['PJM','MISO','ERCO','CISO','ISNE','NYIS','SWPP','SOCO','TVA','DUK'].includes(ba))return Response.json({error:'Unknown balancing authority'},{status:400});
 try{return Response.json(await cachedGrid(ba),{headers:{'Cache-Control':'public, max-age=300'}});}
 catch(e){return Response.json({error:e instanceof Error?e.message:'Data service unavailable'},{status:503});}
}
