import { useSelector } from "react-redux";
import Axes from "../Axes/Axes";
import Bars from "./Bars/Bars";
import { filterByValue, selectorData } from "../../features/Data/DataSlice";
import { useAppDispatch } from "../../app/Hooks";
import AveragePlane from "../Planes/AveragePlane";
import * as THREE from "three";
import Tooltip from "./Bars/Tooltip";
import { useState } from "react";
import { selectorViewOptionState } from "../../features/ViewOption/ViewOptionSlice";

function BarChart() {
  const data = useSelector(selectorData);
  const viewPlane = useSelector(selectorViewOptionState)
  const dispatch = useAppDispatch();

  const unitFactor = 6;

  const [selectedBar, setSelectedBar] = useState(0);

  const barClickHandler = (barId: number) => {
    dispatch(filterByValue({ value: data.data[barId].y, isGreater: true }));
  };
  return (
    <>
      <Bars
        data={data.data}
        clickHandler={barClickHandler}
        hoverHandler={setSelectedBar}
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
        data={data.data[selectedBar]}
        legend={data!.legend}
        Zlabel={data.z[data.data[selectedBar].z]}
        Xlabel={data.x[data.data[selectedBar].x]}
      />
    </>
  );
}

export default BarChart;
