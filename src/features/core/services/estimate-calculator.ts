import { AppFeature, EstimateResult } from "@/features/core/models";
import {
  AI_DEV_MULTIPLIER,
  MAINTENANCE_PERCENT_MIN,
  MAINTENANCE_PERCENT_MAX,
  AI_MAINTENANCE_PERCENT_MIN,
  AI_MAINTENANCE_PERCENT_MAX,
} from "@/features/core/data/predefined-features";

const HOURS_PER_WEEK = 40;

export function calculateEstimate(
  selectedFeatures: AppFeature[],
  hourlyRate: number,
  buildWithAi: boolean,
): EstimateResult {
  const devFeatures = selectedFeatures.filter((f) => f.id !== "maintenance");
  const devMultiplier = buildWithAi ? AI_DEV_MULTIPLIER : 1;

  let devMinHours = 0;
  let devMaxHours = 0;
  for (const feature of devFeatures) {
    devMinHours += feature.minHours * devMultiplier;
    devMaxHours += feature.maxHours * devMultiplier;
  }

  const maintPctMin = buildWithAi
    ? AI_MAINTENANCE_PERCENT_MIN
    : MAINTENANCE_PERCENT_MIN;
  const maintPctMax = buildWithAi
    ? AI_MAINTENANCE_PERCENT_MAX
    : MAINTENANCE_PERCENT_MAX;

  const maintMinHours = devMinHours * (maintPctMin / 100);
  const maintMaxHours = devMaxHours * (maintPctMax / 100);

  const totalMinHours = Math.round(devMinHours + maintMinHours);
  const totalMaxHours = Math.round(devMaxHours + maintMaxHours);

  return {
    hourlyRate,
    totalMinHours,
    totalMaxHours,
    minCost: totalMinHours * hourlyRate,
    maxCost: totalMaxHours * hourlyRate,
    minWeeks: totalMinHours / HOURS_PER_WEEK,
    maxWeeks: totalMaxHours / HOURS_PER_WEEK,
    featureCount: selectedFeatures.length,
  };
}
