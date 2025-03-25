// import { useRouteError } from "react-router-dom";
import "./index.css";

export default function ErrorPage() {
  // const error: any = useRouteError();
  return (
    <div style={{ margin: 20 }} id="error-page">
      <h1>Network Error</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>{/* <i>{error.statusText || error.message}</i> */}</p>
    </div>
  );
}
