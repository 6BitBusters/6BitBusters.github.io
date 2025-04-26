import { useMemo, useRef } from "react";
import { AxisProp } from "./props/axisProp";
import * as THREE from "three";
import { Line } from "@react-three/drei";

// IMPLEMENTAZIONE DA TESTARE CON GRANDI DATI
function Axis({
  labels,
  color,
  endPoint,
  placementFunction,
  labelScale = 1,
}: AxisProp) {
  const spriteRefs = useRef<(THREE.Sprite | null)[]>([]);

  const labelSprites = useMemo(() => {
    return labels.map((text, index) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.width = 296 * 4;
      canvas.height = 64 * 4;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = "bold 80px Arial";
      context.fillStyle = "white";
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearMipMapNearestFilter;
      texture.magFilter = THREE.LinearFilter;
      const position = placementFunction(index);
      const rotation = new THREE.Euler(0, Math.PI, 0, "XYZ");
      return { text, position, rotation, texture };
    });
  }, [labels, placementFunction]);

  return (
    <>
      <Line
        points={[
          // .01 fix per z-fighting
          new THREE.Vector3(0, 0.01, 0),
          endPoint,
        ]}
        color={color}
        lineWidth={4}
        renderOrder={1}
      />
      {labelSprites.map((text, index) => (
        <sprite
          renderOrder={1}
          key={text.text}
          position={text.position}
          scale={[8 * labelScale, 2 * labelScale, 2 * labelScale]}
          ref={(el) => (spriteRefs.current[index] = el)}>
          <spriteMaterial
            map={text.texture}
            depthTest={true}
            transparent={true}
          />
        </sprite>
      ))}
    </>
  );
}

export default Axis;
