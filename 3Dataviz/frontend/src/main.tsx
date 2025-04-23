import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/Store";
import HomePage from "./pages/homePage/homePage";
import EnvironmentPage from "./pages/environmentPage/environmentPage";
import ErrorPage from "./pages/errorPage/errorPage";

// Sono valide solo le routes "/" e "/environment". Per tutti gli altri URL l'utente verrà reindirizzato a ErrorPage.
const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/environment",
    Component: EnvironmentPage,
  },
  {
    path: "*",
    Component: ErrorPage,
  },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
