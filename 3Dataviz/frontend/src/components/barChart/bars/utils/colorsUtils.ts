import * as THREE from "three";

export function Selection(
  mesh: THREE.InstancedMesh,
  id: number | null,
  h: boolean,
) {
  const highlightColor = new THREE.Color("white");
  if (mesh != undefined && id != null) {
    mesh.geometry.attributes.color.setXYZ(
      id,
      h ? highlightColor.r : mesh.geometry.attributes.colorBase.getX(id),
      h ? highlightColor.g : mesh.geometry.attributes.colorBase.getY(id),
      h ? highlightColor.b : mesh.geometry.attributes.colorBase.getZ(id),
    );
    mesh.geometry.attributes.color.needsUpdate = true;
  }
}
