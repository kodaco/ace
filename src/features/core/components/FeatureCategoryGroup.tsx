"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AppFeature, FeatureCategory } from "@/features/core/models/app-feature";
import { FeatureListItem } from "./FeatureListItem";

const CATEGORY_LABELS: Record<FeatureCategory, string> = {
  core: "Core",
  communication: "Communication & Engagement",
  commerce: "Commerce & Monetization",
  data: "Data & Intelligence",
  platform: "Platform & Infrastructure",
  advanced: "Advanced",
};

interface FeatureCategoryGroupProps {
  category: FeatureCategory;
  features: AppFeature[];
  selectedIds: Set<string>;
  expandedIds: Set<string>;
  buildWithAi: boolean;
  defaultOpen?: boolean;
  onToggle: (featureId: string) => void;
  onToggleExpand: (featureId: string) => void;
  onRemove?: (featureId: string) => void;
  extra?: React.ReactNode;
}

export function FeatureCategoryGroup({
  category,
  features,
  selectedIds,
  expandedIds,
  buildWithAi,
  defaultOpen = false,
  onToggle,
  onToggleExpand,
  onRemove,
  extra,
}: FeatureCategoryGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  const selectedCount = features.filter(
    (f) => !f.alwaysActive && selectedIds.has(f.id),
  ).length;

  return (
    <Box
      data-testid={`category-group-${category}`}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        data-testid={`category-header-${category}`}
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          cursor: "pointer",
          bgcolor: open ? "rgba(99,102,241,0.04)" : "background.paper",
          "&:hover": { bgcolor: "rgba(99,102,241,0.06)" },
          userSelect: "none",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {CATEGORY_LABELS[category]}
          </Typography>
          {selectedCount > 0 && (
            <Chip
              label={selectedCount}
              size="small"
              color="primary"
              sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700 }}
            />
          )}
        </Box>
        <ExpandMoreIcon
          fontSize="small"
          sx={{
            color: "text.secondary",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </Box>

      {/* Feature items */}
      <Collapse in={open}>
        <Stack spacing={0} sx={{ px: 1.5, pb: 1.5, pt: 1 }}>
          {features.map((feature) => (
            <FeatureListItem
              key={feature.id}
              feature={feature}
              selected={selectedIds.has(feature.id)}
              expanded={expandedIds.has(feature.id)}
              locked={!!feature.alwaysActive}
              buildWithAi={buildWithAi}
              onToggle={() => onToggle(feature.id)}
              onToggleExpand={() => onToggleExpand(feature.id)}
              onRemove={onRemove && feature.id.startsWith("custom-") ? () => onRemove(feature.id) : undefined}
            />
          ))}
          {extra}
        </Stack>
      </Collapse>
    </Box>
  );
}
