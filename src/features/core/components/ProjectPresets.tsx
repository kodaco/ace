"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { PRESETS, AppPreset } from "@/features/core/data/presets";
import { Platform } from "./PlatformSelector";

interface ProjectPresetsProps {
  activePresetId: string | null;
  platform: Platform;
  onSelect: (preset: AppPreset) => void;
}

export function ProjectPresets({ activePresetId, platform, onSelect }: ProjectPresetsProps) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1 }}>
        Start with a preset
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          const isDisabled = preset.disabledForPlatforms?.includes(platform) ?? false;
          return (
            <Tooltip
              key={preset.id}
              title={isDisabled ? (preset.disabledReason ?? "Not compatible with selected platform") : ""}
              arrow
            >
              {/* span wrapper lets Tooltip work on a disabled element */}
              <span data-testid={`preset-${preset.id}`}>
                <Chip
                  label={`${preset.emoji} ${preset.label}`}
                  onClick={isDisabled ? undefined : () => onSelect(preset)}
                  disabled={isDisabled}
                  aria-disabled={isDisabled}
                  variant={isActive ? "filled" : "outlined"}
                  color={isActive ? "primary" : "default"}
                  sx={{
                    borderRadius: 2,
                    fontWeight: isActive ? 600 : 400,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                  }}
                />
              </span>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
