import { useState } from "react";
import axios from "axios";
import "./App.css";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Download } from "./Download";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./colors";

function getRandomElement(list: any) {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}
const sampleQuestions = [
  "How can Salesforce improve sales reps’ productivity?",
  "How can UKG reduce an organization's payroll error rate?",
  "What are the financial benefits Zoho Creator delivers?",
  "How much can an organization benefit by moving from on-premises to the cloud?",
  "How can an organization quantify the returns of a predictive maintenance deployment?",
  "What is the quantified value of a dedicated SCP solution?",
];

export const Answers = ({
  url,
  access = false,
}: {
  url: any;
  access: boolean;
}) => {
  // new line start
  const label = getRandomElement(sampleQuestions);
  const [answer, setAnswer] = useState<any>(null);
  const [queryText, setQueryText] = useState<any>("");
  const [loading, setLoading] = useState<any>(false);
  const [question, setQuestion] = useState<any>(null);
  const [research, setResearch] = useState();
  let attempts = 0;

  const getData = async (question: any) => {
    setLoading(true);
    await axios
      .get(`${url}${question}`)
      .then((response) => {
        setAnswer(response?.data?.answer);
        setResearch(response?.data?.research);
        setLoading(false);
      })
      .catch((error) => {
        setAnswer(error.response.status);
        setResearch(error.response.status);
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
        const retry = () => {
          attempts = attempts + 1;
          if (attempts <= 3) {
            getData(question);
          } else {
            setLoading(false);
          }
        };
        setTimeout(retry, 500);
      });
  };
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        testing
        {/* <div
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
            <div
              style={{
                paddingTop: 0,
                paddingBottom: 30,
                display: "flex",
              }}
            >
              <TextField
                id="outlined-basic"
                variant="outlined"
                placeholder={label}
                style={{ marginRight: 20, width: "100%" }}
                onChange={(res) => setQuestion(res.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    getData(question);
                    setQueryText(question);
                  }
                }}
              />
              <Button
                disabled={loading}
                variant="outlined"
                color="primary"
                onClick={() => {
                  getData(question);
                  setQueryText(question);
                }}
              >
                Ask
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                marginBottom: 20,
              }}
            >
              {loading ? (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                </div>
              ) : answer ? (
                <Typography
                  style={{
                    maxWidth: 900,
                    whiteSpace: "pre-line",
                  }}
                  variant="body2"
                >
                  {answer}
                </Typography>
              ) : (
                <></>
              )}
            </div>
            {!loading && answer && access && research && (
              <Download
                question={queryText}
                answer={answer}
                research={research}
              />
            )}
          </div>
        </div> */}
      </ThemeProvider>
    </div>
  );
};
