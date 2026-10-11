import {eq} from 'drizzle-orm';
import {getDb} from '../db';
import {snapshots} from '../db/schema';
export async function readSnapshot(key:string,maxAge:number){const row=await getDb().select().from(snapshots).where(eq(snapshots.key,key)).get();if(row&&Date.now()-row.fetchedAt<maxAge)return JSON.parse(row.payload);return null;}
export async function writeSnapshot(key:string,payload:unknown){await getDb().insert(snapshots).values({key,payload:JSON.stringify(payload),fetchedAt:Date.now()}).onConflictDoUpdate({target:snapshots.key,set:{payload:JSON.stringify(payload),fetchedAt:Date.now()}});}
