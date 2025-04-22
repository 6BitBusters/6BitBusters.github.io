import "./environmentPage.css";
import { useSelector } from "react-redux";
import { RootState } from "../../app/Store";

function EnvironmentPage() {
  const dataset = useSelector(
    (state: RootState) => state.dataSource.currentDataset,
  );
  return (
    <>
      <h1 id="APItitle">Nome API : {dataset?.name}</h1>
      <a id="quitButton" href="/">
        ESCI
      </a>
    </>
  );
}

export default EnvironmentPage;
