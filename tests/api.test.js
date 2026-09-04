import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../apps/api/src/server.js';

async function withServer(fn){const server=createServer({databasePath:':memory:'});await new Promise(r=>server.listen(0,'127.0.0.1',r));try{const {port}=server.address();await fn(`http://127.0.0.1:${port}`)}finally{await new Promise(r=>server.close(r))}}

test('health and recommendations work end to end',()=>withServer(async base=>{const health=await fetch(`${base}/api/health`).then(r=>r.json());assert.equal(health.ok,true);const rec=await fetch(`${base}/api/listings/recommended`).then(r=>r.json());assert.ok(rec.items.length>=5);assert.ok(rec.items[0].match.score>=rec.items.at(-1).match.score)}));

test('pipeline + pack + dry-run application persist',()=>withServer(async base=>{const id='job-openai-senior-platform';let r=await fetch(`${base}/api/listings/${id}/add`,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});assert.equal(r.status,201);r=await fetch(`${base}/api/jobs/${id}/pack`,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});const pack=await r.json();assert.equal(pack.verification.status,'passed');r=await fetch(`${base}/api/jobs/${id}/apply`,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});const attempt=await r.json();assert.equal(attempt.mode,'dry-run');assert.equal(attempt.verification.confirmed,false);const pipe=await fetch(`${base}/api/pipeline`).then(x=>x.json());assert.ok(pipe.items.length===1)}));
