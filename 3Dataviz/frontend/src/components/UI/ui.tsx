import Options from "./options/options";
import DataTable from "./dataTable/dataTable";
import "./ui.css";
import { UIProps } from "./uiProps";
import Legend from "./legend/legend";

function UI({ datasetName, resetCamera }: UIProps) {
  return (
    <>
      <p id="current-dataset" data-testid="current-dataset">
        {datasetName}
      </p>
      <DataTable />
      <Options />
      <Legend />
      <button
        id="resetCamera"
        data-testid="resetCamera"
        onClick={resetCamera}></button>
    </>
  );
}

export default UI;
