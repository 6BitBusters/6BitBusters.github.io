import Axis from "./Axis";
import { AxesProp } from "./props/AxesProp";
import * as THREE from 'three';
function Axes({x,y,z,unitFactor}:AxesProp) {
    // logica per creare l`asse Y
    const yMaxvalue:number =  Math.max(...y);
    const multiplesOfFive: string[] = [];
    for (let i = 0; i <= yMaxvalue; i += 5) {
        multiplesOfFive.push(i.toString());
    }

    return(
        <>
        <Axis 
        key={"XAxis"}
        labels={x}
        color={new THREE.Color("red")}
        endPoint={new THREE.Vector3(x.length* unitFactor, 0, 0)}
        placementFunction={(i)=>new THREE.Vector3(unitFactor * i + 5, -1, 0)}
        labelScale={1.5}
        />
        <Axis 
        key={"YAxis"}
        labels={multiplesOfFive}
        color={new THREE.Color("green")}
        endPoint={new THREE.Vector3(0, yMaxvalue + 2, 0)}
        placementFunction={(i)=>new THREE.Vector3(-.5, i * 5-.2, -.5)}
        labelScale={2}
        />
        <Axis 
        key={"ZAxis"}
        labels={z}
        color={new THREE.Color("blue")}
        endPoint={new THREE.Vector3(0, 0, z.length * unitFactor )}
        placementFunction={(i)=>new THREE.Vector3(0, -1, unitFactor * i + 5)}
        labelScale={1.5}
        />

        </>
    )
}

export default Axes;