const STORAGE_KEY = "ace_saved_estimates";
const MAX_SAVED = 5;

export interface SavedEstimateConfig {
  featureIds: string[];
  customFeatures: Array<{ id: string; name: string; minHours: number; maxHours: number }>;
  rate: number;
  ai: boolean;
  platform: string;
  currencyCode: string;
}

export interface SavedEstimate {
  id: string;
  name: string;
  savedAt: string; // ISO string
  featureCount: number;
  midpointCost: number;
  config: SavedEstimateConfig;
}

function readAll(): SavedEstimate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedEstimate[]) : [];
  } catch {
    return [];
  }
}

function writeAll(items: SavedEstimate[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getSavedEstimates(): SavedEstimate[] {
  return readAll();
}

export function saveEstimate(
  name: string,
  config: SavedEstimateConfig,
  featureCount: number,
  midpointCost: number,
): SavedEstimate {
  const all = readAll();
  const entry: SavedEstimate = {
    id: `save-${Date.now()}`,
    name,
    savedAt: new Date().toISOString(),
    featureCount,
    midpointCost,
    config,
  };
  // Keep newest first, cap at MAX_SAVED
  const updated = [entry, ...all].slice(0, MAX_SAVED);
  writeAll(updated);
  return entry;
}

export function deleteSavedEstimate(id: string): void {
  writeAll(readAll().filter((e) => e.id !== id));
}
