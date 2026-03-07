import {
  PREDEFINED_FEATURES,
  DEFAULT_HOURLY_RATE,
  AI_DEV_MULTIPLIER,
  MAINTENANCE_PERCENT_MIN,
  MAINTENANCE_PERCENT_MAX,
  AI_MAINTENANCE_PERCENT_MIN,
  AI_MAINTENANCE_PERCENT_MAX,
} from "@/features/core/data/predefined-features";

describe("PREDEFINED_FEATURES", () => {
  it("contains at least one feature", () => {
    expect(PREDEFINED_FEATURES.length).toBeGreaterThan(0);
  });

  it("all feature IDs are unique", () => {
    const ids = PREDEFINED_FEATURES.map((f) => f.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("every feature has required string fields", () => {
    for (const feature of PREDEFINED_FEATURES) {
      expect(typeof feature.id).toBe("string");
      expect(feature.id.length).toBeGreaterThan(0);
      expect(typeof feature.name).toBe("string");
      expect(feature.name.length).toBeGreaterThan(0);
      expect(typeof feature.description).toBe("string");
      expect(feature.description.length).toBeGreaterThan(0);
      expect(typeof feature.details).toBe("string");
      expect(feature.details.length).toBeGreaterThan(0);
      expect(typeof feature.factors).toBe("string");
      expect(feature.factors.length).toBeGreaterThan(0);
    }
  });

  it("every feature has non-negative min and max hours", () => {
    for (const feature of PREDEFINED_FEATURES) {
      expect(feature.minHours).toBeGreaterThanOrEqual(0);
      expect(feature.maxHours).toBeGreaterThanOrEqual(0);
    }
  });

  it("minHours is always <= maxHours for every feature", () => {
    for (const feature of PREDEFINED_FEATURES) {
      expect(feature.minHours).toBeLessThanOrEqual(feature.maxHours);
    }
  });

  it("alwaysActive features are a known set (ui-ux-design, maintenance)", () => {
    const alwaysActiveIds = PREDEFINED_FEATURES
      .filter((f) => f.alwaysActive)
      .map((f) => f.id)
      .sort();
    expect(alwaysActiveIds).toEqual(["maintenance", "ui-ux-design"].sort());
  });

  it("feature IDs use kebab-case with no spaces", () => {
    for (const feature of PREDEFINED_FEATURES) {
      expect(feature.id).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe("constants", () => {
  it("DEFAULT_HOURLY_RATE is a positive number", () => {
    expect(DEFAULT_HOURLY_RATE).toBeGreaterThan(0);
  });

  it("AI_DEV_MULTIPLIER is between 0 and 1 (reduces hours)", () => {
    expect(AI_DEV_MULTIPLIER).toBeGreaterThan(0);
    expect(AI_DEV_MULTIPLIER).toBeLessThan(1);
  });

  it("maintenance percent min is less than max", () => {
    expect(MAINTENANCE_PERCENT_MIN).toBeLessThan(MAINTENANCE_PERCENT_MAX);
    expect(AI_MAINTENANCE_PERCENT_MIN).toBeLessThan(AI_MAINTENANCE_PERCENT_MAX);
  });

  it("AI maintenance percents are higher than standard", () => {
    expect(AI_MAINTENANCE_PERCENT_MIN).toBeGreaterThan(MAINTENANCE_PERCENT_MIN);
    expect(AI_MAINTENANCE_PERCENT_MAX).toBeGreaterThan(MAINTENANCE_PERCENT_MAX);
  });

  it("maintenance percents are reasonable (between 1 and 100)", () => {
    expect(MAINTENANCE_PERCENT_MIN).toBeGreaterThan(0);
    expect(MAINTENANCE_PERCENT_MAX).toBeLessThan(100);
    expect(AI_MAINTENANCE_PERCENT_MIN).toBeGreaterThan(0);
    expect(AI_MAINTENANCE_PERCENT_MAX).toBeLessThan(100);
  });
});
