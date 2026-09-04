import { stableListingId, canonicalWorkplace } from '../../domain/src/normalize.js';

export async function fetchGreenhouseJobs(boardToken, fetchImpl=fetch) {
  const url=`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(boardToken)}/jobs?content=true`;
  const res=await fetchImpl(url,{headers:{'user-agent':'career-agent-os/0.1'}});
  if (!res.ok) throw new Error(`Greenhouse ${boardToken} returned ${res.status}`);
  const data=await res.json();
  return (data.jobs||[]).map(job=>({
    id:stableListingId({source:'greenhouse',externalId:String(job.id),company:boardToken,title:job.title,location:job.location?.name||''}),
    company:boardToken,title:job.title,location:job.location?.name||'Unspecified',
    workplace:canonicalWorkplace(`${job.location?.name||''} ${job.content||''}`),
    description:String(job.content||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(),
    skills:[],source:'greenhouse',sourceUrl:job.absolute_url||null,postedAt:job.updated_at||new Date().toISOString(),raw:{externalId:job.id}
  }));
}
