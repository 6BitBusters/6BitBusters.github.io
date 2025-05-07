import { useSelector } from "react-redux";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { selectorRaycastHit } from "../../../features/raycast/raycastHitSlice";
import { TooltipProps } from "./props/tooltipProps";

function Tooltip({ data, legend, Xlabel, Zlabel }: TooltipProps) {
  const raycastState = useSelector(selectorRaycastHit);

  return (
    raycastState?.barTooltipPosition !== null && (
      <Html
        style={{
          width: "500px",
        }}
        position={new THREE.Vector3(
          raycastState?.barTooltipPosition[0],
          raycastState?.barTooltipPosition[1],
          raycastState?.barTooltipPosition[2],
        ).toArray()}
        key={data.id}>
        <div
          style={{
            background: "white",
            width: "fit-content",
            padding: "3px",
            borderRadius: "5px",
            boxShadow: "0 0 5px rgba(0,0,0,0.3)",
          }}>
          {legend?.y}: {data.y} <br />
          {legend?.z}: {Zlabel} <br />
          {legend?.x}: {Xlabel}
        </div>
      </Html>
    )
  );
}

export default Tooltip;
