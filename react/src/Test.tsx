import { useState } from "react";
import "./App.css";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Download } from "./Download";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./colors";

function getRandomElement<T>(list: T[]): T {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

const sampleQuestions = [
  "How can Salesforce improve sales reps' productivity?",
  "How can UKG reduce an organization's payroll error rate?",
  "What are the financial benefits Zoho Creator delivers?",
  "How much can an organization benefit by moving from on-premises to the cloud?",
  "How can an organization quantify the returns of a predictive maintenance deployment?",
  "What is the quantified value of a dedicated SCP solution?",
];

const staticAnswer = `Amplitude provides several benefits to organizations, including:
1. A 42% increase in revenue per order.
2. Reduced software costs by consolidating analytics on a single platform.
3. Reinvested time for analyst teams, improving efficiency in reporting processes.
4. Increased overall operational efficiency, aiding in securing investment funding.
5. An 80% increase in employee productivity by streamlining customer behavior evaluation and analytics.
6. Reduced project lifecycle and improvements in customer insights.
7. Reduced manual processes and provided enterprise-scale performance.
8. Simplified analytical processes for developers and data analysts, enabling non-technical users to extract insights.
9. Increased employee productivity by 78% across product management, data analyst, and marketing teams.
10. Improved decision-making capabilities for upper-level management.
11. A 46% increase in purchase conversion percentage.
12. Time savings with analysis time reduced by over 90%, turning days of work into minutes.
13. Acceleration in experiment speeds by 1.5 to 2 times.
14. A 10 times improvement in user leads generated through experiments for a real estate information provider.
15. A software development company exceeded their annual recurring revenue target by 40% due to growth experiments enabled by Amplitude.
16. Improved decision-making with in-depth analytics and insights on customer behavior trends.
17. Enhanced ability to read the individual customer journey, leading to better decision-making.
18. An average ROI of 655% and an average payback period of 4.8 months.
19. A 20% increase in average spend per user and a doubling of the conversion rate after implementation.
20. A fivefold acceleration in the process of writing queries.
21. Saved five hours per week per employee on the data science side by streamlining data analysis processes.`;

export const Test = ({ access = false }: { access: boolean }) => {
  const label = getRandomElement(sampleQuestions);
  const [answer, setAnswer] = useState<string | null>(null);
  const [queryText, setQueryText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");

  const getData = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setAnswer(staticAnswer);
      setLoading(false);
    }, 500);
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
                    getData();
                    setQueryText(question);
                  }
                }}
              />
              <Button
                disabled={loading}
                variant="outlined"
                color="primary"
                onClick={() => {
                  getData();
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
            {!loading && answer && access && (
              <Download
                question={queryText}
                answer={answer}
                research={"x1, x2, Benchmark Data"}
              />
            )}
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
};
