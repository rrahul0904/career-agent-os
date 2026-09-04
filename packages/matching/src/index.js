import { normalizeText } from '../../domain/src/normalize.js';

const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
const words=s=>new Set(normalizeText(s).split(' ').filter(Boolean));

function overlap(a=[],b=[]) {
  const A=new Set(a.map(normalizeText)); const B=new Set(b.map(normalizeText));
  if (!B.size) return 0;
  return [...B].filter(x=>A.has(x)).length/B.size;
}

export function scoreListing(profile, listing) {
  const skillScore=overlap(profile.skills||[],listing.skills||[])*100;
  const roleTokens=words((profile.targetRoles||[]).join(' '));
  const titleTokens=words(listing.title);
  const titleOverlap=[...titleTokens].filter(x=>roleTokens.has(x)).length/Math.max(1,titleTokens.size);
  const roleScore=Math.min(100,titleOverlap*120);
  const preferredWorkplace=(profile.preferences?.workplace||[]).includes(listing.workplace);
  const workplaceScore=preferredWorkplace?100:listing.workplace==='unknown'?50:25;
  const locationText=normalizeText(listing.location);
  const preferredLocations=(profile.preferences?.locations||[]).map(normalizeText);
  const locationScore=listing.workplace==='remote'?95:(preferredLocations.some(x=>locationText.includes(x)||x.includes(locationText))?100:45);
  const minSalary=profile.preferences?.salary?.min||0;
  const salaryScore=!listing.salaryMax?60:listing.salaryMax>=minSalary?100:Math.max(20,(listing.salaryMax/minSalary)*100);
  const seniorWords=normalizeText(listing.title);
  const seniorityScore=(profile.seniority==='senior' && /(senior|staff|principal|lead)/.test(seniorWords))?100:70;
  const components={skills:clamp(skillScore),role:clamp(roleScore),seniority:seniorityScore,workplace:workplaceScore,location:locationScore,salary:clamp(salaryScore)};
  const score=clamp(components.skills*.34+components.role*.23+components.seniority*.13+components.workplace*.10+components.location*.10+components.salary*.10);
  const matchedSkills=(listing.skills||[]).filter(s=>(profile.skills||[]).map(normalizeText).includes(normalizeText(s)));
  const reasons=[];
  if (matchedSkills.length) reasons.push(`Strong skill overlap: ${matchedSkills.slice(0,5).join(', ')}`);
  if (components.role>=70) reasons.push('Role scope aligns with your target titles');
  if (preferredWorkplace) reasons.push(`${listing.workplace[0].toUpperCase()+listing.workplace.slice(1)} work matches your preference`);
  if (listing.salaryMax && listing.salaryMax>=minSalary) reasons.push('Compensation range clears your target floor');
  const gaps=(listing.skills||[]).filter(s=>!matchedSkills.includes(s)).slice(0,4);
  return {score,components,reasons:reasons.slice(0,4),gaps,matchedSkills};
}
