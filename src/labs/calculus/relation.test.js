import test from 'node:test';
import assert from 'node:assert/strict';
import {domain,codomain,scenarios,inspectRelation,restoreSets} from './relation.js';
import {steps} from './sets-content.js';
test('image differs from codomain; many-to-one is a function',()=>{
 const r=inspectRelation(domain,codomain,scenarios.square.pairs);
 assert.equal(r.isFunction,true);assert.deepEqual(r.image,[0,1,4]);
 assert.equal(inspectRelation([1,2],[1,2,3],[{x:1,y:2},{x:2,y:2}]).isFunction,true);
});
test('missing and multiple outputs fail independently',()=>{
 assert.deepEqual(inspectRelation(domain,codomain,scenarios.missing.pairs).missing,[0]);
 assert.deepEqual(inspectRelation(domain,codomain,scenarios.multiple.pairs).multiple,[2]);
 assert.equal(inspectRelation(domain,codomain,scenarios.multiple.pairs).isFunction,false);
 assert.throws(()=>inspectRelation([1],[2],[{x:1,y:3}]));
 assert.throws(()=>inspectRelation([1,1],[2],[]));
 assert.equal(inspectRelation([1],[2],[{x:1,y:2},{x:1,y:2}]).isFunction,true);
});
test('new lesson progress never inherits short-lesson completion',()=>{
 assert.deepEqual(restoreSets('{"version":1,"concept":true,"prediction":true}').passed,[false,false,false,false]);
 assert.equal(restoreSets('{"version":1,"step":999}').step,0);
 assert.deepEqual(restoreSets('broken').passed,[false,false,false,false]);
 const p={version:1,step:2,passed:[true,false,true,false]};assert.deepEqual(restoreSets(JSON.stringify(p)),p);
});
test('each teaching step has a task and an explained valid answer',()=>{
 assert.equal(steps.length,4);for(const s of steps){assert.ok(s.body&&s.task&&s.correct&&s.hint);assert.ok(s.options[s.answer]);}
});
