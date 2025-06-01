import * as React from "react";
import { Upload } from "./Upload";
import { Answers } from "./Answers";
import ErrorPage from "./ErrorPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Test } from "./Test";

// const apiUrl = import.meta.env.VITE_API_URL;

const App = () => (
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route
          path="/answers"
          element={<Answers url={`/api/answer/`} access={true} />}
        />
        <Route
          path="/preview"
          element={<Answers url={`/api/preview/`} access={false} />}
        />
        <Route path="/upload" element={<Upload />} />
        <Route path="/test" element={<Test access={true} />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

export default App;
