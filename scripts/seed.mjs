import fs from 'node:fs';
const file=process.env.DATABASE_PATH||'.data/career-agent.db';
try { fs.rmSync(file,{force:true}); } catch {}
await import('../apps/api/src/store.js').then(({Store})=>new Store(file));
console.log(`Seeded ${file}`);
