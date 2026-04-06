/**
 * Encode/decode calculator state to/from a compact URL param.
 * Shape: { f: string[], r: number, ai: boolean }
 * Encoded as base64url in the `e` query param.
 */

interface EstimateUrlState {
  featureIds: string[];
  rate: number;
  ai: boolean;
}

export function encodeEstimateState(state: EstimateUrlState): string {
  const payload = JSON.stringify({
    f: state.featureIds,
    r: state.rate,
    ai: state.ai,
  });
  // Use btoa with URI encoding to handle all characters
  return btoa(unescape(encodeURIComponent(payload)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeEstimateState(encoded: string): EstimateUrlState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const payload = decodeURIComponent(escape(atob(base64)));
    const parsed = JSON.parse(payload);
    if (
      Array.isArray(parsed.f) &&
      typeof parsed.r === "number" &&
      typeof parsed.ai === "boolean"
    ) {
      return { featureIds: parsed.f, rate: parsed.r, ai: parsed.ai };
    }
    return null;
  } catch {
    return null;
  }
}
