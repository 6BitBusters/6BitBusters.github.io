import { useSelector } from "react-redux"
import Axes from "../Axes/Axes"
import Bars from "./Bars/Bars"
import { filterAboveValue, selectorData } from "../../features/Data/DataSlice"
import { useAppDispatch } from "../../app/Hooks";
import { RootState } from "../../app/Store";
import AveragePlane from "../Planes/AveragePlane";
import * as THREE from 'three';
import Tooltip from "./Bars/Tooltip";
import { useState } from "react";

function BarChart() {
    const data = useSelector((state:RootState)=>state.data);
    const dispatch = useAppDispatch();

    const unitFactor = 6;

    let [selectedBar,SetSelectedBar] = useState(0);

    const barClickHandler = (barId: number) => {
        console.log(barId);
        dispatch(filterAboveValue({value:data.data[barId].y,isGreater:true}))
    }
    return(
        <>
        <Bars data={data.data} clickHandler={barClickHandler} hoverHandler={SetSelectedBar}/>
        <Axes
        x={data.x}
        y={data.data.map(d=>d.y)}
        z={data.z}
        unitFactor={unitFactor}
        />
        {
        false 
        && 
        <AveragePlane 
        position={new THREE.Vector3(
            (data.x.length*unitFactor)/2,
            data.average,
            (data.z.length*unitFactor)/2
        )}
        size={[data.x.length*unitFactor,data.z.length*unitFactor]}/>
        }
        <Tooltip
        data={data.data[selectedBar]}
        legend={data!.legend}
        Zlabel={data.z[data.data[selectedBar].z]}
        Xlabel={data.x[data.data[selectedBar].x]}/>
        </>
    )
}

export default BarChart