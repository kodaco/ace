import { shareEstimateByEmail } from "@/features/core/services/estimate-email";

// ─── Browser API mocks ────────────────────────────────────────────────────────
const mockOpen = jest.fn();
const mockCreateObjectURL = jest.fn(() => "blob:mock-url");
const mockRevokeObjectURL = jest.fn();

beforeEach(() => {
  global.window.open = mockOpen;
  global.URL.createObjectURL = mockCreateObjectURL;
  global.URL.revokeObjectURL = mockRevokeObjectURL;
  mockOpen.mockClear();
  mockCreateObjectURL.mockClear();
  mockRevokeObjectURL.mockClear();
});

// ─── Shared test data ─────────────────────────────────────────────────────────

const mockEstimate = {
  hourlyRate: 100,
  totalMinHours: 100,
  totalMaxHours: 200,
  minCost: 10000,
  maxCost: 20000,
  minWeeks: 2.5,
  maxWeeks: 5,
  maintMinHours: 15,
  maintMaxHours: 50,
  maintMinCost: 1500,
  maintMaxCost: 5000,
  featureCount: 3,
};

const mockFeatures = [
  {
    id: "user-auth",
    name: "User Accounts & Login",
    description: "Let users create accounts",
    details: "",
    factors: "",
    minHours: 40,
    maxHours: 100,
  },
  {
    id: "payments",
    name: "Payments & Checkout",
    description: "Accept payments",
    details: "",
    factors: "",
    minHours: 60,
    maxHours: 160,
  },
];

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("shareEstimateByEmail", () => {
  describe("window.open behaviour", () => {
    it("calls window.open when invoked with a toEmail", () => {
      shareEstimateByEmail(mockEstimate, mockFeatures, "recipient@example.com");
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("calls window.open when invoked without a toEmail", () => {
      shareEstimateByEmail(mockEstimate, mockFeatures, "");
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("opens a new tab (_blank target)", () => {
      shareEstimateByEmail(mockEstimate, mockFeatures, "test@example.com");
      expect(mockOpen).toHaveBeenCalledWith(expect.any(String), "_blank");
    });

    it("passes the blob URL returned by createObjectURL to window.open", () => {
      shareEstimateByEmail(mockEstimate, mockFeatures, "test@example.com");
      expect(mockOpen).toHaveBeenCalledWith("blob:mock-url", "_blank");
    });
  });

  describe("Blob / URL.createObjectURL behaviour", () => {
    it("calls URL.createObjectURL when generating the email page", () => {
      shareEstimateByEmail(mockEstimate, mockFeatures, "test@example.com");
      expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    });

    it("passes a Blob instance to URL.createObjectURL", () => {
      shareEstimateByEmail(mockEstimate, mockFeatures, "test@example.com");
      const arg = mockCreateObjectURL.mock.calls[0][0];
      expect(arg).toBeInstanceOf(Blob);
    });

    it("creates the Blob with HTML content type", () => {
      shareEstimateByEmail(mockEstimate, mockFeatures, "test@example.com");
      const blob: Blob = mockCreateObjectURL.mock.calls[0][0];
      expect(blob.type).toBe("text/html");
    });

    it("creates a non-empty Blob", () => {
      shareEstimateByEmail(mockEstimate, mockFeatures, "test@example.com");
      const blob: Blob = mockCreateObjectURL.mock.calls[0][0];
      expect(blob.size).toBeGreaterThan(0);
    });
  });

  describe("toEmail parameter handling", () => {
    it("works correctly when toEmail is provided", () => {
      expect(() => {
        shareEstimateByEmail(mockEstimate, mockFeatures, "user@example.com");
      }).not.toThrow();
    });

    it("works correctly when toEmail is an empty string", () => {
      expect(() => {
        shareEstimateByEmail(mockEstimate, mockFeatures, "");
      }).not.toThrow();
    });

    it("still calls window.open when toEmail is empty", () => {
      shareEstimateByEmail(mockEstimate, mockFeatures, "");
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it("still creates a blob URL when toEmail is empty", () => {
      shareEstimateByEmail(mockEstimate, mockFeatures, "");
      expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    });
  });

  describe("does not throw with valid inputs", () => {
    it("does not throw when called with valid estimate and features", () => {
      expect(() => {
        shareEstimateByEmail(mockEstimate, mockFeatures, "valid@example.com");
      }).not.toThrow();
    });

    it("does not throw when selectedFeatures is an empty array", () => {
      expect(() => {
        shareEstimateByEmail(mockEstimate, [], "valid@example.com");
      }).not.toThrow();
    });

    it("does not throw when featureCount is 1 (singular label path)", () => {
      const singleFeatureEstimate = { ...mockEstimate, featureCount: 1 };
      expect(() => {
        shareEstimateByEmail(singleFeatureEstimate, mockFeatures, "test@example.com");
      }).not.toThrow();
    });

    it("does not throw when minWeeks are large (months formatting path)", () => {
      const longEstimate = {
        ...mockEstimate,
        minWeeks: 10,
        maxWeeks: 20,
      };
      expect(() => {
        shareEstimateByEmail(longEstimate, mockFeatures, "test@example.com");
      }).not.toThrow();
    });
  });
});
