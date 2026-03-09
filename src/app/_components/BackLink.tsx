"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export function BackLink() {
  return (
    <Box
      component={Link}
      href="/"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        mb: 3,
        textDecoration: "none",
        color: "text.secondary",
        fontSize: "0.875rem",
        "&:hover": { color: "text.primary" },
      }}
    >
      <ArrowBackIcon fontSize="inherit" />
      Back to home
    </Box>
  );
}
