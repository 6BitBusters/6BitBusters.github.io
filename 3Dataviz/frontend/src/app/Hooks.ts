import { useDispatch } from "react-redux";
import type { AppDispatch } from "./Store";

// utile in quanto non richiede la tipizzazione quando si utilizza la funzione 'dispatch()'
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
