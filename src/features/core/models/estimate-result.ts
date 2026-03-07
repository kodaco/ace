export interface EstimateResult {
  hourlyRate: number;
  totalMinHours: number;
  totalMaxHours: number;
  minCost: number;
  maxCost: number;
  minWeeks: number;
  maxWeeks: number;
  maintMinHours: number;
  maintMaxHours: number;
  maintMinCost: number;
  maintMaxCost: number;
  featureCount: number;
}
