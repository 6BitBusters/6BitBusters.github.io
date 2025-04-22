import { useSelector } from "react-redux";
import { AveragePlaneProps } from "./props/AveragePlaneProps";
import * as THREE from "three";
import { selectorViewOptionState } from "../../features/ViewOption/ViewOptionSlice";

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
        opacity={viewPlane ? 0.6 : 0}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default AveragePlane;
