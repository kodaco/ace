import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeatureListItem } from "@/features/core/components/FeatureListItem";
import { AppFeature } from "@/features/core/models";
import { AI_DEV_MULTIPLIER } from "@/features/core/data/predefined-features";

// A regular (non-locked, non-maintenance) feature with known hour values
const mockFeature: AppFeature = {
  id: "test-feature",
  name: "Test Feature",
  description: "A test feature description",
  details: "Detailed explanation of the feature",
  factors: "Project scope and integrations affect complexity",
  minHours: 40,
  maxHours: 100,
};

// A locked feature (alwaysActive = true)
const lockedFeature: AppFeature = {
  ...mockFeature,
  id: "ui-ux-design",
  name: "UI/UX Design",
  alwaysActive: true,
};

const baseProps = {
  feature: mockFeature,
  selected: false,
  expanded: false,
  locked: false,
  buildWithAi: false,
  onToggle: jest.fn(),
  onToggleExpand: jest.fn(),
};

describe("FeatureListItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("feature content", () => {
    it("renders the feature name", () => {
      render(<FeatureListItem {...baseProps} />);
      expect(screen.getByText("Test Feature")).toBeInTheDocument();
    });

    it("renders the feature description", () => {
      render(<FeatureListItem {...baseProps} />);
      expect(screen.getByText("A test feature description")).toBeInTheDocument();
    });
  });

  describe("checkbox (unlocked feature)", () => {
    it("shows a checkbox when locked=false", () => {
      render(<FeatureListItem {...baseProps} locked={false} />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("checkbox is checked when selected=true", () => {
      render(<FeatureListItem {...baseProps} selected={true} />);
      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("checkbox is unchecked when selected=false", () => {
      render(<FeatureListItem {...baseProps} selected={false} />);
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("clicking the card row calls onToggle", async () => {
      const onToggle = jest.fn();
      const user = userEvent.setup();
      render(<FeatureListItem {...baseProps} onToggle={onToggle} />);

      // Click the feature name area (which is part of the clickable row)
      await user.click(screen.getByText("Test Feature"));

      expect(onToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe("locked feature", () => {
    it("shows 'Always Included' chip when locked=true", () => {
      render(<FeatureListItem {...baseProps} feature={lockedFeature} locked={true} />);
      expect(screen.getByText("Always Included")).toBeInTheDocument();
    });

    it("does not show a checkbox when locked=true", () => {
      render(<FeatureListItem {...baseProps} feature={lockedFeature} locked={true} />);
      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    });

    it("clicking the item row does NOT call onToggle when locked=true", async () => {
      const onToggle = jest.fn();
      const user = userEvent.setup();
      render(
        <FeatureListItem
          {...baseProps}
          feature={lockedFeature}
          locked={true}
          onToggle={onToggle}
        />
      );

      await user.click(screen.getByText("UI/UX Design"));

      expect(onToggle).not.toHaveBeenCalled();
    });
  });

  describe("expand button", () => {
    it("renders an expand button with aria-label 'View details'", () => {
      render(<FeatureListItem {...baseProps} />);
      expect(screen.getByRole("button", { name: "View details" })).toBeInTheDocument();
    });

    it("clicking the expand button calls onToggleExpand", async () => {
      const onToggleExpand = jest.fn();
      const user = userEvent.setup();
      render(<FeatureListItem {...baseProps} onToggleExpand={onToggleExpand} />);

      await user.click(screen.getByRole("button", { name: "View details" }));

      expect(onToggleExpand).toHaveBeenCalledTimes(1);
    });

    it("clicking the expand button does NOT call onToggle", async () => {
      const onToggle = jest.fn();
      const user = userEvent.setup();
      render(<FeatureListItem {...baseProps} onToggle={onToggle} />);

      await user.click(screen.getByRole("button", { name: "View details" }));

      expect(onToggle).not.toHaveBeenCalled();
    });
  });

  describe("expanded content — standard hours (buildWithAi=false)", () => {
    it("shows the standard estimated hour range when expanded and buildWithAi=false", () => {
      // minHours=40, maxHours=100, multiplier=1 → range 40–100
      render(<FeatureListItem {...baseProps} expanded={true} buildWithAi={false} />);

      expect(screen.getByText(/40/)).toBeInTheDocument();
      expect(screen.getByText(/100/)).toBeInTheDocument();
    });

    it("shows 'factors' text in the details section when expanded", () => {
      render(<FeatureListItem {...baseProps} expanded={true} />);
      expect(screen.getByText(/Project scope and integrations/i)).toBeInTheDocument();
    });

    it("shows the feature details text when expanded", () => {
      render(<FeatureListItem {...baseProps} expanded={true} />);
      expect(screen.getByText("Detailed explanation of the feature")).toBeInTheDocument();
    });
  });

  describe("expanded content — reduced hours (buildWithAi=true)", () => {
    it("shows reduced hour range (~75% of standard) when expanded and buildWithAi=true", () => {
      // minHours=40 * 0.75 = 30, maxHours=100 * 0.75 = 75
      const adjustedMin = Math.round(mockFeature.minHours * AI_DEV_MULTIPLIER); // 30
      const adjustedMax = Math.round(mockFeature.maxHours * AI_DEV_MULTIPLIER); // 75

      render(<FeatureListItem {...baseProps} expanded={true} buildWithAi={true} />);

      expect(screen.getByText(new RegExp(String(adjustedMin)))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(String(adjustedMax)))).toBeInTheDocument();
    });

    it("AI-adjusted hours are lower than standard hours", () => {
      const adjustedMax = Math.round(mockFeature.maxHours * AI_DEV_MULTIPLIER); // 75
      expect(adjustedMax).toBeLessThan(mockFeature.maxHours);
    });
  });

  describe("hour pill in collapsed view", () => {
    it("shows the average hours pill in collapsed view (buildWithAi=false)", () => {
      // averageHours = round((40+100)/2) = 70
      render(<FeatureListItem {...baseProps} expanded={false} buildWithAi={false} />);
      expect(screen.getByText("~70 hrs")).toBeInTheDocument();
    });

    it("shows the reduced average hours pill when buildWithAi=true", () => {
      // adjustedMin=30, adjustedMax=75, average = round((30+75)/2) = 53 (rounded)
      const adjustedMin = Math.round(mockFeature.minHours * AI_DEV_MULTIPLIER);
      const adjustedMax = Math.round(mockFeature.maxHours * AI_DEV_MULTIPLIER);
      const expected = Math.round((adjustedMin + adjustedMax) / 2);

      render(<FeatureListItem {...baseProps} expanded={false} buildWithAi={true} />);
      expect(screen.getByText(`~${expected} hrs`)).toBeInTheDocument();
    });
  });
});
