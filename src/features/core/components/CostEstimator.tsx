"use client";

import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import {
  PREDEFINED_FEATURES,
  DEFAULT_HOURLY_RATE,
} from "@/features/core/data/predefined-features";
import { PROVIDERS, Provider } from "@/features/core/data/providers";
import { calculateEstimate } from "@/features/core/services/estimate-calculator";
import { encodeEstimateState, decodeEstimateState } from "@/features/core/services/estimate-url";
import { AppFeature, EstimateResult } from "@/features/core/models";
import { HourlyRateInput } from "./HourlyRateInput";
import { ProviderRateCard } from "./ProviderRateCard";
import { FeatureList } from "./FeatureList";
import { EstimateResults } from "./EstimateResults";
import { BuildWithAiToggle } from "./BuildWithAiToggle";
import { ProjectPresets } from "./ProjectPresets";
import { CustomFeatureInput } from "./CustomFeatureInput";
import { PlatformSelector, Platform, PLATFORM_MULTIPLIERS } from "./PlatformSelector";
import { SavedEstimatesDrawer } from "./SavedEstimatesDrawer";
import { AppPreset, PRESETS } from "@/features/core/data/presets";
import { Currency, DEFAULT_CURRENCY, CURRENCIES } from "@/features/core/data/currencies";
import {
  getSavedEstimates,
  saveEstimate,
  deleteSavedEstimate,
  SavedEstimate,
} from "@/features/core/services/estimate-storage";

const FADE_MS = 380;

const alwaysActiveIds = new Set(
  PREDEFINED_FEATURES.filter((f) => f.alwaysActive).map((f) => f.id),
);

const allFeatureIds = new Set(PREDEFINED_FEATURES.map((f) => f.id));

const validFeatureIds = new Set(PREDEFINED_FEATURES.map((f) => f.id));

function getInitialStateFromUrl(): { featureIds: Set<string>; rate: number; ai: boolean } | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("e");
    if (!encoded) return null;
    const decoded = decodeEstimateState(encoded);
    if (!decoded) return null;
    const featureIds = new Set(
      decoded.featureIds.filter((id) => validFeatureIds.has(id) || id.startsWith("custom-")),
    );
    // Always include always-active features
    alwaysActiveIds.forEach((id) => featureIds.add(id));
    return { featureIds, rate: decoded.rate, ai: decoded.ai };
  } catch {
    return null;
  }
}

interface CostEstimatorProps {
  label?: string;
}

