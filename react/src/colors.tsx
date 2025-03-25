import { createTheme } from "@mui/material/styles";

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
