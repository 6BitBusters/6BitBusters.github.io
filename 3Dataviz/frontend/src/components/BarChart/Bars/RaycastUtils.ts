import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function GetIntersectionId(mesh: THREE.InstancedMesh,mouse:THREE.Vector2, cam: THREE.Camera): number|null {
  const intersection = GetIntersection(mesh,mouse,cam);
  if (intersection) {
    const instanceIndex = intersection.instanceId
    if (instanceIndex !== undefined) {
      return instanceIndex;
    }
  }
  return null;
}

export function GetIntersection(mesh: THREE.InstancedMesh,mouse:THREE.Vector2, cam: THREE.Camera):THREE.Intersection|null {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, cam);
  const intersects = raycaster.intersectObject(mesh);
  if (intersects.length > 0 ) {
    return intersects[0];
  }
  return null;
}

export function ScreenToWorldPosition(mouse:THREE.Vector2,cam: THREE.Camera): [number,number] {
  const raycaster = new THREE.Raycaster();

  raycaster.setFromCamera(mouse, cam);
  // Crea un piano invisibile parallelo alla camera a una certa distanza
  const planeNormal = new THREE.Vector3(0, 0, -1).transformDirection(cam.matrixWorld);
  const plane = new THREE.Plane(planeNormal, -cam.position.z); // Distanza dalla camera

  const worldPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, worldPoint);
  return [worldPoint.x,worldPoint.y];
}