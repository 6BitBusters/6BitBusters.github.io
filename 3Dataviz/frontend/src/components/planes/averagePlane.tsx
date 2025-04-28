import { useSelector } from "react-redux";
import { AveragePlaneProps } from "./props/averagePlaneProps";
import * as THREE from "three";
import { selectorViewOptionState } from "../../features/viewOption/viewOptionSlice";

function AveragePlane({ position, size }: AveragePlaneProps) {
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
        opacity={viewPlane ? 0.7 : 0}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default AveragePlane;
