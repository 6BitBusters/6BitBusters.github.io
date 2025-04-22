import { SerializedError } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { selectorAppState } from "../../features/AppStatus/AppSlice";
import "./errorPage.css";

function ErrorPage() {
  //METTERE DEFAULT 404
  // Redux get error
  const appStateError: SerializedError | null =
    useSelector(selectorAppState).error;

  return (
    <>
      <div className="containerError">
        <h1 id="titleError">{appStateError?.code}</h1>
        <h2>{appStateError?.name}</h2>
        <p>{appStateError?.message}</p>
        <a href="/">Torna alla HomePage</a>
      </div>
    </>
  );
}

export default ErrorPage;
