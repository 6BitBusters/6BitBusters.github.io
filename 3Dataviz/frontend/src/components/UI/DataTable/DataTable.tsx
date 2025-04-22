import { useSelector } from "react-redux";
import "./DataTable.css";
import { useAppDispatch } from "../../../app/Hooks";
import { useMemo } from "react";
import { filterByValue, selectorData } from "../../../features/Data/DataSlice";
import { selectorIsGreater } from "../../../features/FilterOption/FilterOptionSlice";
import ExpanderButton from "../ExpanderButton/ExpanderButton";

function DataTable() {
  const data = useSelector(selectorData);
  const isGreater = useSelector(selectorIsGreater);
  const dispatch = useAppDispatch();

  //usememo viene utilizzata per calcolare tabledata, array bidimensionale che rappresenta i valori della tabella, eseguito solo quando data cambia
  const tableData = useMemo(() => {
    const result: number[][] = [];
    const nLabel = data.x.length;
    for (let i = 0; i < nLabel; i++) {
      result.push(new Array(data.z.length).fill(undefined));
      data.data
        .filter((d) => d.x === i)
        .sort((a, b) => a.z - b.z)
        .forEach((d) => (result[i][d.z] = d.y));
    }
    return result;
  }, [data.data, data.x.length, data.z.length]);

  const handleCellClick = (value: number) => {
    dispatch(filterByValue({ value: value, isGreater: isGreater }));
  };

  return (
    <>
      <div id="table-container" data-testid="table-container">
        <ExpanderButton
          id="filter-options-expander"
          target="#table-container"
          fromToY={[0, -325]}
        />
        <div id="table-wrap">
          <table data-testid="data-table">
            <thead>
              <tr>
                <th></th>
                {data.z.map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i}>
                  <th>{data.x[i]}</th>
                  {row.map((value, j) => {
                    const isVisible = data.data.some(
                      (d) => d.x === i && d.z === j && d.y === value && d.show,
                    );
                    const id = i * row.length + j;
                    return value == undefined ? (
                      <td key={id} data-testid={id.toString()}></td>
                    ) : (
                      <td
                        key={id}
                        data-testid={id.toString()}
                        id={id.toString()}
                        onClick={() => handleCellClick(value)}
                        className={isVisible ? "hcell" : "nhcell"}>
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
