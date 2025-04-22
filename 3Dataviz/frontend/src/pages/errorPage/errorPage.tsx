import { SerializedError } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { selectorAppState } from "../../features/AppStatus/AppSlice";
import "./errorPage.css";

function ErrorPage() {
  // Redux get error
  const appStateError: SerializedError | null =
    useSelector(selectorAppState).error;

  return (
    <>
      <div className="containerError">
        <h1 id="titleError">{appStateError ? appStateError?.code : 404}</h1>
        <h2>{appStateError ? appStateError?.name : "Server Error"}</h2>
        <p>
          {appStateError
            ? appStateError?.message
            : "Il contenuto che stai cercando non è stato trovato."}
        </p>
        <a href="/">Torna alla HomePage</a>
      </div>
    </>
  );
}

export default ErrorPage;
