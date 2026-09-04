export async function createApplicationAttempt({profile,listing,pack,mode='dry-run'}) {
  const humanTasks=(pack.screeningAnswers||[]).filter(x=>x.requiresHuman).map(x=>({question:x.question,status:'open'}));
  if (mode !== 'dry-run') {
    return {mode,status:'blocked',reason:'Live browser/ATS submission adapters are intentionally disabled until credentials, consent, and target-specific validation are configured.',humanTasks,verification:{confirmed:false}};
  }
  return {
    mode:'dry-run',status:'ready',ats:'unresolved',
    plan:[
      'Detect target ATS from listing source URL',
      'Resolve form fields against candidate profile',
      'Upload tailored resume and cover letter',
      'Pause for any unresolved or sensitive questions',
      'Submit only after explicit live-mode policy permits it',
      'Verify confirmation page or submission receipt'
    ],
    humanTasks,
    verification:{confirmed:false,reason:'Dry-run mode never submits external forms.'}
  };
}
