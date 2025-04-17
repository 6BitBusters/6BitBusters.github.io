import * as THREE from "three";

export function Selection (mesh: THREE.InstancedMesh, id: number | null, h: boolean) {
    const highlightColor = new THREE.Color("white");
    if (mesh != undefined && id != null) {
      mesh.geometry.attributes.color.setXYZ(
        id,
        h
          ? highlightColor.r
          : mesh.geometry.attributes.colorBase.getX(id),
        h
          ? highlightColor.g
          : mesh.geometry.attributes.colorBase.getY(id),
        h
          ? highlightColor.b
          : mesh.geometry.attributes.colorBase.getZ(id),
      );
      mesh.geometry.attributes.color.needsUpdate = true;
    }
  };

export function RandomColors(): THREE.Color {
    const hue = Math.random();
    // Saturazione (da 0.5 a 1, colori più vivaci)
    const saturation = Math.random() * 0.5 + 0.5;
    // Luminosità (da 0.3 a 0.8, evita estremi)
    const lightness = Math.random() * 0.5 + 0.3;

    return new THREE.Color().setHSL(hue, saturation, lightness);
  };