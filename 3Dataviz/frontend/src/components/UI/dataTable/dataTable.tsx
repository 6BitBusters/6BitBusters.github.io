import { useSelector } from "react-redux";
import "./dataTable.css";
import { useAppDispatch } from "../../../app/hooks";
import { useMemo } from "react";
import { filterByValue, selectorData } from "../../../features/data/dataSlice";
import { selectorIsGreater } from "../../../features/filterOption/filterOptionSlice";
import ExpanderButton from "../expanderButton/expanderButton";
import { setHit } from "../../../features/raycast/raycastHitSlice";

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

  const handleCellClick = (value: number, id: number) => {
    dispatch(filterByValue({ value: value, isGreater: isGreater }));
    dispatch(setHit(id));
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
                    const dataId = data.data.find(
                      (d) => d.x === i && d.z === j && d.y === value,
                    );
                    const id = i * row.length + j;
                    return value == undefined || dataId == undefined ? (
                      <td key={id} data-testid={id.toString()}></td>
                    ) : (
                      <td
                        key={id}
                        data-testid={id.toString()}
                        data-mianonna={
                          data.data.find(
                            (d) => d.x === i && d.z === j && d.y === value,
                          )?.id
                        }
                        id={id.toString()}
                        onClick={() => handleCellClick(value, dataId.id)}
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
