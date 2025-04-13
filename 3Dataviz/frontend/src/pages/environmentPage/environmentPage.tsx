import "./environmentPage.css";
import Footer from "../../components/footer/footer";
import { useSelector } from "react-redux";
import { RootState } from "../../app/Store";

function EnvironmentPage() {
  const dataset = useSelector((state:RootState) => state.dataSource.currentDataset);
  console.log("dataset", dataset);
  return (
    <>
      <h1 id="APItitle">Nome API</h1>
      <a id="quitButton" href="/">
        ESCI
      </a>
      <div className="grid-container">
        <div className="ui">
          <h2>Filtri</h2>
          componente UI (tabella e filtri)
        </div>
        <div className="chart">
          <h2>grafico</h2>
          componente grafico
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default EnvironmentPage;
