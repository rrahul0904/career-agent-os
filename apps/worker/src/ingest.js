import { Store } from '../../api/src/store.js';
import { fetchGreenhouseJobs } from '../../../packages/connectors/src/greenhouse.js';
import { fetchLeverJobs } from '../../../packages/connectors/src/lever.js';

export async function ingestConfiguredSources({store=new Store(), sources=process.env.JOB_INGEST_SOURCES||''}={}) {
  const configs=sources.split(',').map(x=>x.trim()).filter(Boolean);
  if (!configs.length) {
    console.log('No JOB_INGEST_SOURCES configured. Example: greenhouse:openai,lever:netflix');
    return {sources:0,discovered:0,upserted:0};
  }
  let discovered=0,upserted=0;
  for (const config of configs) {
    const [type,...parts]=config.split(':'); const token=parts.join(':');
    const run=store.startIngestion(config);
    try {
      let jobs;
      if(type==='greenhouse') jobs=await fetchGreenhouseJobs(token);
      else if(type==='lever') jobs=await fetchLeverJobs(token);
      else throw new Error(`Unsupported source ${type}`);
      discovered+=jobs.length;
      for (const job of jobs) { store.upsertListing(job); upserted++; }
      store.finishIngestion(run,{discovered:jobs.length,upserted:jobs.length});
      console.log(`${config}: ${jobs.length} jobs`);
    } catch (error) {
      store.finishIngestion(run,{error:error.message});
      console.error(`${config}: ${error.message}`);
    }
  }
  return {sources:configs.length,discovered,upserted};
}

if (process.argv[1] && new URL(import.meta.url).pathname.endsWith(process.argv[1].replaceAll('\\','/'))) {
  ingestConfiguredSources();
}
