"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#818cf8",
      main: "#6366f1",
      dark: "#4f46e5",
      contrastText: "#ffffff",
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Roboto, Arial, sans-serif",
  },
});

export default theme;
