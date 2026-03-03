import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { keyframes } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AppFeature } from "@/features/core/models";
import {
  AI_DEV_MULTIPLIER,
  MAINTENANCE_PERCENT_MIN,
  MAINTENANCE_PERCENT_MAX,
  AI_MAINTENANCE_PERCENT_MIN,
  AI_MAINTENANCE_PERCENT_MAX,
} from "@/features/core/data/predefined-features";

interface FeatureListItemProps {
  feature: AppFeature;
  selected: boolean;
  expanded: boolean;
  locked: boolean;
  buildWithAi: boolean;
  onToggle: () => void;
  onToggleExpand: () => void;
}

const popIn = keyframes`
  0% { opacity: 0.4; transform: scale(0.85); }
  50% { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

export function FeatureListItem({
  feature,
  selected,
  expanded,
  locked,
  buildWithAi,
  onToggle,
  onToggleExpand,
}: FeatureListItemProps) {
  const isMaintenance = feature.id === "maintenance";

  // Maintenance: percentage-based display
  const maintPctMin = buildWithAi
    ? AI_MAINTENANCE_PERCENT_MIN
    : MAINTENANCE_PERCENT_MIN;
  const maintPctMax = buildWithAi
    ? AI_MAINTENANCE_PERCENT_MAX
    : MAINTENANCE_PERCENT_MAX;
  const maintPctAvg = Math.round((maintPctMin + maintPctMax) / 2);

  // Dev features: hour-based display
  const devMultiplier = buildWithAi ? AI_DEV_MULTIPLIER : 1;
  const adjustedMin = Math.round(feature.minHours * devMultiplier);
  const adjustedMax = Math.round(feature.maxHours * devMultiplier);
  const averageHours = Math.round((adjustedMin + adjustedMax) / 2);

  const pillLabel = isMaintenance
    ? `~${maintPctAvg}%`
    : `~${averageHours} hrs`;
  const pillKey = isMaintenance ? maintPctAvg : averageHours;

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: selected || locked ? "primary.main" : undefined,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          cursor: locked ? "default" : "pointer",
        }}
        onClick={locked ? undefined : onToggle}
      >
        {locked ? (
          <Chip label="Always Included" size="small" color="primary" />
        ) : (
          <Checkbox checked={selected} tabIndex={-1} disableRipple />
        )}
        <Box sx={{ ml: 1, flex: 1 }}>
          <Typography variant="subtitle1" component="div">
            {feature.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {feature.description}
          </Typography>
        </Box>
        <Box
          key={pillKey}
          sx={{
            ml: 2,
            px: 1.5,
            py: 0.5,
            bgcolor: "grey.100",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            animation: `${popIn} 0.3s ease-out`,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {pillLabel}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          sx={{
            ml: 1,
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
          aria-label="View details"
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>
      <Collapse in={expanded}>
        <Divider />
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {feature.details}
          </Typography>
          {isMaintenance ? (
            <>
              <Typography variant="body2" sx={{ mt: 1.5, fontWeight: 500 }}>
                Estimated range: {maintPctMin}–{maintPctMax}% of total
                development time per year
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                <em>What affects the timeline:</em> {feature.factors}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body2" sx={{ mt: 1.5, fontWeight: 500 }}>
                Estimated range: {adjustedMin}&ndash;{adjustedMax} hours
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                <em>What affects the timeline:</em> {feature.factors}
              </Typography>
            </>
          )}
        </Box>
      </Collapse>
    </Card>
  );
}
