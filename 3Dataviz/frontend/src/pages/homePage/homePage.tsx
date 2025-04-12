import "./homePage.css";
import Footer from "../../components/footer/footer";
import ApiSelector from "../../components/apiSelector/apiSelector";

function HomePage() {
  return (
    <>
      <div className="containerHome">
        <h1 id="homepageTitle">3DataViz</h1>
        <p>Seleziona un DataSet per visualizzarne i dati:</p>
        <ApiSelector></ApiSelector>
      </div>
      <div className="teamInfo">
        <h2>Informazioni sul progetto</h2>
        <p>
          Progetto di Ingegneria del software dell'Università di Padova per l'AA
          2024/2025 del team SixBitBusters (Gruppo 1) con l'azienda Sanmarco
          Informatica S.p.A.
        </p>
        <h2>Team</h2>
        <ul>
          <li>Bergamin Elia</li>
          <li>Chilese Elena</li>
          <li>Diviesti Filippo</li>
          <li>Djossa Edgar</li>
          <li>Pincin Matteo</li>
          <li>Soranzo Andrea</li>
        </ul>
        <h2>Contatti</h2>
        <p>
          Indirizzo email:{" "}
          <a href="mailto:6bitbusters@gmail.com">6bitbusters@gmail.com</a>
        </p>
      </div>
      <Footer></Footer>
    </>
  );
}

export default HomePage;
