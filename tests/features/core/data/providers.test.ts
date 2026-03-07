import { PROVIDERS } from "@/features/core/data/providers";

describe("PROVIDERS", () => {
  it("contains at least one provider", () => {
    expect(PROVIDERS.length).toBeGreaterThan(0);
  });

  it("all provider IDs are unique", () => {
    const ids = PROVIDERS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("every provider has required string fields", () => {
    for (const provider of PROVIDERS) {
      expect(typeof provider.id).toBe("string");
      expect(provider.id.length).toBeGreaterThan(0);
      expect(typeof provider.name).toBe("string");
      expect(provider.name.length).toBeGreaterThan(0);
      expect(typeof provider.description).toBe("string");
      expect(provider.description.length).toBeGreaterThan(0);
    }
  });

  it("every provider has a positive hourly rate", () => {
    for (const provider of PROVIDERS) {
      expect(provider.hourlyRate).toBeGreaterThan(0);
    }
  });

  it("every provider has at least one tag", () => {
    for (const provider of PROVIDERS) {
      expect(Array.isArray(provider.tags)).toBe(true);
      expect(provider.tags.length).toBeGreaterThan(0);
    }
  });

  it("provider IDs use kebab-case with no spaces", () => {
    for (const provider of PROVIDERS) {
      expect(provider.id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("optional website field, if present, starts with https://", () => {
    for (const provider of PROVIDERS) {
      if (provider.website !== undefined) {
        expect(provider.website).toMatch(/^https:\/\//);
      }
    }
  });

  it("providers are sorted by hourly rate (descending)", () => {
    const rates = PROVIDERS.map((p) => p.hourlyRate);
    for (let i = 0; i < rates.length - 1; i++) {
      expect(rates[i]).toBeGreaterThanOrEqual(rates[i + 1]);
    }
  });
});
