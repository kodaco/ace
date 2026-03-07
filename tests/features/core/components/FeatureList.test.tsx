import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeatureList } from "@/features/core/components/FeatureList";
import { AppFeature } from "@/features/core/models";

const mockFeatures: AppFeature[] = [
  {
    id: "feature-a",
    name: "Feature A",
    description: "Description for Feature A",
    details: "Details for Feature A",
    factors: "Factors for Feature A",
    minHours: 10,
    maxHours: 20,
  },
  {
    id: "feature-b",
    name: "Feature B",
    description: "Description for Feature B",
    details: "Details for Feature B",
    factors: "Factors for Feature B",
    minHours: 30,
    maxHours: 60,
  },
];

const baseProps = {
  features: mockFeatures,
  selectedIds: new Set<string>(),
  expandedIds: new Set<string>(),
  buildWithAi: false,
  onToggle: jest.fn(),
  onToggleExpand: jest.fn(),
};

describe("FeatureList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("heading", () => {
    it("renders 'Select Your Features' heading", () => {
      render(<FeatureList {...baseProps} />);
      expect(screen.getByText("Select Your Features")).toBeInTheDocument();
    });
  });

  describe("feature items", () => {
    it("renders all provided features by name", () => {
      render(<FeatureList {...baseProps} />);
      expect(screen.getByText("Feature A")).toBeInTheDocument();
      expect(screen.getByText("Feature B")).toBeInTheDocument();
    });

    it("renders each feature item in the list", () => {
      render(<FeatureList {...baseProps} />);
      expect(screen.getByText("Description for Feature A")).toBeInTheDocument();
      expect(screen.getByText("Description for Feature B")).toBeInTheDocument();
    });
  });

  describe("ButtonGroup — select all / deselect all", () => {
    it("shows 'Select All' button when allSelected=false and onSelectAll is provided", () => {
      render(
        <FeatureList
          {...baseProps}
          allSelected={false}
          onSelectAll={jest.fn()}
          onExpandAll={jest.fn()}
        />
      );
      expect(screen.getByRole("button", { name: "Select All" })).toBeInTheDocument();
    });

    it("shows 'Deselect All' button when allSelected=true", () => {
      render(
        <FeatureList
          {...baseProps}
          allSelected={true}
          onDeselectAll={jest.fn()}
          onSelectAll={jest.fn()}
          onExpandAll={jest.fn()}
        />
      );
      expect(screen.getByRole("button", { name: "Deselect All" })).toBeInTheDocument();
    });

    it("clicking 'Select All' calls onSelectAll", async () => {
      const onSelectAll = jest.fn();
      const user = userEvent.setup();
      render(
        <FeatureList
          {...baseProps}
          allSelected={false}
          onSelectAll={onSelectAll}
          onExpandAll={jest.fn()}
        />
      );

      await user.click(screen.getByRole("button", { name: "Select All" }));

      expect(onSelectAll).toHaveBeenCalledTimes(1);
    });

    it("clicking 'Deselect All' calls onDeselectAll", async () => {
      const onDeselectAll = jest.fn();
      const user = userEvent.setup();
      render(
        <FeatureList
          {...baseProps}
          allSelected={true}
          onSelectAll={jest.fn()}
          onDeselectAll={onDeselectAll}
          onExpandAll={jest.fn()}
        />
      );

      await user.click(screen.getByRole("button", { name: "Deselect All" }));

      expect(onDeselectAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("ButtonGroup — expand all / collapse all", () => {
    it("shows 'Expand All' button when allExpanded=false and onExpandAll is provided", () => {
      render(
        <FeatureList
          {...baseProps}
          allExpanded={false}
          onSelectAll={jest.fn()}
          onExpandAll={jest.fn()}
        />
      );
      expect(screen.getByRole("button", { name: "Expand All" })).toBeInTheDocument();
    });

    it("shows 'Collapse All' button when allExpanded=true", () => {
      render(
        <FeatureList
          {...baseProps}
          allExpanded={true}
          onSelectAll={jest.fn()}
          onExpandAll={jest.fn()}
          onCollapseAll={jest.fn()}
        />
      );
      expect(screen.getByRole("button", { name: "Collapse All" })).toBeInTheDocument();
    });

    it("clicking 'Expand All' calls onExpandAll", async () => {
      const onExpandAll = jest.fn();
      const user = userEvent.setup();
      render(
        <FeatureList
          {...baseProps}
          allExpanded={false}
          onSelectAll={jest.fn()}
          onExpandAll={onExpandAll}
        />
      );

      await user.click(screen.getByRole("button", { name: "Expand All" }));

      expect(onExpandAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("onToggleExpand wrapper", () => {
    it("clicking 'View details' on a feature calls onToggleExpand with that feature's id", async () => {
      const onToggleExpand = jest.fn();
      const user = userEvent.setup();
      render(<FeatureList {...baseProps} onToggleExpand={onToggleExpand} />);

      const expandButtons = screen.getAllByRole("button", { name: "View details" });
      await user.click(expandButtons[0]);

      expect(onToggleExpand).toHaveBeenCalledWith("feature-a");
    });
  });

  describe("ButtonGroup — not rendered without callbacks", () => {
    it("does not render any ButtonGroup buttons when no callbacks are provided", () => {
      render(<FeatureList {...baseProps} />);
      // No select or expand buttons should be present
      expect(screen.queryByRole("button", { name: "Select All" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Expand All" })).not.toBeInTheDocument();
    });
  });
});
