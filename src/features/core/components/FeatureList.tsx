import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Stack from "@mui/material/Stack";
import { AppFeature, FeatureCategory } from "@/features/core/models";
import { FeatureCategoryGroup } from "./FeatureCategoryGroup";

const CATEGORY_ORDER: FeatureCategory[] = [
  "core",
  "communication",
  "commerce",
  "data",
  "platform",
  "advanced",
];

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
  onRemove?: (featureId: string) => void;
  advancedExtra?: React.ReactNode;
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
  onRemove,
  advancedExtra,
}: FeatureListProps) {
  const byCategory = new Map<FeatureCategory, AppFeature[]>();
  for (const cat of CATEGORY_ORDER) byCategory.set(cat, []);
  for (const f of features) {
    const cat: FeatureCategory = f.category ?? "core";
    byCategory.get(cat)?.push(f);
  }

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, mt: 5 }}>
        <Typography variant="h6">Select Your Features</Typography>
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
        {CATEGORY_ORDER.map((cat) => {
          const catFeatures = byCategory.get(cat)!;
          if (catFeatures.length === 0 && !(cat === "advanced" && advancedExtra)) return null;
          return (
            <FeatureCategoryGroup
              key={cat}
              category={cat}
              features={catFeatures}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              buildWithAi={buildWithAi}
              defaultOpen={cat === "core"}
              onToggle={onToggle}
              onToggleExpand={onToggleExpand}
              onRemove={onRemove}
              extra={cat === "advanced" ? advancedExtra : undefined}
            />
          );
        })}
      </Stack>
    </div>
  );
}
