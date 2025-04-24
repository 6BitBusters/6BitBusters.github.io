import { useSelector } from "react-redux";
import { averagePlaneProps } from "./props/averagePlaneProps";
import * as THREE from "three";
import { selectorViewOptionState } from "../../features/viewOption/viewOptionSlice";

function AveragePlane({ position, size }: averagePlaneProps) {
  const viewPlane = useSelector(selectorViewOptionState);
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
        opacity={viewPlane ? 0.6 : 0}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default AveragePlane;
