import { useSelector } from "react-redux";
import Axes from "../Axes/Axes";
import Bars from "./Bars/Bars";
import { filterByValue, selectorData } from "../../features/Data/DataSlice";
import { selectorIsGreater } from "../../features/FilterOption/FilterOptionSlice";
import { useAppDispatch } from "../../app/Hooks";
import AveragePlane from "../Planes/AveragePlane";
import * as THREE from "three";
import Tooltip from "./Bars/Tooltip";
import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { selectorRaycastHit } from "../../features/Raycast/RaycastHitSlice";
import { BarChartProps } from "./Bars/props/BarChartProps";

function BarChart({ onSelectedBar }: BarChartProps) {
  const data = useSelector(selectorData);
  const raycastHit = useSelector(selectorRaycastHit).previousSelectedBarId;
  const filterOption = useSelector(selectorIsGreater);

  const dispatch = useAppDispatch();

  const { camera } = useThree();

  const unitFactor = 6;

  const [hoverBar, setHoverBar] = useState(0);

  const handleClick = (id: number) => {
    dispatch(
      filterByValue({ value: data.data[id].y, isGreater: filterOption }),
    );
  };

  useEffect(() => {
    if (raycastHit !== null) {
      const barPosition = new THREE.Vector3(
        data.data[raycastHit].x * 6 + 10,
        data.data[raycastHit].y + 15,
        data.data[raycastHit].z * 6 + 20,
      );
      const lookAt = new THREE.Vector3(
        data.data[raycastHit].x * 6 + 4,
        data.data[raycastHit].y / 2,
        data.data[raycastHit].z * 6 + 6,
      );
      onSelectedBar(barPosition, lookAt);
    }
  }, [raycastHit, camera, data.data, onSelectedBar]);

  return (
    <>
      <Bars
        data={data.data}
        clickHandler={handleClick}
        hoverHandler={setHoverBar}
      />
      <Axes
        x={data.x}
        y={data.data.map((d) => d.y)}
        z={data.z}
        unitFactor={unitFactor}
      />
      <AveragePlane
        position={
          new THREE.Vector3(
            (data.x.length * unitFactor) / 2,
            data.average,
            (data.z.length * unitFactor) / 2,
          )
        }
        size={[data.x.length * unitFactor, data.z.length * unitFactor]}
      />
      <Tooltip
        data={data.data[hoverBar]}
        legend={data!.legend}
        Zlabel={data.z[data.data[hoverBar].z]}
        Xlabel={data.x[data.data[hoverBar].x]}
      />
    </>
  );
}

export default BarChart;
