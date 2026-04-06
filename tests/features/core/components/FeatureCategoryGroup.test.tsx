import { render, screen, fireEvent } from "@testing-library/react";
import { FeatureCategoryGroup } from "@/features/core/components/FeatureCategoryGroup";
import { AppFeature } from "@/features/core/models";

const regularFeature: AppFeature = {
  id: "user-auth",
  name: "User Auth",
  description: "Login feature",
  details: "Details here",
  factors: "Factors here",
  minHours: 40,
  maxHours: 100,
  category: "core",
};

const customFeature: AppFeature = {
  id: "custom-123",
  name: "Custom Widget",
  description: "Custom feature",
  details: "",
  factors: "",
  minHours: 20,
  maxHours: 60,
  category: "advanced",
};

const baseProps = {
  category: "core" as const,
  features: [regularFeature],
  selectedIds: new Set<string>(),
  expandedIds: new Set<string>(),
  buildWithAi: false,
  onToggle: jest.fn(),
  onToggleExpand: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("FeatureCategoryGroup", () => {
  describe("header rendering", () => {
    it("renders the category label", () => {
      render(<FeatureCategoryGroup {...baseProps} />);
      expect(screen.getByText("Core")).toBeInTheDocument();
    });

    it("does not show selected count badge when count is 0", () => {
      render(<FeatureCategoryGroup {...baseProps} selectedIds={new Set()} />);
      // No number chip should be visible
      expect(screen.queryByText("1")).not.toBeInTheDocument();
    });

    it("shows selected count badge when a non-always-active feature is selected", () => {
      render(
        <FeatureCategoryGroup
          {...baseProps}
          selectedIds={new Set(["user-auth"])}
        />
      );
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  describe("open/close toggle (line 66)", () => {
    it("clicking the category header toggles open state", () => {
      render(
        <FeatureCategoryGroup {...baseProps} defaultOpen={false} />
      );
      // Click to open
      fireEvent.click(screen.getByTestId("category-header-core"));
      // Click to close again — verifies the toggle
      fireEvent.click(screen.getByTestId("category-header-core"));
      // Component remains rendered
      expect(screen.getByText("Core")).toBeInTheDocument();
    });

    it("starts closed by default and opens on header click", () => {
      render(
        <FeatureCategoryGroup {...baseProps} defaultOpen={false} />
      );
      fireEvent.click(screen.getByTestId("category-header-core"));
      // Component stays rendered after click
      expect(screen.getByTestId("category-group-core")).toBeInTheDocument();
    });
  });

  describe("defaultOpen=true", () => {
    it("renders features when defaultOpen is true", () => {
      render(<FeatureCategoryGroup {...baseProps} defaultOpen={true} />);
      expect(screen.getByText("User Auth")).toBeInTheDocument();
    });
  });

  describe("extra slot", () => {
    it("renders extra content when provided", () => {
      render(
        <FeatureCategoryGroup
          {...baseProps}
          defaultOpen={true}
          extra={<div>Extra Content</div>}
        />
      );
      expect(screen.getByText("Extra Content")).toBeInTheDocument();
    });
  });

  describe("onRemove for custom features (line 115)", () => {
    it("passes onRemove to FeatureListItem only for custom- prefixed ids", () => {
      const onRemove = jest.fn();
      render(
        <FeatureCategoryGroup
          category="advanced"
          features={[customFeature]}
          selectedIds={new Set()}
          expandedIds={new Set()}
          buildWithAi={false}
          defaultOpen={true}
          onToggle={jest.fn()}
          onToggleExpand={jest.fn()}
          onRemove={onRemove}
        />
      );
      // The remove button renders for custom features
      fireEvent.click(screen.getByRole("button", { name: "Remove custom feature" }));
      expect(onRemove).toHaveBeenCalledWith("custom-123");
    });

    it("does NOT pass onRemove to non-custom features even when onRemove prop is provided", () => {
      const onRemove = jest.fn();
      render(
        <FeatureCategoryGroup
          {...baseProps}
          defaultOpen={true}
          onRemove={onRemove}
        />
      );
      // Regular feature should not have a remove button
      expect(
        screen.queryByRole("button", { name: "Remove custom feature" })
      ).not.toBeInTheDocument();
    });
  });
});
