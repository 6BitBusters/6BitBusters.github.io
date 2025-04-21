import * as THREE from "three";

export function GetIntersectionId(
  mesh: THREE.InstancedMesh,
  mouse: THREE.Vector2,
  cam: THREE.Camera,
): number | null {
  const intersection = GetIntersection(mesh, mouse, cam);
  if (intersection) {
    const instanceIndex = intersection.instanceId;
    if (instanceIndex !== undefined) {
      return instanceIndex;
    }
  }
  return null;
}

export function GetIntersection(
  mesh: THREE.InstancedMesh,
  mouse: THREE.Vector2,
  cam: THREE.Camera,
): THREE.Intersection | null {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, cam);
  const intersects = raycaster.intersectObject(mesh);
  if (intersects.length > 0) {
    return intersects[0];
  }
  return null;
}
