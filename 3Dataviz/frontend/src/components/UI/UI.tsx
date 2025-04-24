import Options from "./options/options";
import DataTable from "./dataTable/dataTable";
import "./UI.css";
import { uiProps } from "./uiProps";

function UI({ datasetName, resetCamera }: uiProps) {
  return (
    <>
      <p id="current-dataset" data-testid="current-dataset">
        {datasetName}
      </p>
      <DataTable />
      <Options />
      <button
        id="resetCamera"
        data-testid="resetCamera"
        onClick={resetCamera}></button>
    </>
  );
}

export default UI;
