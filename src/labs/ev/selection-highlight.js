import * as THREE from 'three';

// An x-ray edge overlay keeps the selected geometry legible behind other parts.
// It is a visual aid, not a second selectable object.
export function createSelectionHighlight(scene) {
  const overlay = new THREE.Group();
  scene.add(overlay);
  const material = new THREE.LineBasicMaterial({color:0xffe596, depthTest:false, depthWrite:false, transparent:true, opacity:0.95});
  const cache = new Map();
  let entries = [];
  function clear() { overlay.clear(); entries = []; }
  function select(objects) {
    clear();
    const seen = new Set();
    for (const object of objects) object?.traverse(node => {
      if (!node.isMesh || seen.has(node)) return;
      seen.add(node);
      if (!cache.has(node.geometry)) cache.set(node.geometry, new THREE.EdgesGeometry(node.geometry, 25));
      for (let i = 0; i < (node.isInstancedMesh ? node.count : 1); i++) {
        const line = new THREE.LineSegments(cache.get(node.geometry), material);
        line.matrixAutoUpdate = false;
        line.renderOrder = 100;
        overlay.add(line);
        entries.push({node, line, index:i});
      }
    });
  }
  function update() {
    const bounds = new THREE.Box3();
    for (const {node,line,index} of entries) {
      let visible = true;
      for (let p = node; p; p = p.parent) if (!p.visible) visible = false;
      line.visible = visible;
      if (!visible) continue;
      node.updateWorldMatrix(true, false);
      line.matrix.copy(node.matrixWorld);
      if (node.isInstancedMesh) {
        const instance = new THREE.Matrix4();
        node.getMatrixAt(index, instance);
        line.matrix.multiply(instance);
      }
      node.geometry.computeBoundingBox();
      bounds.union(node.geometry.boundingBox.clone().applyMatrix4(line.matrix));
    }
    return bounds;
  }
  return {select, update, destroy() {clear(); cache.forEach(g=>g.dispose()); material.dispose(); scene.remove(overlay);}};
}
