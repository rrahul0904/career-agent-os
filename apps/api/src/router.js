import { scoreListing } from '../../../packages/matching/src/index.js';
import { generateApplicationPack } from '../../../packages/ai/src/application-pack.js';
import { createApplicationAttempt } from '../../../packages/application-agent/src/index.js';

function send(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(body) });
  res.end(body);
}

async function readBody(req) {
  const chunks=[];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw Object.assign(new Error('Invalid JSON body'), { statusCode: 400 }); }
}

export function createApiHandler(store) {
  return async function api(req, res, url) {
    try {
      if (req.method === 'GET' && url.pathname === '/api/health') return send(res,200,{ ok:true, service:'career-agent-os', version:'0.1.0', now:new Date().toISOString() });
      if (req.method === 'GET' && url.pathname === '/api/profile') return send(res,200,store.getProfile());
      if (req.method === 'PUT' && url.pathname === '/api/profile') return send(res,200,store.saveProfile(await readBody(req)));
      if (req.method === 'GET' && url.pathname === '/api/profile/analysis') {
        const p=store.getProfile();
        return send(res,200,{ skills:p.skills||[], seniority:p.seniority||'unknown', targetRoles:p.targetRoles||[], salaryRange:p.preferences?.salary||null, strengths:(p.experience||[]).slice(0,3).map(x=>x.highlight).filter(Boolean) });
      }
      if (req.method === 'GET' && url.pathname === '/api/listings') {
        return send(res,200,{ items:store.listListings({q:url.searchParams.get('q')||'',workplace:url.searchParams.get('workplace')||'',limit:url.searchParams.get('limit')||50}) });
      }
      if (req.method === 'GET' && url.pathname === '/api/listings/recommended') {
        const profile=store.getProfile();
        const items=store.listListings({limit:100}).map(x=>({ ...x, match:scoreListing(profile,x) })).sort((a,b)=>b.match.score-a.match.score).slice(0,Number(url.searchParams.get('limit')||20));
        return send(res,200,{ items });
      }
      const listingMatch=url.pathname.match(/^\/api\/listings\/([^/]+)$/);
      if (req.method === 'GET' && listingMatch) {
        const listing=store.getListing(decodeURIComponent(listingMatch[1]));
        return listing ? send(res,200,{...listing,match:scoreListing(store.getProfile(),listing)}) : send(res,404,{error:'Listing not found'});
      }
      const addMatch=url.pathname.match(/^\/api\/listings\/([^/]+)\/add$/);
      if (req.method === 'POST' && addMatch) {
        const listing=store.getListing(decodeURIComponent(addMatch[1]));
        if (!listing) return send(res,404,{error:'Listing not found'});
        const input=await readBody(req);
        return send(res,201,store.addPipeline(listing.id,input.stage||'saved'));
      }
      if (req.method === 'GET' && url.pathname === '/api/pipeline') return send(res,200,{items:store.listPipeline()});
      const pipeMatch=url.pathname.match(/^\/api\/pipeline\/([^/]+)$/);
      if (req.method === 'PATCH' && pipeMatch) {
        const input=await readBody(req);
        const item=store.updatePipeline(decodeURIComponent(pipeMatch[1]),input.stage);
        return item ? send(res,200,item) : send(res,404,{error:'Pipeline item not found'});
      }
      const jobDetails=url.pathname.match(/^\/api\/jobs\/([^/]+)\/details$/);
      if (req.method === 'GET' && jobDetails) {
        const listing=store.getListing(decodeURIComponent(jobDetails[1]));
        return listing ? send(res,200,{listing,match:scoreListing(store.getProfile(),listing),pack:store.latestApplicationPack(listing.id)}) : send(res,404,{error:'Job not found'});
      }
      const packMatch=url.pathname.match(/^\/api\/jobs\/([^/]+)\/pack$/);
      if (req.method === 'POST' && packMatch) {
        const listing=store.getListing(decodeURIComponent(packMatch[1]));
        if (!listing) return send(res,404,{error:'Job not found'});
        const pack=await generateApplicationPack({profile:store.getProfile(),listing});
        store.addPipeline(listing.id,'pack_ready');
        return send(res,201,store.saveApplicationPack(listing.id,pack));
      }
      const applyMatch=url.pathname.match(/^\/api\/jobs\/([^/]+)\/apply$/);
      if (req.method === 'POST' && applyMatch) {
        const listing=store.getListing(decodeURIComponent(applyMatch[1]));
        if (!listing) return send(res,404,{error:'Job not found'});
        const pack=store.latestApplicationPack(listing.id) || store.saveApplicationPack(listing.id, await generateApplicationPack({profile:store.getProfile(),listing}));
        const attempt=await createApplicationAttempt({profile:store.getProfile(),listing,pack,mode:process.env.AUTO_APPLY_MODE||'dry-run'});
        store.addPipeline(listing.id,attempt.status==='submitted'?'applied':'ready_to_apply');
        return send(res,201,store.saveAttempt(listing.id,attempt));
      }
      if (req.method === 'GET' && url.pathname === '/api/admin/stats') return send(res,200,store.ingestionStats());
      return send(res,404,{error:'API route not found'});
    } catch (error) {
      return send(res,error.statusCode||500,{error:error.message||'Internal server error'});
    }
  };
}
