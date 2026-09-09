import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createSelectionHighlight} from './selection-highlight.js';

test('selection overlay follows transforms and suppresses hidden selections',()=>{
  const scene=new THREE.Scene(), parent=new THREE.Group(); scene.add(parent);
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(2,2,2)); parent.add(mesh);
  const highlight=createSelectionHighlight(scene); highlight.select([parent,mesh]);
  mesh.position.x=5;
  assert.equal(highlight.update().getCenter(new THREE.Vector3()).x,5);
  parent.visible=false;
  assert.equal(highlight.update().isEmpty(),true);
  highlight.destroy();
  assert.equal(scene.children.length,1);
});
test('selection overlay includes all transformed instances',()=>{
  const scene=new THREE.Scene();
  const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial(),2);
  mesh.setMatrixAt(1,new THREE.Matrix4().makeTranslation(4,0,0));scene.add(mesh);
  const highlight=createSelectionHighlight(scene);highlight.select([mesh]);
  assert.equal(highlight.update().max.x,4.5);
  highlight.destroy();
});
