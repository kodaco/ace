"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: "var(--font-geist-sans), Roboto, Arial, sans-serif",
  },
});

export default theme;
