import React, { useState } from "react";
import axios from "axios";
import { Button, CircularProgress, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./main";

export const Upload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>([]);
  const [errors, setErrors] = useState<any>([]);

  const handleFileSelect = (e) => {
    const arr = Array.from(e.target.files);
    setUploadedFiles(arr);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!uploadedFiles.length) return;

    const formData = new FormData();
    uploadedFiles.forEach((file) => formData.append("file", file));
    setErrors([]);
    try {
      // Upload the file
      setIsLoading(true);
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.responses || []); // Ensure responses is an array
      setIsLoading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      // Ensure errors is always an array
      const errorMessages = error.response?.data?.errors
        ? error.response.data.errors
        : error.response?.data?.message
        ? [error.response.data.message]
        : error.message
        ? [error.message]
        : ["Error uploading file"];

      setErrors(errorMessages);
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <div
          style={{
            paddingTop: 40,
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "95%",
              maxWidth: 800,
              textAlign: "left",
            }}
          >
            <Typography variant="h5" style={{ marginBottom: "12px" }}>
              File Upload
            </Typography>
            <Typography variant="body2" style={{ marginBottom: "12px" }}>
              Upload file to get processed and sent to the Pinecone database
              that trains the AI answer tool. Accepted file formats: ".pdf",
              ".docx"
            </Typography>
            <div
              style={{
                paddingTop: 0,
                paddingBottom: 30,
                display: "flex",
                flexFlow: "column",
                gap: "12px",
              }}
            >
              <Button variant="outlined" color="primary" component="label">
                Select File
                <input
                  type="file"
                  hidden
                  onChange={handleFileSelect}
                  multiple
                  accept=".pdf,.docx"
                />
              </Button>
              <div>
                {uploadedFiles.length > 0 &&
                  Array.from(uploadedFiles).map((file: any, index) => (
                    <Typography
                      key={index}
                      style={{
                        maxWidth: 900,
                        whiteSpace: "pre-line",
                      }}
                      variant="body2"
                    >
                      {file.name}
                    </Typography>
                  ))}
              </div>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleFileUpload}
              >
                Upload
              </Button>
            </div>
            {!isLoading && Array.isArray(errors) && errors.length > 0 && (
              <div>
                <h1>Errors</h1>
                {errors.map((error, index) => (
                  <Typography
                    key={index}
                    style={{
                      maxWidth: 900,
                      whiteSpace: "pre-line",
                    }}
                    variant="body2"
                  >
                    {error}
                  </Typography>
                ))}
              </div>
            )}
            <div
              style={{
                display: "flex",
                marginBottom: 20,
              }}
            >
              {isLoading ? (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                </div>
              ) : result.length > 0 ? (
                <div>
                  {result.map((file, index) => (
                    <div key={index}>
                      <h1>{file.name}</h1>
                      {Array.isArray(file.texts) &&
                        file.texts.map((text: any, textIndex: number) => (
                          <Typography
                            key={textIndex}
                            style={{
                              maxWidth: 900,
                              whiteSpace: "pre-line",
                            }}
                            variant="body2"
                          >
                            {text}
                          </Typography>
                        ))}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
};
