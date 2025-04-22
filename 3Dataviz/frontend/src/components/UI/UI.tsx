import Options from "./Options/Options";
import DataTable from "./DataTable/DataTable";
import "./UI.css";

type UIProps = {
  resetCamera: () => void;
};

function UI({ resetCamera }: UIProps) {
  return (
    <>
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
