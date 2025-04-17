import { AveragePlaneProps } from "./props/AveragePlaneProps";
import * as THREE from "three";

function AveragePlane({ position, size }: AveragePlaneProps) {
  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      userData={{ id: "average" }}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        color="lightgray"
        transparent={true}
        opacity={0.4}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default AveragePlane;
