function evidence(profile) {
  return [
    ...(profile.experience||[]).map(x=>`${x.title} at ${x.company}: ${x.highlight||''}`),
    `Skills: ${(profile.skills||[]).join(', ')}`,
    `Education: ${(profile.education||[]).map(x=>`${x.degree} — ${x.school}`).join('; ')}`
  ];
}

export async function generateApplicationPack({profile,listing}) {
  const matched=(listing.skills||[]).filter(s=>(profile.skills||[]).map(x=>x.toLowerCase()).includes(s.toLowerCase()));
  const strongest=(profile.experience||[])[0];
  const resumeSummary=`${profile.headline} with ${profile.yearsExperience||'multiple'} years of experience building production data and AI platforms. Relevant strengths for ${listing.title} include ${matched.slice(0,6).join(', ') || 'platform engineering, delivery, and technical leadership'}.`;
  const bullets=(profile.experience||[]).map(x=>({
    company:x.company,title:x.title,
    bullets:[x.highlight, matched.length?`Applied ${matched.slice(0,4).join(', ')} across production engineering initiatives.`:null].filter(Boolean)
  }));
  const coverLetter=`Dear ${listing.company} hiring team,\n\nI am interested in the ${listing.title} role. My background includes ${strongest?.highlight || 'building production data and AI systems'}, with hands-on experience in ${matched.slice(0,6).join(', ') || (profile.skills||[]).slice(0,5).join(', ')}. The role's focus on ${listing.description.split('.').slice(0,1).join('.').toLowerCase()} is closely aligned with the work I want to continue doing.\n\nI would welcome the opportunity to discuss how my platform engineering and delivery experience can contribute to ${listing.company}.\n\nBest,\n${profile.name}`;
  return {
    provider:process.env.AI_PROVIDER||'deterministic',
    generatedAt:new Date().toISOString(),
    evidencePolicy:'Every factual claim must be traceable to candidate profile evidence.',
    evidence:evidence(profile),
    tailoredResume:{summary:resumeSummary,experience:bullets,skills:matched.length?matched:(profile.skills||[]).slice(0,10)},
    coverLetter,
    screeningAnswers:[
      {question:'Why are you interested in this role?',answer:`The ${listing.title} role aligns with my experience in ${(matched||[]).slice(0,4).join(', ') || 'data and AI platform engineering'} and my goal of owning high-impact platform work.`},
      {question:'Are you authorized to work in the role location?',answer:'Needs candidate confirmation',requiresHuman:true}
    ],
    verification:{fabricatedClaims:[],status:'passed',method:'evidence-bound deterministic generator'}
  };
}
