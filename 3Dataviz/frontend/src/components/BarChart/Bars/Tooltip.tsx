import { useSelector } from "react-redux";
import { RootState } from "../../../app/Store";
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Data } from "../../../features/Data/interfaces/Data";
import { Legend } from "../../../features/Data/types/Legend";

type ToolTipProps = {
    data: Data,
    legend:Legend | null
    Xlabel: string,
    Zlabel: string,
}

function Tooltip({data,legend,Xlabel,Zlabel}:ToolTipProps) {

    const raycastState = useSelector((state: RootState) => state.raycast);

    return (
        raycastState.barTooltipPosition !== null &&
        <Html 
        position={new THREE.Vector3(raycastState.barTooltipPosition[0],raycastState.barTooltipPosition[1],raycastState.barTooltipPosition[2])}
        key={data.id}>
          <div style={{ background: "white", width: "150px",
            padding: "3px", borderRadius: "5px", 
            boxShadow: "0 0 5px rgba(0,0,0,0.3)" }}>
            {legend?.y}: {data.y} <br />
            {legend?.z}: {Zlabel} <br />
            {legend?.x}: {Xlabel}
          </div>
        </Html>
        
    );
}

export default Tooltip;