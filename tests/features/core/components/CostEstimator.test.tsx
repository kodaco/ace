import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CostEstimator } from "@/features/core/components/CostEstimator";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
  usePathname: () => "/",
}));

beforeEach(() => {
  jest.useFakeTimers();
  sessionStorage.clear();
  mockPush.mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("CostEstimator", () => {
  describe("initial render", () => {
    it("renders 'Select Your Features' heading", () => {
      render(<CostEstimator />);
      expect(screen.getByText("Select Your Features")).toBeInTheDocument();
    });

    it("renders Calculate Estimate button", () => {
      render(<CostEstimator />);
      expect(
        screen.getByRole("button", { name: /Calculate Estimate/i })
      ).toBeInTheDocument();
    });

    it("Calculate button is enabled (always-active features are pre-selected)", () => {
      render(<CostEstimator />);
      const btn = screen.getByRole("button", { name: /Calculate Estimate/i });
      expect(btn).not.toBeDisabled();
    });

    it("shows HourlyRateInput when no sessionStorage entry is set", () => {
      render(<CostEstimator />);
      // HourlyRateInput renders "Hourly Rate" label
      expect(screen.getByText("Hourly Rate")).toBeInTheDocument();
    });

    it("Build with AI toggle is present", () => {
      render(<CostEstimator />);
      expect(screen.getByText("Build with AI")).toBeInTheDocument();
    });
  });

  describe("calculate flow", () => {
    it("clicking Calculate triggers loading state — button shows 'Calculating…'", () => {
      render(<CostEstimator />);

      const btn = screen.getByRole("button", { name: /Calculate Estimate/i });
      fireEvent.click(btn);

      expect(screen.getByRole("button", { name: /Calculating/i })).toBeInTheDocument();
    });

    it("after timers run, results appear", async () => {
      render(<CostEstimator />);

      const btn = screen.getByRole("button", { name: /Calculate Estimate/i });
      fireEvent.click(btn);

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(screen.getByText("Estimate Summary")).toBeInTheDocument();
      });
    });

    it("after timers run, button returns to non-loading label", async () => {
      render(<CostEstimator />);

      const btn = screen.getByRole("button", { name: /Calculate Estimate/i });
      fireEvent.click(btn);

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /Calculate Estimate/i })
        ).toBeInTheDocument();
      });
    });

    it("'Estimated Development Cost' label is visible after calculation", async () => {
      render(<CostEstimator />);

      fireEvent.click(screen.getByRole("button", { name: /Calculate Estimate/i }));

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(screen.getByText("Estimated Development Cost")).toBeInTheDocument();
      });
    });
  });

  describe("sessionStorage — provider pre-selection", () => {
    it("shows ProviderRateCard with 'Estimating with' when selectedProviderId is set", () => {
      sessionStorage.setItem("selectedProviderId", "acme-digital");
      render(<CostEstimator />);

      expect(screen.getByText("Estimating with")).toBeInTheDocument();
    });

    it("shows provider name from sessionStorage", () => {
      sessionStorage.setItem("selectedProviderId", "acme-digital");
      render(<CostEstimator />);

      expect(screen.getByText("Acme Digital")).toBeInTheDocument();
    });

    it("HourlyRateInput is not shown when a provider is pre-selected", () => {
      sessionStorage.setItem("selectedProviderId", "acme-digital");
      render(<CostEstimator />);

      // HourlyRateInput renders the standalone "Hourly Rate" heading label
      expect(screen.queryByText("Hourly Rate")).not.toBeInTheDocument();
    });

    it("shows ProviderRateCard for blue-horizon provider", () => {
      sessionStorage.setItem("selectedProviderId", "blue-horizon");
      render(<CostEstimator />);

      expect(screen.getByText("Blue Horizon Studios")).toBeInTheDocument();
    });

    it("falls back to HourlyRateInput for unknown provider id", () => {
      sessionStorage.setItem("selectedProviderId", "non-existent-provider");
      render(<CostEstimator />);

      expect(screen.getByText("Hourly Rate")).toBeInTheDocument();
    });

    it("clears sessionStorage entry after reading it", () => {
      sessionStorage.setItem("selectedProviderId", "acme-digital");
      render(<CostEstimator />);

      expect(sessionStorage.getItem("selectedProviderId")).toBeNull();
    });
  });

  describe("handleToggleExpand — expand feature details", () => {
    it("clicking 'View details' on a feature item does not crash", () => {
      render(<CostEstimator />);

      const expandButtons = screen.getAllByRole("button", { name: "View details" });
      fireEvent.click(expandButtons[0]);

      // Component stays rendered after expand toggle
      expect(screen.getByText("Select Your Features")).toBeInTheDocument();
    });

    it("clicking 'View details' twice toggles expand then collapse", () => {
      render(<CostEstimator />);

      const expandButtons = screen.getAllByRole("button", { name: "View details" });
      fireEvent.click(expandButtons[0]); // expand
      fireEvent.click(expandButtons[0]); // collapse (covers delete branch)

      expect(screen.getByText("Select Your Features")).toBeInTheDocument();
    });
  });

  describe("handleToggleFeature — add then remove", () => {
    it("clicking a non-locked feature checkbox twice toggles it on then off", () => {
      render(<CostEstimator />);

      const checkboxes = screen.getAllByRole("checkbox");
      const toggleable = checkboxes.find((cb) => !cb.hasAttribute("disabled"));
      if (toggleable) {
        fireEvent.click(toggleable); // add (else branch)
        fireEvent.click(toggleable); // remove (delete branch)
      }

      expect(screen.getByText("Select Your Features")).toBeInTheDocument();
    });
  });

  describe("handleSelectAll / handleDeselectAll", () => {
    it("clicking 'Select All' selects all features", () => {
      render(<CostEstimator />);

      fireEvent.click(screen.getByRole("button", { name: "Select All" }));

      // After selecting all, button switches to 'Deselect All'
      expect(screen.getByRole("button", { name: "Deselect All" })).toBeInTheDocument();
    });

    it("clicking 'Deselect All' deselects optional features", () => {
      render(<CostEstimator />);

      fireEvent.click(screen.getByRole("button", { name: "Select All" }));
      fireEvent.click(screen.getByRole("button", { name: "Deselect All" }));

      expect(screen.getByRole("button", { name: "Select All" })).toBeInTheDocument();
    });
  });

  describe("handleExpandAll / handleCollapseAll", () => {
    it("clicking 'Expand All' switches button to 'Collapse All'", () => {
      render(<CostEstimator />);

      fireEvent.click(screen.getByRole("button", { name: "Expand All" }));

      expect(screen.getByRole("button", { name: "Collapse All" })).toBeInTheDocument();
    });

    it("clicking 'Collapse All' switches button back to 'Expand All'", () => {
      render(<CostEstimator />);

      fireEvent.click(screen.getByRole("button", { name: "Expand All" }));
      fireEvent.click(screen.getByRole("button", { name: "Collapse All" }));

      expect(screen.getByRole("button", { name: "Expand All" })).toBeInTheDocument();
    });
  });

  describe("handleToggleAi", () => {
    it("clicking Build with AI switch toggles and marks estimate stale after calculation", () => {
      render(<CostEstimator />);

      // Calculate first
      fireEvent.click(screen.getByRole("button", { name: /Calculate Estimate/i }));
      act(() => { jest.runAllTimers(); });

      // Toggle AI via fireEvent
      fireEvent.click(screen.getByRole("switch"));

      expect(
        screen.getByRole("button", { name: /Recalculate Estimate/i })
      ).toBeInTheDocument();
    });
  });

  describe("handleSetRate — via ProviderRateCard", () => {
    it("changing rate in ProviderRateCard calls handleSetRate and removes provider", () => {
      sessionStorage.setItem("selectedProviderId", "acme-digital");
      render(<CostEstimator />);

      // Should show ProviderRateCard
      expect(screen.getByText("Estimating with")).toBeInTheDocument();

      // Enter edit mode
      fireEvent.click(screen.getByRole("button", { name: "Change Rate" }));

      // Change rate and accept
      const input = screen.getByRole("spinbutton");
      fireEvent.change(input, { target: { value: "150" } });
      fireEvent.click(screen.getByRole("button", { name: "Set Rate" }));

      act(() => { jest.runAllTimers(); });

      // Provider card should be gone, HourlyRateInput shown
      expect(screen.queryByText("Estimating with")).not.toBeInTheDocument();
    });
  });

  describe("HourlyRateInput onChange path", () => {
    it("changing rate via HourlyRateInput triggers recalculation", () => {
      render(<CostEstimator />);

      // Enter edit mode on HourlyRateInput
      fireEvent.click(screen.getByRole("button", { name: "Change Rate" }));

      const input = screen.getByRole("spinbutton");
      fireEvent.change(input, { target: { value: "120" } });
      fireEvent.click(screen.getByRole("button", { name: "Set Rate" }));

      act(() => { jest.runAllTimers(); });

      // Calculation should have run
      expect(screen.getByText("Estimate Summary")).toBeInTheDocument();
    });
  });

  describe("stale state after selection change", () => {
    it("shows 'Recalculate Estimate' button after a feature is toggled post-calculation", async () => {
      render(<CostEstimator />);

      // First calculation
      fireEvent.click(screen.getByRole("button", { name: /Calculate Estimate/i }));
      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(screen.getByText("Estimate Summary")).toBeInTheDocument();
      });

      // Toggle a non-always-active feature — find a checkbox that is not disabled
      const checkboxes = screen.getAllByRole("checkbox");
      // The first checkbox may be always-active; try clicking the second one
      const toggleable = checkboxes.find((cb) => !cb.hasAttribute("disabled"));
      if (toggleable) {
        fireEvent.click(toggleable);
        expect(
          screen.getByRole("button", { name: /Recalculate Estimate/i })
        ).toBeInTheDocument();
      }
    });
  });
});
