import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store";

// utile in quanto non richiede la tipizzazione quando si utilizza la funzione 'dispatch()'

export const useAppDispatch: () => AppDispatch = useDispatch;
