import { useSelector } from "react-redux";
import Axes from "../Axes/Axes";
import Bars from "./Bars/Bars";
import { filterByValue, selectorData } from "../../features/Data/DataSlice";
import { useAppDispatch } from "../../app/Hooks";
import AveragePlane from "../Planes/AveragePlane";
import * as THREE from "three";
import Tooltip from "./Bars/Tooltip";
import { useEffect, useState } from "react";
import { selectorViewOptionState } from "../../features/ViewOption/ViewOptionSlice";
import { useThree } from "@react-three/fiber";

type BarChartProps = {
  onSelectedBar: (cameraPosition: THREE.Vector3, lookAt: THREE.Vector3) => void;
};

function BarChart({ onSelectedBar }: BarChartProps) {
  const data = useSelector(selectorData);
  const viewPlane = useSelector(selectorViewOptionState);
  const dispatch = useAppDispatch();

  const { camera } = useThree();

  const unitFactor = 6;

  const [selectedBar, setSelectedBar] = useState(-1);
  const [hoverBar, setHoverBar] = useState(0);

  const handleClick = (id:number) => {
    setSelectedBar(id)
    dispatch(
      filterByValue({ value: data.data[id].y, isGreater: true }),
    );
  }

  useEffect(() => {
    if (selectedBar >= 0) {
      const barPosition = new THREE.Vector3(
        data.data[selectedBar].x * 6 + 10,
        data.data[selectedBar].y + 15,
        data.data[selectedBar].z * 6 + 20,
      );
      const lookAt = new THREE.Vector3(
        data.data[selectedBar].x * 6 + 4,
        data.data[selectedBar].y / 2,
        data.data[selectedBar].z * 6 + 6,
      );
      onSelectedBar(barPosition, lookAt);
    }
  }, [selectedBar, camera, data.data, onSelectedBar]);

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
        isVisible={viewPlane}
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
