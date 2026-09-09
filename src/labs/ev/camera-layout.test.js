import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { CHILD_IDS, SYSTEM_IDS, createVehicleGeometry } from "./geometry.js";
import {
  applyInventoryPiece,
  computeInventoryLayout,
  fitCameraToObject,
  footprintOf,
  inventoryPieceIds,
} from "./scene-layout.js";

function createInventory(aspect) {
  const root = new THREE.Group();
  const groups = createVehicleGeometry(root, []);
  const ids = inventoryPieceIds(SYSTEM_IDS);
  const pieces = new Map(
    ids.map((id) => [id, groups.children[id] ?? groups.systems[id]]),
  );
  const footprints = Object.fromEntries(
    ids.map((id) => [id, footprintOf(pieces.get(id))]),
  );
  const layout = computeInventoryLayout(SYSTEM_IDS, footprints, null, aspect);

  for (const id of ids) applyInventoryPiece(pieces.get(id), root, layout[id]);
  root.updateWorldMatrix(true, true);
  return { ids, pieces, layout, root };
}

function xzOverlap(a, b, epsilon = 1e-6) {
  return (
    a.max.x > b.min.x + epsilon &&
    b.max.x > a.min.x + epsilon &&
    a.max.z > b.min.z + epsilon &&
    b.max.z > a.min.z + epsilon
  );
}

function visibleBounds(object) {
  object.updateWorldMatrix(true, true);
  const box = new THREE.Box3();
  object.traverseVisible((node) => {
    if (!node.geometry) return;
    if (node.isInstancedMesh) {
      node.computeBoundingBox();
      box.union(node.boundingBox.clone().applyMatrix4(node.matrixWorld));
      return;
    }
    node.geometry.computeBoundingBox();
    box.union(node.geometry.boundingBox.clone().applyMatrix4(node.matrixWorld));
  });
  return box;
}

function projectionCorners(box, camera) {
  return [box.min.x, box.max.x].flatMap((x) =>
    [box.min.y, box.max.y].flatMap((y) =>
      [box.min.z, box.max.z].map((z) =>
        new THREE.Vector3(x, y, z).project(camera),
      ),
    ),
  );
}

test("real authored geometry remains non-overlapping in inventory across viewport aspects", () => {
  for (const aspect of [390 / 844, 320 / 568, 1440 / 900]) {
    const { ids, pieces, layout } = createInventory(aspect);
    assert.equal(ids.length, CHILD_IDS.length + 4);

    const boxes = new Map(
      ids.map((id) => [id, new THREE.Box3().setFromObject(pieces.get(id))]),
    );
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        assert.equal(
          xzOverlap(boxes.get(ids[i]), boxes.get(ids[j])),
          false,
          `${ids[i]} overlaps ${ids[j]} at aspect ${aspect}`,
        );
      }
    }
    // Every real piece was centered on its layout cell before measuring boxes.
    // Keeping the layout in the return value makes failures easy to inspect.
    assert.equal(Object.keys(layout).length, ids.length);
  }
});

test("fitCameraToObject ignores hidden geometry and fits visible model corners", () => {
  for (const aspect of [390 / 844, 1440 / 900]) {
    const root = new THREE.Group();
    createVehicleGeometry(root, []);
    const hidden = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100));
    hidden.position.set(200, 0, 0);
    hidden.visible = false;
    root.add(hidden);

    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    camera.position.set(7, 6, 8);
    const controls = {
      target: new THREE.Vector3(0, 0.6, 0),
      update() {
        camera.lookAt(this.target);
        camera.updateMatrixWorld(true);
      },
    };

    const expected = visibleBounds(root);
    const expectedSize = expected.getSize(new THREE.Vector3());
    const result = fitCameraToObject(camera, controls, root, 1.25);

    assert.ok(result);
    assert.ok(
      result.size.distanceTo(expectedSize) < 1e-6,
      `visible bounds drifted at aspect ${aspect}`,
    );
    assert.ok(
      result.size.x < 10 && result.size.z < 10,
      "hidden 100 m mesh affected camera fit",
    );

    camera.lookAt(controls.target);
    camera.updateMatrixWorld(true);
    for (const corner of projectionCorners(expected, camera)) {
      assert.ok(
        Math.abs(corner.x) <= 1.001,
        `x corner escaped viewport: ${corner.x}`,
      );
      assert.ok(
        Math.abs(corner.y) <= 1.001,
        `y corner escaped viewport: ${corner.y}`,
      );
      assert.ok(
        corner.z >= -1.001 && corner.z <= 1.001,
        `z corner escaped clip range: ${corner.z}`,
      );
    }
  }
});
