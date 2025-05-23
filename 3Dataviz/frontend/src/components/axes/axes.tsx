import { useCallback } from "react";
import Axis from "./axis";
import { AxesProp } from "./props/axesProp";
import * as THREE from "three";
function Axes({ x, y, z, unitFactor }: AxesProp) {
  // logica per creare l`asse Y
  const yMaxvalue: number = Math.max(...y);
  const multiplesOfFive: string[] = [];
  for (let i = 0; i <= yMaxvalue; i += 5) {
    multiplesOfFive.push(i.toString());
  }

  const xPlacementFunction = useCallback(
    (i: number) => new THREE.Vector3(unitFactor * i + 5, -2, -1.5),
    [unitFactor],
  );
  const yPlacementFunction = useCallback(
    (i: number) => new THREE.Vector3(-0.5, i * 5 - 0.2, -0.5),
    [],
  );
  const zPlacementFunction = useCallback(
    (i: number) => new THREE.Vector3(-1.5, -2, unitFactor * i + 5),
    [unitFactor],
  );

  return (
    <>
      <Axis
        key={"XAxis"}
        labels={x}
        color={new THREE.Color("red")}
        endPoint={new THREE.Vector3(x.length * unitFactor, 0, 0)}
        placementFunction={xPlacementFunction}
        labelScale={2}
      />
      <Axis
        key={"YAxis"}
        labels={multiplesOfFive}
        color={new THREE.Color("green")}
        endPoint={new THREE.Vector3(0, yMaxvalue + 2, 0)}
        placementFunction={yPlacementFunction}
        labelScale={3}
      />
      <Axis
        key={"ZAxis"}
        labels={z}
        color={new THREE.Color("blue")}
        endPoint={new THREE.Vector3(0, 0, z.length * unitFactor + 2)}
        placementFunction={zPlacementFunction}
        labelScale={2}
      />
    </>
  );
}

export default Axes;
