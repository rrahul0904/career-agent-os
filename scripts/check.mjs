import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const roots=['apps','packages','scripts','tests'];
const files=[];
function walk(p){ for(const e of fs.readdirSync(p,{withFileTypes:true})){ const x=path.join(p,e.name); if(e.isDirectory()) walk(x); else if(/\.(js|mjs)$/.test(e.name)) files.push(x); }}
for(const r of roots) if(fs.existsSync(r)) walk(r);
let failed=false;
for(const file of files){ const x=spawnSync(process.execPath,['--check',file],{stdio:'inherit'}); if(x.status!==0) failed=true; }
if(failed) process.exit(1);
console.log(`Syntax check passed for ${files.length} JavaScript files.`);
