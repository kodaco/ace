import {
  encodeEstimateState,
  decodeEstimateState,
} from "@/features/core/services/estimate-url";

const validState = {
  featureIds: ["user-auth", "payments"],
  rate: 150,
  ai: true,
};

describe("estimate-url", () => {
  describe("encodeEstimateState", () => {
    it("returns a non-empty string", () => {
      expect(encodeEstimateState(validState)).toBeTruthy();
    });

    it("encoded string does not contain +, /, or = padding (URL-safe)", () => {
      const encoded = encodeEstimateState(validState);
      expect(encoded).not.toMatch(/[+/=]/);
    });

    it("encodes an empty feature list", () => {
      const encoded = encodeEstimateState({ featureIds: [], rate: 100, ai: false });
      expect(encoded).toBeTruthy();
    });
  });

  describe("decodeEstimateState", () => {
    it("round-trips back to the original state", () => {
      const encoded = encodeEstimateState(validState);
      const decoded = decodeEstimateState(encoded);
      expect(decoded).toEqual(validState);
    });

    it("returns null for invalid base64 input (catch branch)", () => {
      expect(decodeEstimateState("!!!not-base64!!!")).toBeNull();
    });

    it("returns null when decoded JSON has wrong shape (missing fields)", () => {
      // Valid base64 of JSON that doesn't match the expected shape
      const badPayload = btoa(JSON.stringify({ wrong: "shape" }));
      expect(decodeEstimateState(badPayload)).toBeNull();
    });

    it("returns null when decoded JSON has correct keys but wrong types", () => {
      const badTypes = btoa(
        JSON.stringify({ f: "not-an-array", r: "not-a-number", ai: false })
      );
      expect(decodeEstimateState(badTypes)).toBeNull();
    });

    it("decodes state with AI toggle set to true", () => {
      const encoded = encodeEstimateState({ ...validState, ai: true });
      expect(decodeEstimateState(encoded)?.ai).toBe(true);
    });

    it("decodes state with AI toggle set to false", () => {
      const encoded = encodeEstimateState({ ...validState, ai: false });
      expect(decodeEstimateState(encoded)?.ai).toBe(false);
    });
  });
});
