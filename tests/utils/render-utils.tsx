import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";

// Shared mock data
export const mockEstimate = {
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

export const mockFeature = {
  id: "test-feature",
  name: "Test Feature",
  description: "A test feature description",
  details: "Detailed explanation",
  factors: "What affects the timeline",
  minHours: 40,
  maxHours: 100,
};

export const mockProvider = {
  id: "test-provider",
  name: "Test Agency",
  description: "A test agency description",
  hourlyRate: 120,
  tags: ["Full-service", "Local"],
  website: "https://example.com",
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, options);

export * from "@testing-library/react";
export { customRender as render };
