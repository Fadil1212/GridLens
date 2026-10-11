const cache=new Map<string,{at:number,data:unknown}>();
export async function eia(route:string,params:Record<string,string|string[]>){const key=route+JSON.stringify(params);const cached=cache.get(key);if(cached&&Date.now()-cached.at<600000)return cached.data as any[];
 const apiKey=process.env.EIA_API_KEY;if(!apiKey)throw Error('EIA connection is not configured.');let rows:any[]=[];
 for(let offset=0;offset<20000;offset+=5000){const url=new URL('https://api.eia.gov/v2/'+route+'/data/');url.searchParams.set('api_key',apiKey);url.searchParams.set('length','5000');url.searchParams.set('offset',String(offset));for(const [k,v]of Object.entries(params))for(const item of Array.isArray(v)?v:[v])url.searchParams.append(k,item);
 let response:Response|undefined;for(let i=0;i<3;i++){try{response=await fetch(url,{signal:AbortSignal.timeout(25000)});if(response.ok)break;}catch{}if(i===2)throw Error('The EIA data service is temporarily unavailable. Please retry.');}
 const body=await response!.json() as any;if(!Array.isArray(body.response?.data))throw Error('EIA returned an invalid response.');rows.push(...body.response.data);if(rows.length>=Number(body.response.total)||!body.response.data.length)break;
 }cache.set(key,{at:Date.now(),data:rows});return rows;}
export const numeric=(v:any)=>v===null||v===undefined||v===''?null:Number.isFinite(Number(v))?Number(v):null;
