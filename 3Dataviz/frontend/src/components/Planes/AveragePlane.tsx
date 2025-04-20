import { AveragePlaneProps } from "./props/AveragePlaneProps";
import * as THREE from "three";

function AveragePlane({ position, size,isVisible }: AveragePlaneProps) {
  return (
    <mesh
    renderOrder={1}
      position={position.toArray()}
      rotation={[-Math.PI / 2, 0, 0]}
      userData={{ id: "average" }}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        color="lightgray"
        transparent={true}
        opacity={isVisible ? 0.6 : 0}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default AveragePlane;
