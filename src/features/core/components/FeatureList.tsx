import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { AppFeature } from "@/features/core/models";
import { FeatureListItem } from "./FeatureListItem";

interface FeatureListProps {
  features: AppFeature[];
  selectedIds: Set<string>;
  expandedIds: Set<string>;
  buildWithAi: boolean;
  onToggle: (featureId: string) => void;
  onToggleExpand: (featureId: string) => void;
  allSelected?: boolean;
  allExpanded?: boolean;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
}

export function FeatureList({
  features,
  selectedIds,
  expandedIds,
  buildWithAi,
  onToggle,
  onToggleExpand,
  allSelected,
  allExpanded,
  onSelectAll,
  onDeselectAll,
  onExpandAll,
  onCollapseAll,
}: FeatureListProps) {
  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, mt: 5 }}>
        <Typography variant="h6">
          Select Your Features
        </Typography>
        {(onSelectAll || onExpandAll) && (
          <ButtonGroup size="small" variant="outlined" sx={{ display: { xs: "none", sm: "flex" } }}>
            <Button onClick={allSelected ? onDeselectAll : onSelectAll}>
              {allSelected ? "Deselect All" : "Select All"}
            </Button>
            <Button onClick={allExpanded ? onCollapseAll : onExpandAll}>
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </ButtonGroup>
        )}
      </Box>
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
