import { SerializedError } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import {
  resetError,
  selectorAppState,
} from "../../features/appStatus/appSlice";
import "./errorPage.css";
import { Link } from "react-router";
import { useAppDispatch } from "../../app/hooks";

function ErrorPage() {
  // Redux get error
  const appStateError: SerializedError | null =
    useSelector(selectorAppState).error;
  const dispatch = useAppDispatch();

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
        <Link to={"/"} onClick={() => dispatch(resetError())}>
          Torna alla HomePage
        </Link>
      </div>
    </>
  );
}

export default ErrorPage;
