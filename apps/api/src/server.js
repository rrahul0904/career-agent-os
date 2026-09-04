import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Store } from './store.js';
import { createApiHandler } from './router.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const webRoot=path.resolve(here,'../../web/public');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8'};

export function createServer({databasePath=process.env.DATABASE_PATH||'.data/career-agent.db'}={}) {
  const store=new Store(databasePath);
  const api=createApiHandler(store);
  return http.createServer(async (req,res)=>{
    const url=new URL(req.url||'/',`http://${req.headers.host||'localhost'}`);
    if (url.pathname.startsWith('/api/')) return api(req,res,url);
    const requested=url.pathname==='/'?'index.html':url.pathname.replace(/^\//,'');
    const target=path.resolve(webRoot,requested);
    if (!target.startsWith(webRoot) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) {
      const fallback=path.join(webRoot,'index.html');
      res.writeHead(200,{'content-type':'text/html; charset=utf-8'});
      return fs.createReadStream(fallback).pipe(res);
    }
    res.writeHead(200,{'content-type':mime[path.extname(target)]||'application/octet-stream'});
    fs.createReadStream(target).pipe(res);
  });
}

if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const port=Number(process.env.PORT||4310);
  const server=createServer();
  server.listen(port,'0.0.0.0',()=>console.log(`Career Agent OS running on http://localhost:${port}`));
}
