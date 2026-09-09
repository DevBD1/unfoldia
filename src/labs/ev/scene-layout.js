import * as THREE from "three";
import { CHILD_IDS, CHILD_SIZES, SYSTEM_IDS, systemForId } from "./geometry.js";

export const CORE_SYSTEM_IDS = ["battery", "inverter", "motor", "gears"];
export const LEAF_SYSTEM_IDS = ["charger", "dcdc", "thermal", "bms"];

/** Return the selectable pieces shown in an inventory layout. */
export function inventoryPieceIds(
  visibleSystems = SYSTEM_IDS,
  isolatedId = null,
) {
  const visible = new Set(visibleSystems);
  const isolatedSystem = isolatedId ? systemForId(isolatedId) : null;
  return [
    ...CHILD_IDS.filter(
      (id) =>
        visible.has(systemForId(id)) &&
        (!isolatedId ||
          (SYSTEM_IDS.includes(isolatedId)
            ? systemForId(id) === isolatedSystem
            : id === isolatedId)),
    ),
    ...LEAF_SYSTEM_IDS.filter(
      (id) => visible.has(id) && (!isolatedId || id === isolatedId),
    ),
  ];
}

/**
 * Compute a deterministic, top-view inventory.  The spacing is deliberately
 * conservative: pieces with different aspect ratios cannot overlap even when
 * their representative dimensions change slightly.
 */
export function computeInventoryLayout(
  visibleSystems = SYSTEM_IDS,
  footprints = {},
  isolatedId = null,
  aspect = 1,
) {
  const ids = inventoryPieceIds(visibleSystems, isolatedId);
  const dimensions = ids.map(
    (id) =>
      footprints[id] ?? {
        width: (CHILD_SIZES[id] ?? [1, 0.4, 1])[0],
        height: (CHILD_SIZES[id] ?? [1, 0.4, 1])[1],
        depth: (CHILD_SIZES[id] ?? [1, 0.4, 1])[2],
      },
  );
  const gapX = 0.36;
  const gapZ = 0.42;
  const cellW = Math.max(1, ...dimensions.map((size) => size.width)) + gapX;
  const cellD = Math.max(1, ...dimensions.map((size) => size.depth)) + gapZ;
  const columns = Math.min(
    6,
    Math.max(1, Math.round(Math.sqrt((ids.length * aspect * cellD) / cellW))),
  );
  const layout = {};
  const rowCount = Math.max(1, Math.ceil(ids.length / columns));
  const originX = ((columns - 1) * cellW) / 2;
  const originZ = ((rowCount - 1) * cellD) / 2;
  ids.forEach((id, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const size = dimensions[index];
    layout[id] = {
      id,
      systemId: systemForId(id),
      position: [
        col * cellW - originX,
        Math.max(0.25, size.height / 2),
        row * cellD - originZ,
      ],
      size: [size.width + gapX, size.height, size.depth + gapZ],
      width: size.width,
      depth: size.depth,
      isSystem: LEAF_SYSTEM_IDS.includes(id),
    };
  });
  return layout;
}

export function visibleSystemSet(ids) {
  const requested = new Set(ids);
  return new Set(SYSTEM_IDS.filter((id) => requested.has(id)));
}

/** True when two top-view rectangles overlap (touching edges is allowed). */
export function rectanglesOverlap(a, b) {
  const ax = a.position[0];
  const az = a.position[2];
  const bx = b.position[0];
  const bz = b.position[2];
  return (
    Math.abs(ax - bx) < (a.width + b.width) / 2 &&
    Math.abs(az - bz) < (a.depth + b.depth) / 2
  );
}

export function footprintOf(object) {
  object.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  return {
    width: Math.max(size.x, 0.08),
    height: Math.max(size.y, 0.08),
    depth: Math.max(size.z, 0.08),
  };
}

export function fitCameraToObject(camera, controls, object, padding = 1.35) {
  const box = new THREE.Box3();
  object.updateWorldMatrix(true, true);
  object.traverseVisible((node) => {
    if (!node.geometry) return;
    if (node.isInstancedMesh) {
      node.computeBoundingBox();
      box.union(node.boundingBox.clone().applyMatrix4(node.matrixWorld));
    } else {
      node.geometry.computeBoundingBox();
      box.union(
        node.geometry.boundingBox.clone().applyMatrix4(node.matrixWorld),
      );
    }
  });
  if (box.isEmpty()) return null;
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const direction = camera.position.clone().sub(controls.target).normalize();
  if (direction.lengthSq() < 0.01) direction.set(1, 0.7, 1).normalize();
  const right = new THREE.Vector3()
    .crossVectors(camera.up, direction)
    .normalize();
  if (right.lengthSq() < 0.01) right.set(1, 0, 0);
  const up = new THREE.Vector3().crossVectors(direction, right).normalize();
  let distance = 1;
  for (const x of [box.min.x, box.max.x])
    for (const y of [box.min.y, box.max.y])
      for (const z of [box.min.z, box.max.z]) {
        const corner = new THREE.Vector3(x, y, z).sub(center);
        distance = Math.max(
          distance,
          corner.dot(direction) +
            padding *
              Math.max(
                Math.abs(corner.dot(up)) / Math.tan(fov / 2),
                Math.abs(corner.dot(right)) /
                  (Math.tan(fov / 2) * camera.aspect),
              ),
        );
      }
  controls.target.copy(center);
  camera.position
    .copy(center)
    .add(direction.multiplyScalar(Math.max(distance, 3)));
  camera.near = Math.max(0.01, distance / 100);
  camera.far = Math.max(100, distance * 8);
  camera.updateProjectionMatrix();
  controls.update();
  return { center, size, distance };
}

export function applyChildAssembly(child, parent, explode = 0) {
  if (!child.userData.assemblyParent) child.userData.assemblyParent = parent;
  if (child.parent !== parent) parent.attach(child);
  const base =
    child.userData.assemblyPosition ??
    child.userData.base ??
    new THREE.Vector3();
  const offset = child.userData.offset ?? new THREE.Vector3();
  child.position.copy(base).addScaledVector(offset, explode);
  if (child.userData.assemblyQuaternion)
    child.quaternion.copy(child.userData.assemblyQuaternion);
  return child;
}

export function applyInventoryPiece(piece, root, placement) {
  if (piece.parent !== root) root.attach(piece);
  piece.position.set(...placement.position);
  piece.rotation.set(0, 0, 0);
  piece.updateWorldMatrix(true, true);
  const center = new THREE.Box3()
    .setFromObject(piece)
    .getCenter(new THREE.Vector3());
  piece.position.add(new THREE.Vector3(...placement.position).sub(center));
  piece.userData.inventoryCenter = new THREE.Vector3(...placement.position);
  return piece;
}
