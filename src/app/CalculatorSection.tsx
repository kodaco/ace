"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { CostEstimator } from "@/features/core/components";

export function CalculatorSection() {
  const [compareMode, setCompareMode] = useState(false);

  return (
    <div id="calculator">
      {/* Compare toggle */}
      <Container maxWidth="md" sx={{ pt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          size="small"
          variant={compareMode ? "contained" : "outlined"}
          startIcon={<CompareArrowsIcon fontSize="small" />}
          onClick={() => setCompareMode((prev) => !prev)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          {compareMode ? "Exit compare mode" : "Compare two estimates"}
        </Button>
      </Container>

      {compareMode ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 0,
            alignItems: "start",
            "& > *": {
              borderRight: { lg: "1px solid" },
              borderColor: { lg: "divider" },
              "&:last-child": { borderRight: "none" },
            },
          }}
        >
          <CostEstimator label="Estimate A" />
          <CostEstimator label="Estimate B" />
        </Box>
      ) : (
        <CostEstimator />
      )}
    </div>
  );
}
