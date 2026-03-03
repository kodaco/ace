import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { EstimateResult } from "@/features/core/models";

interface EstimateResultsProps {
  estimate: EstimateResult;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatWeeks(weeks: number): string {
  if (weeks >= 8) {
    const months = weeks / 4.33;
    return `${months.toFixed(1)} months`;
  }
  return `${weeks.toFixed(1)} weeks`;
}

export function EstimateResults({ estimate }: EstimateResultsProps) {
  return (
    <Card variant="outlined" sx={{ bgcolor: "grey.50" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Estimate Summary
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {estimate.featureCount} feature
          {estimate.featureCount !== 1 ? "s" : ""} selected
          {" \u00B7 "}
          {currencyFormatter.format(estimate.hourlyRate)}/hr rate
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <div>
            <Typography variant="overline" color="text.secondary">
              Estimated Cost
            </Typography>
            <Typography variant="h4">
              {currencyFormatter.format(estimate.minCost)} &ndash;{" "}
              {currencyFormatter.format(estimate.maxCost)}
            </Typography>
          </div>

          <div>
            <Typography variant="overline" color="text.secondary">
              Estimated Timeframe
            </Typography>
            <Typography variant="h6">
              {formatWeeks(estimate.minWeeks)} &ndash;{" "}
              {formatWeeks(estimate.maxWeeks)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({estimate.totalMinHours} &ndash; {estimate.totalMaxHours} hours)
            </Typography>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
