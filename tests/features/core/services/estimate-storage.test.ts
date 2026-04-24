import {
  getSavedEstimates,
  saveEstimate,
  deleteSavedEstimate,
} from "@/features/core/services/estimate-storage";

const mockConfig = {
  featureIds: ["user-auth", "payments"],
  customFeatures: [],
  rate: 100,
  ai: false,
  platform: "web",
  currencyCode: "USD",
};

beforeEach(() => {
  localStorage.clear();
});

describe("estimate-storage", () => {
  describe("getSavedEstimates", () => {
    it("returns empty array when localStorage is empty", () => {
      expect(getSavedEstimates()).toEqual([]);
    });

    it("returns parsed estimates from localStorage", () => {
      saveEstimate("Test", mockConfig, 3, 15000);
      const result = getSavedEstimates();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Test");
    });

    it("returns empty array when localStorage contains invalid JSON", () => {
      localStorage.setItem("ace_saved_estimates", "not-valid-json{{");
      expect(getSavedEstimates()).toEqual([]);
    });

    it("returns empty array when window is undefined (SSR guard)", () => {
      const originalWindow = global.window;
      // @ts-expect-error — intentionally setting window to undefined for SSR guard test
      global.window = undefined;
      try {
        expect(getSavedEstimates()).toEqual([]);
      } finally {
        global.window = originalWindow;
      }
    });
  });

  describe("saveEstimate", () => {
    it("returns an entry with the correct shape", () => {
      const result = saveEstimate("MVP", mockConfig, 5, 12000);
      expect(result).toMatchObject({
        name: "MVP",
        featureCount: 5,
        midpointCost: 12000,
        config: mockConfig,
      });
      expect(result.id).toMatch(/^save-/);
      expect(typeof result.savedAt).toBe("string");
    });

    it("persists the entry to localStorage", () => {
      saveEstimate("MVP", mockConfig, 5, 12000);
      const stored = JSON.parse(localStorage.getItem("ace_saved_estimates") ?? "[]");
      expect(stored).toHaveLength(1);
      expect(stored[0].name).toBe("MVP");
    });

    it("puts the newest entry first", () => {
      saveEstimate("First", mockConfig, 1, 1000);
      saveEstimate("Second", mockConfig, 2, 2000);
      const result = getSavedEstimates();
      expect(result[0].name).toBe("Second");
      expect(result[1].name).toBe("First");
    });

    it("caps at 5 saved estimates", () => {
      for (let i = 0; i < 6; i++) {
        saveEstimate(`Estimate ${i}`, mockConfig, i, i * 1000);
      }
      expect(getSavedEstimates()).toHaveLength(5);
    });
  });

  describe("deleteSavedEstimate", () => {
    it("removes the entry with the matching id", () => {
      // Use fake timers so two rapid saves produce distinct ids
      jest.useFakeTimers();
      jest.setSystemTime(1000);
      const saved = saveEstimate("To Delete", mockConfig, 1, 1000);
      jest.setSystemTime(2000);
      saveEstimate("Keep", mockConfig, 2, 2000);
      jest.useRealTimers();
      deleteSavedEstimate(saved.id);
      const result = getSavedEstimates();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Keep");
    });

    it("is a no-op when the id does not exist", () => {
      saveEstimate("Keep", mockConfig, 1, 1000);
      deleteSavedEstimate("nonexistent-id");
      expect(getSavedEstimates()).toHaveLength(1);
    });
  });
});
