"use client";

import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {
  PREDEFINED_FEATURES,
  DEFAULT_HOURLY_RATE,
} from "@/features/core/data/predefined-features";
import { calculateEstimate } from "@/features/core/services/estimate-calculator";
import { EstimateResult } from "@/features/core/models";
import { HourlyRateInput } from "./HourlyRateInput";
import { FeatureList } from "./FeatureList";
import { EstimateResults } from "./EstimateResults";
import { BuildWithAiToggle } from "./BuildWithAiToggle";

const alwaysActiveIds = new Set(
  PREDEFINED_FEATURES.filter((f) => f.alwaysActive).map((f) => f.id),
);

const allFeatureIds = new Set(PREDEFINED_FEATURES.map((f) => f.id));

export function CostEstimator() {
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(
    () => new Set(alwaysActiveIds),
  );
  const [expandedFeatureIds, setExpandedFeatureIds] = useState<Set<string>>(
    new Set(),
  );
  const [hourlyRate, setHourlyRate] = useState<number>(DEFAULT_HOURLY_RATE);
  const [buildWithAi, setBuildWithAi] = useState(false);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);

  const handleToggleFeature = (featureId: string) => {
    if (alwaysActiveIds.has(featureId)) return;

    setSelectedFeatureIds((prev) => {
      const next = new Set(prev);
      if (next.has(featureId)) {
        next.delete(featureId);
      } else {
        next.add(featureId);
      }
      return next;
    });
    setEstimate(null);
  };

  const handleToggleExpand = (featureId: string) => {
    setExpandedFeatureIds((prev) => {
      const next = new Set(prev);
      if (next.has(featureId)) {
        next.delete(featureId);
      } else {
        next.add(featureId);
      }
      return next;
    });
  };

  const allSelected = selectedFeatureIds.size === allFeatureIds.size;
  const allExpanded = expandedFeatureIds.size === allFeatureIds.size;

  const handleSelectAll = () => {
    setSelectedFeatureIds(new Set(allFeatureIds));
    setEstimate(null);
  };

  const handleDeselectAll = () => {
    setSelectedFeatureIds(new Set(alwaysActiveIds));
    setEstimate(null);
  };

  const handleExpandAll = () => {
    setExpandedFeatureIds(new Set(allFeatureIds));
  };

  const handleCollapseAll = () => {
    setExpandedFeatureIds(new Set());
  };

  const handleToggleAi = () => {
    setBuildWithAi((prev) => !prev);
    setEstimate(null);
  };

  const handleCalculate = () => {
    const selectedFeatures = PREDEFINED_FEATURES.filter(
      (f) => f.alwaysActive || selectedFeatureIds.has(f.id),
    );
    setEstimate(calculateEstimate(selectedFeatures, hourlyRate, buildWithAi));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h3" component="h1" gutterBottom>
            App Cost Estimator
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select the features you need and get an instant cost estimate.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <HourlyRateInput value={hourlyRate} onChange={setHourlyRate} />
          <ButtonGroup size="small" variant="outlined">
            <Button onClick={allSelected ? handleDeselectAll : handleSelectAll}>
              {allSelected ? "Deselect All" : "Select All"}
            </Button>
            <Button
              onClick={allExpanded ? handleCollapseAll : handleExpandAll}
            >
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </ButtonGroup>
        </Box>

        <BuildWithAiToggle checked={buildWithAi} onChange={handleToggleAi} />

        <FeatureList
          features={PREDEFINED_FEATURES}
          selectedIds={selectedFeatureIds}
          expandedIds={expandedFeatureIds}
          buildWithAi={buildWithAi}
          onToggle={handleToggleFeature}
          onToggleExpand={handleToggleExpand}
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleCalculate}
          disabled={selectedFeatureIds.size === 0}
          fullWidth
        >
          Calculate Estimate
        </Button>

        {estimate && <EstimateResults estimate={estimate} />}
      </Stack>
    </Container>
  );
}
