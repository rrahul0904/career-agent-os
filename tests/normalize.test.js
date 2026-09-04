import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalWorkplace, stableListingId } from '../packages/domain/src/normalize.js';

test('workplace normalization',()=>{assert.equal(canonicalWorkplace('Remote - USA'),'remote');assert.equal(canonicalWorkplace('Hybrid 3 days'),'hybrid');assert.equal(canonicalWorkplace('On-site'),'onsite')});
test('stable ids are repeatable',()=>{const x={source:'lever',externalId:'42',company:'Acme',title:'Engineer',location:'NY'};assert.equal(stableListingId(x),stableListingId(x))});
