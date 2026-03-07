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
import Skeleton from "@mui/material/Skeleton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import { AppFeature, EstimateResult } from "@/features/core/models";

type EstimateMode = "low" | "mid" | "high";

interface EstimateResultsProps {
  estimate: EstimateResult | null;
  selectedFeatures?: AppFeature[];
  loading?: boolean;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatWeeks(weeks: number): string {
  if (weeks >= 8) {
    return `${Math.ceil(weeks / 4.33)} months`;
  }
  return `${Math.ceil(weeks)} weeks`;
}

export function EstimateResults({ estimate, selectedFeatures = [], loading }: EstimateResultsProps) {
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<EstimateMode>("mid");
  const [valuesLoading, setValuesLoading] = useState(false);

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
    <Card variant="outlined" sx={{ bgcolor: "grey.50" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Estimate Summary
        </Typography>

        {estimate ? (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {estimate.featureCount} feature
            {estimate.featureCount !== 1 ? "s" : ""} selected
            {" \u00B7 "}
            {currencyFormatter.format(estimate.hourlyRate)}/hr rate
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
                {currencyFormatter.format(displayCost)}
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
                {currencyFormatter.format(avgMaintCost)}
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
                      {currencyFormatter.format(estimate.minCost)} &ndash;{" "}
                      {currencyFormatter.format(estimate.maxCost)}
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
                      {currencyFormatter.format(estimate.maintMinCost)} &ndash;{" "}
                      {currencyFormatter.format(estimate.maintMaxCost)}/yr
                      {" "}({estimate.maintMinHours} &ndash; {estimate.maintMaxHours} hrs)
                    </Box>
                  </Typography>
                </Stack>
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
      </CardContent>
    </Card>
  );
}
