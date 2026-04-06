"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";

export type Platform = "web" | "ios" | "android" | "cross-platform";

export const PLATFORM_MULTIPLIERS: Record<Platform, number> = {
  web: 1.0,
  ios: 1.0,
  android: 1.0,
  "cross-platform": 1.35,
};

const PLATFORM_OPTIONS: { value: Platform; label: string; tooltip: string }[] = [
  { value: "web", label: "Web App", tooltip: "Browser-based application" },
  { value: "ios", label: "iOS", tooltip: "Native iPhone / iPad app" },
  { value: "android", label: "Android", tooltip: "Native Android app" },
  {
    value: "cross-platform",
    label: "Cross-platform",
    tooltip: "iOS + Android (React Native / Flutter) — adds ~35% to build time",
  },
];

interface PlatformSelectorProps {
  value: Platform;
  onChange: (platform: Platform) => void;
}

export function PlatformSelector({ value, onChange }: PlatformSelectorProps) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1 }}>
        Platform
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, v) => { if (v) onChange(v); }}
        size="small"
        sx={{ flexWrap: "wrap", gap: 0.5 }}
      >
        {PLATFORM_OPTIONS.map((opt) => (
          <Tooltip key={opt.value} title={opt.tooltip} arrow>
            <ToggleButton
              value={opt.value}
              data-testid={`platform-${opt.value}`}
              sx={{
                textTransform: "none",
                borderRadius: "8px !important",
                border: "1px solid !important",
                px: 2,
                fontSize: "0.85rem",
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "#fff",
                  borderColor: "primary.main !important",
                  "&:hover": { bgcolor: "primary.dark" },
                },
              }}
            >
              {opt.label}
            </ToggleButton>
          </Tooltip>
        ))}
      </ToggleButtonGroup>
      {value === "cross-platform" && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.75 }}>
          Cross-platform development (React Native / Flutter) adds ~35% to your estimated build time.
        </Typography>
      )}
    </Box>
  );
}
