import "./environmentPage.css";
import { useSelector } from "react-redux";
import { selectorCurrentDataset } from "../../features/DataSource/DataSourceSlice";

function EnvironmentPage() {
  const dataset = useSelector(selectorCurrentDataset);
  return (
    <>
      <h1 id="APItitle">{dataset?.name}</h1>
      <a id="quitButton" href="/">
        ESCI
      </a>
    </>
  );
}

export default EnvironmentPage;
