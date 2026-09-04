export const mcpToolContract = [
  {name:'career_list_jobs',description:'Search normalized job listings',input:{q:'string?',workplace:'string?',limit:'number?'}},
  {name:'career_recommended_jobs',description:'Return explainably ranked candidate matches',input:{limit:'number?'}},
  {name:'career_get_profile',description:'Read persistent candidate intelligence',input:{}},
  {name:'career_pipeline',description:'Read application pipeline state',input:{}},
  {name:'career_add_job',description:'Add a listing to the candidate pipeline',input:{listingId:'string',stage:'string?'}},
  {name:'career_generate_pack',description:'Generate an evidence-bound application pack',input:{listingId:'string'}},
  {name:'career_apply',description:'Create an application attempt; live submission remains policy-gated',input:{listingId:'string'}}
];
