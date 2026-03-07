import { calculateEstimate } from "@/features/core/services/estimate-calculator";
import { AppFeature } from "@/features/core/models";
import {
  AI_DEV_MULTIPLIER,
  DEFAULT_HOURLY_RATE,
  MAINTENANCE_PERCENT_MIN,
  MAINTENANCE_PERCENT_MAX,
  AI_MAINTENANCE_PERCENT_MIN,
  AI_MAINTENANCE_PERCENT_MAX,
  PREDEFINED_FEATURES,
} from "@/features/core/data/predefined-features";

const makeFeature = (overrides: Partial<AppFeature> = {}): AppFeature => ({
  id: "test-feature",
  name: "Test Feature",
  description: "A test feature",
  details: "Details",
  factors: "Factors",
  minHours: 40,
  maxHours: 100,
  ...overrides,
});

describe("calculateEstimate", () => {
  describe("basic calculations", () => {
    it("calculates cost from hours and hourly rate", () => {
      const feature = makeFeature({ minHours: 40, maxHours: 100 });
      const result = calculateEstimate([feature], 100, false);

      expect(result.minCost).toBe(4000);
      expect(result.maxCost).toBe(10000);
    });

    it("returns the provided hourly rate", () => {
      const result = calculateEstimate([makeFeature()], 150, false);
      expect(result.hourlyRate).toBe(150);
    });

    it("uses the default hourly rate correctly", () => {
      const feature = makeFeature({ minHours: 10, maxHours: 10 });
      const result = calculateEstimate([feature], DEFAULT_HOURLY_RATE, false);
      expect(result.minCost).toBe(10 * DEFAULT_HOURLY_RATE);
    });

    it("sums hours across multiple features", () => {
      const features = [
        makeFeature({ id: "a", minHours: 20, maxHours: 50 }),
        makeFeature({ id: "b", minHours: 30, maxHours: 70 }),
      ];
      const result = calculateEstimate(features, 100, false);

      expect(result.totalMinHours).toBe(50);
      expect(result.totalMaxHours).toBe(120);
    });

    it("returns featureCount equal to selected features length", () => {
      const features = [
        makeFeature({ id: "a" }),
        makeFeature({ id: "b" }),
        makeFeature({ id: "c" }),
      ];
      const result = calculateEstimate(features, 100, false);
      expect(result.featureCount).toBe(3);
    });

    it("calculates weeks from hours at 40hrs/week", () => {
      const feature = makeFeature({ minHours: 40, maxHours: 80 });
      const result = calculateEstimate([feature], 100, false);

      expect(result.minWeeks).toBe(1);
      expect(result.maxWeeks).toBe(2);
    });

    it("rounds fractional hours to nearest integer", () => {
      const feature = makeFeature({ minHours: 33, maxHours: 66 });
      const result = calculateEstimate([feature], 100, false);

      expect(Number.isInteger(result.totalMinHours)).toBe(true);
      expect(Number.isInteger(result.totalMaxHours)).toBe(true);
    });

    it("returns zero costs for empty feature list", () => {
      const result = calculateEstimate([], 100, false);

      expect(result.minCost).toBe(0);
      expect(result.maxCost).toBe(0);
      expect(result.totalMinHours).toBe(0);
      expect(result.totalMaxHours).toBe(0);
      expect(result.featureCount).toBe(0);
    });

    it("minCost is always <= maxCost", () => {
      const result = calculateEstimate(PREDEFINED_FEATURES, 100, false);
      expect(result.minCost).toBeLessThanOrEqual(result.maxCost);
    });

    it("totalMinHours is always <= totalMaxHours", () => {
      const result = calculateEstimate(PREDEFINED_FEATURES, 100, false);
      expect(result.totalMinHours).toBeLessThanOrEqual(result.totalMaxHours);
    });
  });

  describe("AI mode", () => {
    it("reduces dev hours by AI_DEV_MULTIPLIER", () => {
      const feature = makeFeature({ minHours: 100, maxHours: 200 });
      const standard = calculateEstimate([feature], 100, false);
      const ai = calculateEstimate([feature], 100, true);

      expect(ai.totalMinHours).toBe(Math.round(100 * AI_DEV_MULTIPLIER));
      expect(ai.totalMaxHours).toBe(Math.round(200 * AI_DEV_MULTIPLIER));
    });

    it("AI total hours are lower than standard hours", () => {
      const result_standard = calculateEstimate(PREDEFINED_FEATURES, 100, false);
      const result_ai = calculateEstimate(PREDEFINED_FEATURES, 100, true);

      expect(result_ai.totalMinHours).toBeLessThan(result_standard.totalMinHours);
      expect(result_ai.totalMaxHours).toBeLessThan(result_standard.totalMaxHours);
    });

    it("AI costs are lower than standard costs", () => {
      const standard = calculateEstimate(PREDEFINED_FEATURES, 100, false);
      const ai = calculateEstimate(PREDEFINED_FEATURES, 100, true);

      expect(ai.minCost).toBeLessThan(standard.minCost);
      expect(ai.maxCost).toBeLessThan(standard.maxCost);
    });
  });

  describe("maintenance calculation", () => {
    it("standard maintenance hours are within expected percentage range", () => {
      const feature = makeFeature({ minHours: 1000, maxHours: 1000 });
      const result = calculateEstimate([feature], 100, false);

      const pctMin = (result.maintMinHours / result.totalMinHours) * 100;
      const pctMax = (result.maintMaxHours / result.totalMaxHours) * 100;

      // Allow 1hr rounding tolerance
      expect(pctMin).toBeCloseTo(MAINTENANCE_PERCENT_MIN, 0);
      expect(pctMax).toBeCloseTo(MAINTENANCE_PERCENT_MAX, 0);
    });

    it("AI maintenance hours are within AI percentage range", () => {
      const feature = makeFeature({ minHours: 1000, maxHours: 1000 });
      const result = calculateEstimate([feature], 100, true);

      const aiDevMin = Math.round(1000 * AI_DEV_MULTIPLIER);
      const pctMin = (result.maintMinHours / aiDevMin) * 100;
      const pctMax = (result.maintMaxHours / aiDevMin) * 100;

      expect(pctMin).toBeCloseTo(AI_MAINTENANCE_PERCENT_MIN, 0);
      expect(pctMax).toBeCloseTo(AI_MAINTENANCE_PERCENT_MAX, 0);
    });

    it("AI maintenance percentage is higher than standard", () => {
      const feature = makeFeature({ minHours: 1000, maxHours: 1000 });
      const standard = calculateEstimate([feature], 100, false);
      const ai = calculateEstimate([feature], 100, true);

      // AI maintenance cost is higher percentage even though dev hours are less
      const standardPct = standard.maintMinHours / standard.totalMinHours;
      const aiPct = ai.maintMinHours / ai.totalMinHours;
      expect(aiPct).toBeGreaterThan(standardPct);
    });

    it("maintenance cost equals maintenance hours times hourly rate", () => {
      const result = calculateEstimate([makeFeature()], 120, false);

      expect(result.maintMinCost).toBe(result.maintMinHours * 120);
      expect(result.maintMaxCost).toBe(result.maintMaxHours * 120);
    });

    it("maintMinHours is always <= maintMaxHours", () => {
      const result = calculateEstimate(PREDEFINED_FEATURES, 100, false);
      expect(result.maintMinHours).toBeLessThanOrEqual(result.maintMaxHours);
    });
  });

  describe("hourly rate edge cases", () => {
    it("zero hourly rate returns zero costs but non-zero hours", () => {
      const result = calculateEstimate([makeFeature()], 0, false);

      expect(result.minCost).toBe(0);
      expect(result.maxCost).toBe(0);
      expect(result.totalMinHours).toBeGreaterThan(0);
    });

    it("cost scales linearly with hourly rate", () => {
      const feature = makeFeature({ minHours: 100, maxHours: 100 });
      const r1 = calculateEstimate([feature], 50, false);
      const r2 = calculateEstimate([feature], 100, false);

      expect(r2.minCost).toBe(r1.minCost * 2);
    });
  });
});
