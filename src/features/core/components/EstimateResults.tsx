"use client";

import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import LinkIcon from "@mui/icons-material/Link";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckIcon from "@mui/icons-material/Check";
import TextField from "@mui/material/TextField";
import { AppFeature, EstimateResult } from "@/features/core/models";
import { Currency, DEFAULT_CURRENCY } from "@/features/core/data/currencies";

type EstimateMode = "low" | "mid" | "high";

interface EstimateResultsProps {
  estimate: EstimateResult | null;
  selectedFeatures?: AppFeature[];
  loading?: boolean;
  currency?: Currency;
  onSave?: (name: string) => void;
}

function formatCost(usdAmount: number, currency: Currency): string {
  const converted = Math.round(usdAmount * currency.rateFromUsd);
  return `${currency.symbol}${converted.toLocaleString()}`;
}

function formatWeeks(weeks: number): string {
  if (weeks >= 8) {
    return `${Math.ceil(weeks / 4.33)} months`;
  }
  return `${Math.ceil(weeks)} weeks`;
}

export function EstimateResults({ estimate, selectedFeatures = [], loading, currency = DEFAULT_CURRENCY, onSave }: EstimateResultsProps) {
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<EstimateMode>("mid");
  const [valuesLoading, setValuesLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [savingName, setSavingName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleSnackbarClose = () => setLinkCopied(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopied(true);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmSave = () => {
    if (!savingName.trim() || !onSave) return;
    onSave(savingName.trim());
    setSavingName("");
    setShowSaveInput(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  const handleModeChange = (_: React.SyntheticEvent, next: EstimateMode | null) => {
    if (!next || next === mode) return;
    setValuesLoading(true);
    setTimeout(() => {
      setMode(next);
      setValuesLoading(false);
    }, 220);
  };

  const showValueSkeleton = loading || valuesLoading;

  const displayCost = estimate
    ? mode === "low"
      ? estimate.minCost
      : mode === "high"
      ? estimate.maxCost
      : Math.round((estimate.minCost + estimate.maxCost) / 2)
    : 0;

  const displayWeeks = estimate
    ? mode === "low"
      ? estimate.minWeeks
      : mode === "high"
      ? estimate.maxWeeks
      : (estimate.minWeeks + estimate.maxWeeks) / 2
    : 0;

  const avgMaintCost = estimate
    ? Math.round((estimate.maintMinCost + estimate.maintMaxCost) / 2)
    : 0;

  return (
    <Card variant="outlined" data-testid="estimate-results" sx={{ bgcolor: "grey.50" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Estimate Summary
        </Typography>

        {estimate ? (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {estimate.featureCount} feature
            {estimate.featureCount !== 1 ? "s" : ""} selected
            {" \u00B7 "}
            {formatCost(estimate.hourlyRate, currency)}/hr rate
          </Typography>
        ) : (
          <Skeleton variant="text" width="52%" sx={{ fontSize: "0.875rem", mb: 0.5 }} />
        )}

        <Divider sx={{ my: 2 }} />

        {/* Low / Mid / High toggle */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2.5 }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            size="small"
            disabled={!estimate || loading}
            sx={{
              "& .MuiToggleButton-root": {
                px: 2,
                textTransform: "none",
                fontSize: "0.8rem",
                color: "primary.main",
                borderColor: "primary.main",
              },
              "& .MuiToggleButton-root.Mui-selected": {
                bgcolor: "primary.main",
                color: "#fff",
                "&:hover": { bgcolor: "primary.dark" },
              },
            }}
          >
            <ToggleButton value="low">Low</ToggleButton>
            <ToggleButton value="mid">Midpoint</ToggleButton>
            <ToggleButton value="high">High</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Stack spacing={2}>
          {/* Development cost */}
          <div>
            <Typography variant="overline" color="text.secondary">
              Estimated Development Cost
            </Typography>
            {showValueSkeleton ? (
              <Skeleton variant="text" width="55%" sx={{ fontSize: "2.125rem" }} />
            ) : (
              <Typography variant="h4">
                {formatCost(displayCost, currency)}
              </Typography>
            )}
          </div>

          {/* Timeframe */}
          <div>
            <Typography variant="overline" color="text.secondary">
              Estimated Timeframe
            </Typography>
            {showValueSkeleton ? (
              <Skeleton variant="text" width="40%" sx={{ fontSize: "1.25rem" }} />
            ) : (
              <Typography variant="h6">
                {formatWeeks(displayWeeks)}
              </Typography>
            )}
          </div>

          {showValueSkeleton && (
            <Skeleton variant="rounded" height={72} />
          )}
        </Stack>

        {/* Launch prep callout */}
        {!showValueSkeleton && estimate && (
          <Box
            sx={{
              mt: 2.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.15)",
              display: "flex",
              gap: 1.25,
              alignItems: "flex-start",
            }}
          >
            <RocketLaunchOutlinedIcon
              sx={{ fontSize: 18, color: "primary.main", mt: 0.15, flexShrink: 0 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65, mb: 1.25 }}>
                <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                  Plan for launch prep.
                </Box>{" "}
                App store reviews and web hosting setup typically take at least 4 weeks on top of
                your build time.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 0.75,
                  fontSize: "0.8rem",
                }}
              >
                <Box sx={{ px: 1, py: 0.4, borderRadius: 1, bgcolor: "rgba(99,102,241,0.1)", color: "primary.main", fontWeight: 600, fontSize: "inherit" }}>
                  {formatWeeks(displayWeeks)} build
                </Box>
                <Typography variant="body2" color="text.secondary">+</Typography>
                <Box sx={{ px: 1, py: 0.4, borderRadius: 1, bgcolor: "rgba(99,102,241,0.1)", color: "primary.main", fontWeight: 600, fontSize: "inherit" }}>
                  4 weeks prep
                </Box>
                <Typography variant="body2" color="text.secondary">=</Typography>
                <Box sx={{ px: 1, py: 0.4, borderRadius: 1, bgcolor: "primary.main", color: "#fff", fontWeight: 700, fontSize: "inherit" }}>
                  {formatWeeks(displayWeeks + 4)} to launch
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* Annual maintenance */}
        {!showValueSkeleton && estimate && (
          <Box
            sx={{
              mt: 2.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "rgba(0,0,0,0.03)",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              gap: 1.25,
              alignItems: "flex-start",
            }}
          >
            <BuildOutlinedIcon
              sx={{ fontSize: 16, color: "text.secondary", mt: 0.25, flexShrink: 0 }}
            />
            <Box>
              <Typography variant="overline" color="text.secondary" display="block" sx={{ lineHeight: 1.4, mb: 0.5 }}>
                Estimated Annual Maintenance
              </Typography>
              <Typography variant="h6">
                {formatCost(avgMaintCost, currency)}
                <Box component="span" sx={{ fontWeight: 400, color: "text.secondary", fontSize: "0.7em", ml: 0.75 }}>
                  /yr
                </Box>
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                Covers updates, bug fixes, and security patches after launch.
              </Typography>
            </Box>
          </Box>
        )}
        {showValueSkeleton && estimate && (
          <Skeleton variant="rounded" height={80} sx={{ mt: 2.5 }} />
        )}

        {/* Expandable range details */}
        {!showValueSkeleton && estimate && (
          <>
            <Divider sx={{ mt: 2.5, mb: 0 }} />
            <Box
              data-testid="details-toggle"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 0.5,
                mx: -0.5,
                cursor: "pointer",
              }}
              onClick={() => setExpanded((prev) => !prev)}
            >
              <Typography variant="body2" color="text.secondary" sx={{ pl: 0.5 }}>
                View cost range &amp; details
              </Typography>
              <IconButton
                size="small"
                sx={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
                aria-label="Toggle details"
              >
                <ExpandMoreIcon fontSize="small" />
              </IconButton>
            </Box>

            <Collapse in={expanded}>
              <Box sx={{ pt: 1.5 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Actual costs vary based on team experience, scope changes, and the complexity of
                  individual features. The ranges below reflect a realistic spread for this feature
                  set.
                </Typography>
                <Stack spacing={0.75} sx={{ mt: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Development cost:{" "}
                    <Box component="span" sx={{ fontWeight: 400 }}>
                      {formatCost(estimate.minCost, currency)} &ndash;{" "}
                      {formatCost(estimate.maxCost, currency)}
                    </Box>
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Timeframe:{" "}
                    <Box component="span" sx={{ fontWeight: 400 }}>
                      {formatWeeks(estimate.minWeeks)} &ndash; {formatWeeks(estimate.maxWeeks)}
                    </Box>
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Development hours:{" "}
                    <Box component="span" sx={{ fontWeight: 400 }}>
                      {estimate.totalMinHours} &ndash; {estimate.totalMaxHours} hrs
                    </Box>
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Annual maintenance:{" "}
                    <Box component="span" sx={{ fontWeight: 400 }}>
                      {formatCost(estimate.maintMinCost, currency)} &ndash;{" "}
                      {formatCost(estimate.maintMaxCost, currency)}/yr
                      {" "}({estimate.maintMinHours} &ndash; {estimate.maintMaxHours} hrs)
                    </Box>
                  </Typography>
                </Stack>

                {/* Cost breakdown by feature */}
                {selectedFeatures.filter((f) => f.id !== "maintenance" && !f.alwaysActive).length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      Hours by feature
                    </Typography>
                    <Stack spacing={0.75}>
                      {(() => {
                          const devFeatures = selectedFeatures.filter(
                            (f) => f.id !== "maintenance" && !f.alwaysActive,
                          );
                          const totalAvg = devFeatures.reduce(
                            (sum, f) => sum + (f.minHours + f.maxHours) / 2,
                            0,
                          );
                          return [...devFeatures]
                            .sort((a, b) => (b.minHours + b.maxHours) - (a.minHours + a.maxHours))
                            .map((f) => {
                              const avgHours = (f.minHours + f.maxHours) / 2;
                              const pct = totalAvg > 0 ? Math.round((avgHours / totalAvg) * 100) : 0;
                              return (
                                <Box key={f.id}>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.35 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                                      {f.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1, whiteSpace: "nowrap" }}>
                                      ~{Math.round(avgHours)} hrs · {pct}%
                                    </Typography>
                                  </Box>
                                  <Box sx={{ height: 6, borderRadius: 3, bgcolor: "grey.100", overflow: "hidden" }}>
                                    <Box
                                      sx={{
                                        height: "100%",
                                        width: `${pct}%`,
                                        bgcolor: "primary.main",
                                        borderRadius: 3,
                                        opacity: 0.75,
                                        transition: "width 0.4s ease",
                                      }}
                                    />
                                  </Box>
                                </Box>
                              );
                            });
                        })()}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Collapse>
          </>
        )}

        {/* Features included */}
        {!showValueSkeleton && selectedFeatures.length > 0 && (
          <>
            <Divider sx={{ mt: 2.5, mb: 2 }} />
            <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Features Included
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {selectedFeatures.map((f) => (
                <Box
                  key={f.id}
                  sx={{
                    px: 1.25,
                    py: 0.4,
                    borderRadius: "20px",
                    bgcolor: "rgba(99,102,241,0.09)",
                    color: "primary.dark",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                  }}
                >
                  {f.name}
                </Box>
              ))}
            </Box>
          </>
        )}
        {/* Action buttons */}
        {!showValueSkeleton && estimate && (
          <>
            <Divider sx={{ mt: 2.5, mb: 2 }} />
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<LinkIcon fontSize="small" />}
                onClick={handleCopyLink}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Copy shareable link
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<PictureAsPdfOutlinedIcon fontSize="small" />}
                onClick={handlePrint}
                sx={{ textTransform: "none", borderRadius: 2 }}
                className="no-print"
              >
                Save as PDF
              </Button>
              {onSave && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={justSaved ? <CheckIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                  onClick={() => setShowSaveInput((p) => !p)}
                  sx={{ textTransform: "none", borderRadius: 2, color: justSaved ? "success.main" : undefined, borderColor: justSaved ? "success.main" : undefined }}
                  className="no-print"
                >
                  {justSaved ? "Saved!" : "Save estimate"}
                </Button>
              )}
            </Box>
            {onSave && (
              <Collapse in={showSaveInput} unmountOnExit>
                <Box sx={{ display: "flex", gap: 1, mt: 1.5, alignItems: "center" }}>
                  <TextField
                    size="small"
                    placeholder="Name this estimate…"
                    value={savingName}
                    onChange={(e) => setSavingName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleConfirmSave(); if (e.key === "Escape") setShowSaveInput(false); }}
                    autoFocus
                    sx={{ flex: 1, maxWidth: 260 }}
                  />
                  <Button size="small" variant="contained" onClick={handleConfirmSave} disabled={!savingName.trim()} sx={{ textTransform: "none" }}>
                    Save
                  </Button>
                  <Button size="small" onClick={() => setShowSaveInput(false)} sx={{ textTransform: "none" }}>
                    Cancel
                  </Button>
                </Box>
              </Collapse>
            )}
          </>
        )}
      </CardContent>

      <Snackbar
        open={linkCopied}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        message="Link copied to clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Card>
  );
}
