import * as React from "react";
import { Upload } from "./Upload.tsx";
import ErrorPage from "./ErrorPage.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const App = () => (
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>test</div>} />
        {/* <Route
          path="/answers"
          element={<Answers url={`${apiUrl}/api/answer/`} access={true} />}
        /> */}
        {/* <Route
          path="/preview"
          element={<Answers url={`${apiUrl}/api/preview/`} access={false} />}
        /> */}
        <Route path="/upload" element={<Upload />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

export default App;
