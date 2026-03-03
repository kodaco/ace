import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppFeature } from "@/features/core/models";
import { FeatureListItem } from "./FeatureListItem";

interface FeatureListProps {
  features: AppFeature[];
  selectedIds: Set<string>;
  expandedIds: Set<string>;
  buildWithAi: boolean;
  onToggle: (featureId: string) => void;
  onToggleExpand: (featureId: string) => void;
}

export function FeatureList({
  features,
  selectedIds,
  expandedIds,
  buildWithAi,
  onToggle,
  onToggleExpand,
}: FeatureListProps) {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Select Features
      </Typography>
      <Stack spacing={1.5}>
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
          />
        ))}
      </Stack>
    </div>
  );
}