export function CostEstimator({ label }: CostEstimatorProps = {}) {
  const urlState = getInitialStateFromUrl();

  const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(
    () => urlState?.featureIds ?? new Set(alwaysActiveIds),
  );
  const [expandedFeatureIds, setExpandedFeatureIds] = useState<Set<string>>(
    new Set(),
  );
  const [hourlyRate, setHourlyRate] = useState<number>(urlState?.rate ?? DEFAULT_HOURLY_RATE);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [buildWithAi, setBuildWithAi] = useState(urlState?.ai ?? false);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [selectedFeaturesSnapshot, setSelectedFeaturesSnapshot] = useState<AppFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  // True when selections changed after the last calculation
  const [isStale, setIsStale] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [customFeatures, setCustomFeatures] = useState<AppFeature[]>([]);
  const [platform, setPlatform] = useState<Platform>("web");
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [savedEstimates, setSavedEstimates] = useState<SavedEstimate[]>(() => getSavedEstimates());
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Auto-calculate on mount when URL state was present (restoring a shared link)
  useEffect(() => {
    if (urlState) {
      handleCalculate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync calculator state to URL query param
  useEffect(() => {
    const nonAlwaysActive = [...selectedFeatureIds].filter(
      (id) => !alwaysActiveIds.has(id),
    );
    const encoded = encodeEstimateState({
      featureIds: nonAlwaysActive,
      rate: hourlyRate,
      ai: buildWithAi,
    });
    const url = new URL(window.location.href);
    url.searchParams.set("e", encoded);
    window.history.replaceState(null, "", url.toString());
  }, [selectedFeatureIds, hourlyRate, buildWithAi]);

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
    setActivePresetId(null);
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

  const handleAddCustomFeature = (feature: AppFeature) => {
    setCustomFeatures((prev) => [...prev, feature]);
    setSelectedFeatureIds((prev) => new Set([...prev, feature.id]));
    markStale();
  };

  const handleRemoveCustomFeature = (featureId: string) => {
    setCustomFeatures((prev) => prev.filter((f) => f.id !== featureId));
    setSelectedFeatureIds((prev) => {
      const next = new Set(prev);
      next.delete(featureId);
      return next;
    });
    markStale();
  };

  const handleSelectPreset = (preset: AppPreset) => {
    if (activePresetId === preset.id) {
      // Deselect: revert to only always-active features
      setActivePresetId(null);
      setSelectedFeatureIds(new Set(alwaysActiveIds));
    } else {
      setActivePresetId(preset.id);
      const ids = new Set([...alwaysActiveIds, ...preset.featureIds]);
      setSelectedFeatureIds(ids);
    }
    markStale();
  };

  const handleSaveEstimate = (name: string) => {
    if (!estimate) return;
    const midpoint = Math.round((estimate.minCost + estimate.maxCost) / 2);
    const entry = saveEstimate(
      name,
      {
        featureIds: [...selectedFeatureIds].filter((id) => !alwaysActiveIds.has(id)),
        customFeatures: customFeatures.map((f) => ({
          id: f.id,
          name: f.name,
          minHours: f.minHours,
          maxHours: f.maxHours,
        })),
        rate: hourlyRate,
        ai: buildWithAi,
        platform,
        currencyCode: currency.code,
      },
      estimate.featureCount,
      midpoint,
    );
    setSavedEstimates((prev) => [entry, ...prev].slice(0, 5));
  };

  const handleLoadSaved = (saved: SavedEstimate) => {
    const { config } = saved;
    const ids = new Set([
      ...alwaysActiveIds,
      ...config.featureIds.filter((id) => validFeatureIds.has(id)),
    ]);
    const restored: AppFeature[] = config.customFeatures.map((cf) => ({
      id: cf.id,
      name: cf.name,
      description: "Custom feature",
      details: "",
      factors: "",
      minHours: cf.minHours,
      maxHours: cf.maxHours,
      category: "advanced" as const,
    }));
    restored.forEach((f) => ids.add(f.id));
    setCustomFeatures(restored);
    setSelectedFeatureIds(ids);
    setHourlyRate(config.rate);
    setBuildWithAi(config.ai);
    setPlatform(config.platform as Platform);
    const cur = CURRENCIES.find((c) => c.code === config.currencyCode) ?? DEFAULT_CURRENCY;
    setCurrency(cur);
    setActivePresetId(null);
    setEstimate(null);
    setShowResults(false);
    setIsStale(false);
  };

  const handleDeleteSaved = (id: string) => {
    deleteSavedEstimate(id);
    setSavedEstimates((prev) => prev.filter((e) => e.id !== id));
  };

  const handlePlatformChange = (p: Platform) => {
    setPlatform(p);
    // Auto-clear the active preset if it's incompatible with the new platform
    if (activePresetId) {
      const preset = PRESETS.find((pr) => pr.id === activePresetId);
      if (preset?.disabledForPlatforms?.includes(p)) {
        setActivePresetId(null);
        setSelectedFeatureIds(new Set(alwaysActiveIds));
      }
    }
    markStale();
  };

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
    const predefinedSelected = PREDEFINED_FEATURES.filter(
      (f) => f.alwaysActive || selectedFeatureIds.has(f.id),
    );
    const customSelected = customFeatures.filter((f) => selectedFeatureIds.has(f.id));
    const selectedFeatures = [...predefinedSelected, ...customSelected];
    setIsStale(false);
    setLoading(true);
    setTimeout(() => {
      setEstimate(calculateEstimate(selectedFeatures, rate, buildWithAi, PLATFORM_MULTIPLIERS[platform]));
      setSelectedFeaturesSnapshot(selectedFeatures);
      setLoading(false);
      setShowResults(true);
      // Scroll to results after they appear
      requestAnimationFrame(() => {
        document.getElementById("estimate-output")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
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
      {label && (
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, pb: 1.5, borderBottom: "2px solid", borderColor: "primary.main" }}>
          {label}
        </Typography>
      )}
      <Stack gap={6}>
        <PlatformSelector value={platform} onChange={handlePlatformChange} />

        <ProjectPresets
          activePresetId={activePresetId}
          platform={platform}
          onSelect={handleSelectPreset}
        />

        <FeatureList
          features={[...PREDEFINED_FEATURES, ...customFeatures]}
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
          onRemove={handleRemoveCustomFeature}
          advancedExtra={
            <CustomFeatureInput onAdd={handleAddCustomFeature} />
          }
        />

        <BuildWithAiToggle checked={buildWithAi} onChange={handleToggleAi} />

        {/* Hourly rate / provider card */}
        {selectedProvider ? (
          <ProviderRateCard provider={selectedProvider} onSetRate={handleSetRate} />
        ) : (
          <HourlyRateInput
            value={hourlyRate}
            onChange={(rate) => { setHourlyRate(rate); handleCalculate(rate); }}
            currency={currency}
            onCurrencyChange={setCurrency}
          />
        )}

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Button
            data-testid="calculate-btn"
            variant="contained"
            size="large"
            onClick={() => handleCalculate()}
            disabled={selectedFeatureIds.size === 0 || loading}
            sx={{ flex: 1 }}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {buttonLabel}
          </Button>
          <Button
            data-testid="saved-btn"
            variant="outlined"
            size="large"
            onClick={() => setDrawerOpen(true)}
            sx={{ textTransform: "none", whiteSpace: "nowrap" }}
          >
            Saved ({savedEstimates.length})
          </Button>
        </Box>

        <Fade in={showResults} timeout={FADE_MS} unmountOnExit>
          <Box
            id="estimate-output"
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
                currency={currency}
                onSave={handleSaveEstimate}
              />
            </Stack>
          </Box>
        </Fade>
      </Stack>

      <SavedEstimatesDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        savedEstimates={savedEstimates}
        onLoad={handleLoadSaved}
        onDelete={handleDeleteSaved}
      />
    </Container>
  );
}
