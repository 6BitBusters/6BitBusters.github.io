import Options from "./Options/Options";
import DataTable from "./DataTable/DataTable";
import "./UI.css";
import { UIProps } from "./UIProps";

function UI({ datasetName, resetCamera }: UIProps) {
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
