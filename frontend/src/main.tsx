import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createTheme } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Answers } from "./Answers.js";
import { Upload } from "./Upload.tsx";
import ErrorPage from "./ErrorPage.js";

const colors = {
  main: "#DA291C",
};
export const theme = createTheme({
  palette: {
    primary: {
      main: colors.main,
      contrastText: "#242105",
    },
  },
  typography: {
    h1: {
      fontFamily: "Arial",
      fontSize: 23.5,
      fontWeight: 600,
      color: colors.main,
    },
    body1: {
      fontFamily: "Arial",
      fontSize: 13.5,
      fontWeight: 500,
    },
    body2: {
      fontFamily: "Arial",
      fontSize: 13.5,
      fontWeight: 500,
    },
  },
});
const apiUrl = import.meta.env.VITE_API_URL;
const router = createBrowserRouter([
  {
    path: "/answers",
    element: <Answers url={`${apiUrl}/api/answer/`} access={true} />,
  },
  {
    path: "/preview",
    element: <Answers url={`${apiUrl}/api/preview/`} access={false} />,
  },
  {
    path: "/upload",
    element: <Upload />,
  },
  {
    errorElement: <ErrorPage />,
  },
]);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
