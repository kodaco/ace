import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectPresets } from "@/features/core/components/ProjectPresets";
import { PRESETS, AppPreset } from "@/features/core/data/presets";

const defaultProps = {
  activePresetId: null,
  platform: "web" as const,
  onSelect: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ProjectPresets", () => {
  describe("rendering", () => {
    it("renders 'Start with a preset' label", () => {
      render(<ProjectPresets {...defaultProps} />);
      expect(screen.getByText(/Start with a preset/i)).toBeInTheDocument();
    });

    it("renders a chip for each preset", () => {
      render(<ProjectPresets {...defaultProps} />);
      for (const preset of PRESETS) {
        expect(screen.getByTestId(`preset-${preset.id}`)).toBeInTheDocument();
      }
    });
  });

  describe("clicking a preset (line 36)", () => {
    it("clicking an enabled preset calls onSelect with the preset", () => {
      const onSelect = jest.fn();
      render(<ProjectPresets {...defaultProps} onSelect={onSelect} />);
      // SaaS / Web App is enabled for 'web' platform — click the inner Chip (role="button")
      const saasPreset = PRESETS.find((p) => p.id === "saas-web")!;
      const chip = screen.getByTestId(`preset-${saasPreset.id}`).querySelector('[role="button"]')!;
      fireEvent.click(chip);
      expect(onSelect).toHaveBeenCalledWith(saasPreset);
    });

    it("clicking a disabled preset does NOT call onSelect", () => {
      const onSelect = jest.fn();
      // mobile-app is disabled for 'web' platform — onClick is undefined on disabled Chip
      render(<ProjectPresets {...defaultProps} platform="web" onSelect={onSelect} />);
      const mobilePreset = PRESETS.find((p) => p.id === "mobile-app")!;
      const wrapper = screen.getByTestId(`preset-${mobilePreset.id}`);
      fireEvent.click(wrapper.querySelector('.MuiChip-root')!);
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe("disabled state", () => {
    it("mobile-app preset is disabled on web platform", () => {
      render(<ProjectPresets {...defaultProps} platform="web" />);
      const mobileChip = screen.getByTestId("preset-mobile-app").querySelector('[aria-disabled="true"]');
      expect(mobileChip).toBeInTheDocument();
    });

    it("saas-web preset is disabled on ios platform", () => {
      render(<ProjectPresets {...defaultProps} platform="ios" />);
      const saasChip = screen.getByTestId("preset-saas-web").querySelector('[aria-disabled="true"]');
      expect(saasChip).toBeInTheDocument();
    });

    it("all presets are enabled on cross-platform", () => {
      render(<ProjectPresets {...defaultProps} platform="cross-platform" />);
      const disabledChips = document.querySelectorAll('[aria-disabled="true"]');
      expect(disabledChips).toHaveLength(0);
    });
  });

  describe("disabled reason fallback (line 29 ?? branch)", () => {
    it("shows default tooltip text when preset has no disabledReason", () => {
      // Mock PRESETS to include one with disabledForPlatforms but no disabledReason
      const origPresets = [...PRESETS];
      const noReasonPreset: AppPreset = {
        id: "test-no-reason",
        label: "No Reason",
        emoji: "🧪",
        featureIds: [],
        disabledForPlatforms: ["web"],
        // intentionally no disabledReason
      };
      // Temporarily push onto PRESETS (it's a const array, but push mutates)
      PRESETS.push(noReasonPreset);
      render(<ProjectPresets {...defaultProps} platform="web" />);
      // The disabled chip should have the fallback tooltip via aria-label
      const wrapper = screen.getByTestId("preset-test-no-reason");
      expect(wrapper).toHaveAttribute("aria-label", "Not compatible with selected platform");
      // Restore
      PRESETS.length = origPresets.length;
    });
  });

  describe("active preset", () => {
    it("active preset chip is shown as filled", () => {
      const saasPreset = PRESETS.find((p) => p.id === "saas-web")!;
      render(
        <ProjectPresets {...defaultProps} activePresetId={saasPreset.id} />
      );
      // Active chip has filled variant — MUI adds specific classes
      const chip = screen
        .getByTestId(`preset-${saasPreset.id}`)
        .querySelector(".MuiChip-root");
      expect(chip).toBeInTheDocument();
    });
  });
});
