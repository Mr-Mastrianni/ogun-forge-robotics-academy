import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import labs from '../src/content/kamitron/labs.json' with { type: 'json' };
import { buildSpecimen } from '../src/components/kamitron/specimenModels.js';

test('all 35 migrated specimens produce finite, explodable concept geometry', () => {
  assert.equal(labs.length, 7);
  assert.equal(labs.flatMap(l => l.items).length, 35);
  for (const lab of labs) for (const item of lab.items) {
    const model = buildSpecimen(item[3], lab.color);
    const size = new THREE.Box3().setFromObject(model.group).getSize(new THREE.Vector3());
    assert.ok(size.toArray().every(n => Number.isFinite(n) && n > 0), item[0]);
    assert.ok(model.parts.length > 0, item[0]);
    model.parts.forEach(p => p.obj.position.copy(p.base).addScaledVector(p.dir, 1.1));
    assert.ok(new THREE.Box3().setFromObject(model.group).getSize(new THREE.Vector3()).toArray().every(Number.isFinite), item[0]);
    model.group.traverse(o => { if (o.isMesh) o.geometry.dispose(); });
    model.materials.forEach(m => m.dispose());
  }
});
test('specimen builds own independent animation and geometry state', () => {
  const a=buildSpecimen('octo','#f5b301'), b=buildSpecimen('wing','#67e8f9');
  const before=b.parts[0].obj.position.clone();
  a.parts[0].obj.position.x+=10;
  assert.deepEqual(b.parts[0].obj.position,before);
  assert.notEqual(a.parts,b.parts);
});
