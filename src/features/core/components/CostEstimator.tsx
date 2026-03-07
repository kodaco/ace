"use client";

import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import {
  PREDEFINED_FEATURES,
  DEFAULT_HOURLY_RATE,
} from "@/features/core/data/predefined-features";
import { PROVIDERS, Provider } from "@/features/core/data/providers";
import { calculateEstimate } from "@/features/core/services/estimate-calculator";
import { AppFeature, EstimateResult } from "@/features/core/models";
import { HourlyRateInput } from "./HourlyRateInput";
import { ProviderRateCard } from "./ProviderRateCard";
import { FeatureList } from "./FeatureList";
import { EstimateResults } from "./EstimateResults";
import { BuildWithAiToggle } from "./BuildWithAiToggle";
import { ShareEstimate } from "./ShareEstimate";

const FADE_MS = 380;

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
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [buildWithAi, setBuildWithAi] = useState(false);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [selectedFeaturesSnapshot, setSelectedFeaturesSnapshot] = useState<AppFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  // True when selections changed after the last calculation
  const [isStale, setIsStale] = useState(false);

  // Read provider from sessionStorage on mount
  useEffect(() => {
    const storedId = sessionStorage.getItem("selectedProviderId");
    if (storedId) {
      const provider = PROVIDERS.find((p) => p.id === storedId) ?? null;
      if (provider) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedProvider(provider);
        setHourlyRate(provider.hourlyRate);
      }
      sessionStorage.removeItem("selectedProviderId");
    }
  }, []);

  // Once results are shown, mark as stale instead of hiding
  const markStale = () => {
    if (showResults) setIsStale(true);
  };

  const handleToggleFeature = (featureId: string) => {
    /* istanbul ignore next */
    if (alwaysActiveIds.has(featureId)) return;
    setSelectedFeatureIds((prev) => {
      const next = new Set(prev);
      if (next.has(featureId)) next.delete(featureId);
      else next.add(featureId);
      return next;
    });
    markStale();
  };

  const handleToggleExpand = (featureId: string) => {
    setExpandedFeatureIds((prev) => {
      const next = new Set(prev);
      if (next.has(featureId)) next.delete(featureId);
      else next.add(featureId);
      return next;
    });
  };

  const allSelected = selectedFeatureIds.size === allFeatureIds.size;
  const allExpanded = expandedFeatureIds.size === allFeatureIds.size;

  const handleSelectAll = () => {
    setSelectedFeatureIds(new Set(allFeatureIds));
    markStale();
  };

  const handleDeselectAll = () => {
    setSelectedFeatureIds(new Set(alwaysActiveIds));
    markStale();
  };

  const handleExpandAll = () => setExpandedFeatureIds(new Set(allFeatureIds));
  const handleCollapseAll = () => setExpandedFeatureIds(new Set());

  const handleToggleAi = () => {
    setBuildWithAi((prev) => !prev);
    markStale();
  };

  const handleSetRate = (rate: number) => {
    setSelectedProvider(null);
    setHourlyRate(rate);
    handleCalculate(rate);
  };

  const handleCalculate = (rateOverride?: number) => {
    const rate = rateOverride ?? hourlyRate;
    const selectedFeatures = PREDEFINED_FEATURES.filter(
      (f) => f.alwaysActive || selectedFeatureIds.has(f.id),
    );
    setIsStale(false);
    setLoading(true);
    setTimeout(() => {
      setEstimate(calculateEstimate(selectedFeatures, rate, buildWithAi));
      setSelectedFeaturesSnapshot(selectedFeatures);
      setLoading(false);
      setShowResults(true);
    }, 900);
  };

  const showSkeleton = loading || isStale;

  const buttonLabel = loading
    ? "Calculating…"
    : isStale
    ? "Recalculate Estimate"
    : "Calculate Estimate";

  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 10 }}>
      <Stack gap={6}>
        <FeatureList
          features={PREDEFINED_FEATURES}
          selectedIds={selectedFeatureIds}
          expandedIds={expandedFeatureIds}
          buildWithAi={buildWithAi}
          onToggle={handleToggleFeature}
          onToggleExpand={handleToggleExpand}
          allSelected={allSelected}
          allExpanded={allExpanded}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
        />

        <BuildWithAiToggle checked={buildWithAi} onChange={handleToggleAi} />

        {/* Hourly rate / provider card */}
        {selectedProvider ? (
          <ProviderRateCard provider={selectedProvider} onSetRate={handleSetRate} />
        ) : (
          <HourlyRateInput value={hourlyRate} onChange={(rate) => { setHourlyRate(rate); handleCalculate(rate); }} />
        )}

        <Button
          variant="contained"
          size="large"
          onClick={() => handleCalculate()}
          disabled={selectedFeatureIds.size === 0 || loading}
          fullWidth
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {buttonLabel}
        </Button>

        <Fade in={showResults} timeout={FADE_MS} unmountOnExit>
          <Box
            sx={{
              transform: showResults ? "translateY(0)" : "translateY(14px)",
              transition: `transform ${FADE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          >
            <Stack spacing={3}>
              <EstimateResults
                estimate={estimate}
                selectedFeatures={selectedFeaturesSnapshot}
                loading={showSkeleton}
              />
              {/* <ShareEstimate
                estimate={estimate}
                selectedFeatures={selectedFeaturesSnapshot}
                loading={showSkeleton}
              /> */}
            </Stack>
          </Box>
        </Fade>
      </Stack>
    </Container>
  );
}
