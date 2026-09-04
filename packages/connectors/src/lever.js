import { stableListingId, canonicalWorkplace } from '../../domain/src/normalize.js';

export async function fetchLeverJobs(company, fetchImpl=fetch) {
  const url=`https://api.lever.co/v0/postings/${encodeURIComponent(company)}?mode=json`;
  const res=await fetchImpl(url,{headers:{'user-agent':'career-agent-os/0.1'}});
  if (!res.ok) throw new Error(`Lever ${company} returned ${res.status}`);
  const data=await res.json();
  return (data||[]).map(job=>({
    id:stableListingId({source:'lever',externalId:String(job.id),company,title:job.text,location:job.categories?.location||''}),
    company,title:job.text,location:job.categories?.location||'Unspecified',
    workplace:canonicalWorkplace(`${job.workplaceType||''} ${job.categories?.location||''}`),
    description:[job.descriptionPlain,job.additionalPlain].filter(Boolean).join(' ').replace(/\s+/g,' ').trim(),
    skills:[],source:'lever',sourceUrl:job.hostedUrl||job.applyUrl||null,postedAt:new Date().toISOString(),raw:{externalId:job.id}
  }));
}
