import { useSelector } from "react-redux";
import "./DataTable.css";
import { RootState } from "../../../app/Store";
import { useAppDispatch } from "../../../app/Hooks";
import { ChangeEvent, useMemo, useState } from "react";
import { gsap } from "gsap";

function DataTable() {
  const data = useSelector((state: RootState) => state.data);
  const dispatch = useAppDispatch();

  //usememo viene utilizzata per calcolare tabledata, array bidimensionale che rappresenta i valori della tabella, eseguito solo quando data cambia
  const tableData = useMemo(() => {
    const result: number[][] = [];
    const nLabel = data.x.length;
    for (let i = 0; i < nLabel; i++) {
      result.push([]);
      data.data
        .filter((d) => d.x === i) //ogni label corrisponde a una riga della tabella
        .sort((a, b) => a.z - b.z) //i valori sono ordinati e aggiunti alla riga corrispondente
        .forEach((d) => result[i].push(d.y));
    }
    return result;
  }, [data.data]);

  const ToggleExpand = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      gsap.to("#container", {
        y: -325,
        duration: 0.7,
        ease: "elastic.out(0.5,0.8)",
      });
    } else {
      gsap.to("#container", {
        y: 0,
        duration: 0.6,
        ease: "power4.out",
      });
    }
  };

  return (
    <>
      <div id="container">
        <div id="expand-btn">
          <input type="checkbox" id="expand" onChange={ToggleExpand} />
          <label htmlFor="expand" className="hide"></label>
        </div>
        <div id="table-container">
          <table>
            <thead>
              <tr>
                <th></th>
                {data.z.map((label) => (
                  <th key={label}>{label}</th>
                ))}
                {data.z.map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i}>
                  <th>{data.x[i]}</th>
                  {row.map((value, i) => {
                    const high = false;
                    const id = i * row.length + i;
                    return (
                      <td
                        key={id}
                        id={id.toString()}
                        onClick={() => {}}
                        className={high ? "hcell" : "nhcell"}>
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default DataTable;
