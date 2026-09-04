export function normalizeText(value='') {
  return String(value).toLowerCase().replace(/[^a-z0-9+#.]+/g,' ').replace(/\s+/g,' ').trim();
}

export function canonicalWorkplace(value='') {
  const x=normalizeText(value);
  if (x.includes('remote')) return 'remote';
  if (x.includes('hybrid')) return 'hybrid';
  if (x.includes('onsite') || x.includes('on site')) return 'onsite';
  return 'unknown';
}

export function stableListingId({source='source',externalId='',company='',title='',location=''}) {
  const raw=[source,externalId,company,title,location].map(normalizeText).join('|');
  let hash=2166136261;
  for (let i=0;i<raw.length;i++) { hash^=raw.charCodeAt(i); hash=Math.imul(hash,16777619); }
  return `job-${(hash>>>0).toString(16)}`;
}
