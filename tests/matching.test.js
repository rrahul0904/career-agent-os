import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreListing } from '../packages/matching/src/index.js';
import { seedProfile, seedListings } from '../packages/domain/src/fixtures.js';

test('matching is deterministic and bounded',()=>{
  const a=scoreListing(seedProfile,seedListings[0]);
  const b=scoreListing(seedProfile,seedListings[0]);
  assert.deepEqual(a,b);assert.ok(a.score>=0&&a.score<=100);assert.ok(a.reasons.length>0);
});

test('relevant data role outranks unrelated frontend role',()=>{
  const ai=scoreListing(seedProfile,seedListings[0]).score;
  const front=scoreListing(seedProfile,seedListings.find(x=>x.id==='job-cascade-frontend')).score;
  assert.ok(ai>front,`${ai} should exceed ${front}`);
});
