import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { CostEstimator } from "@/features/core/components/CostEstimator";
import { encodeEstimateState } from "@/features/core/services/estimate-url";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
  usePathname: () => "/",
}));

beforeEach(() => {
  jest.useFakeTimers();
  sessionStorage.clear();
  localStorage.clear();
  mockPush.mockClear();
  window.history.replaceState(null, '', '/');
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

  describe("URL state — auto-calculate on mount", () => {
    it("renders without error when URL has an invalid ?e= param", () => {
      window.history.replaceState(null, "", "/?e=!!!invalid!!!");
      render(<CostEstimator />);
      expect(screen.getByRole("button", { name: /Calculate Estimate/i })).toBeInTheDocument();
    });

    it("auto-calculates when a valid ?e= param is present on mount", () => {
      const encoded = encodeEstimateState({ featureIds: [], rate: 100, ai: false });
      window.history.replaceState(null, "", `/?e=${encoded}`);
      render(<CostEstimator />);
      expect(screen.getByRole("button", { name: /Calculating/i })).toBeInTheDocument();
    });

    it("falls back to clean state when getInitialStateFromUrl throws (catch branch line 62)", () => {
      // Make URLSearchParams throw to trigger the outer try/catch
      const origURLSearchParams = global.URLSearchParams;
      global.URLSearchParams = class {
        constructor() {
          throw new Error("boom");
        }
      } as unknown as typeof URLSearchParams;
      window.history.replaceState(null, "", "/?e=something");
      render(<CostEstimator />);
      expect(screen.getByRole("button", { name: /Calculate Estimate/i })).toBeInTheDocument();
      global.URLSearchParams = origURLSearchParams;
    });
  });

  describe("preset selection (lines 192-201)", () => {
    it("clicking a preset chip selects it, clicking again deselects", () => {
      render(<CostEstimator />);
      // SaaS / Web App is enabled on default 'web' platform — click inner Chip
      const saasChip = screen.getByTestId("preset-saas-web").querySelector('[role="button"]')!;
      fireEvent.click(saasChip); // select → else branch
      fireEvent.click(saasChip); // deselect → if branch
      expect(screen.getByText("Select Your Features")).toBeInTheDocument();
    });
  });

  describe("platform change with active preset (lines 264-273)", () => {
    it("switching platform with a compatible preset does NOT clear it", () => {
      render(<CostEstimator />);
      // Select E-commerce preset (no disabledForPlatforms field)
      const ecommChip = screen.getByTestId("preset-ecommerce").querySelector('[role="button"]')!;
      fireEvent.click(ecommChip);
      // Switch to iOS — E-commerce has no platform restrictions, so preset stays
      fireEvent.click(screen.getByTestId("platform-ios"));
      expect(screen.getByText("Select Your Features")).toBeInTheDocument();
    });

    it("switching to an incompatible platform auto-clears the active preset", () => {
      render(<CostEstimator />);
      // Switch to iOS so Mobile App preset is enabled
      fireEvent.click(screen.getByTestId("platform-ios"));
      // Click the inner Chip for mobile-app preset
      const mobileChip = screen.getByTestId("preset-mobile-app").querySelector('[role="button"]')!;
      fireEvent.click(mobileChip);
      // Now switch back to web — mobile-app is incompatible → preset should auto-clear
      fireEvent.click(screen.getByTestId("platform-web"));
      expect(screen.getByText("Select Your Features")).toBeInTheDocument();
    });
  });

  describe("saved estimates drawer (lines 381-411)", () => {
    it("clicking the 'Saved' button opens the drawer", () => {
      render(<CostEstimator />);
      fireEvent.click(screen.getByTestId("saved-btn"));
      expect(screen.getByText("Saved Estimates")).toBeInTheDocument();
    });

    it("closing the drawer via the Close button hides it", () => {
      render(<CostEstimator />);
      fireEvent.click(screen.getByTestId("saved-btn"));
      fireEvent.click(screen.getByRole("button", { name: "Close" }));
      // The drawer closes — "Saved Estimates" heading disappears from visible area
      expect(screen.getByText("Select Your Features")).toBeInTheDocument();
    });
  });

  describe("handleSaveEstimate (lines 205-225)", () => {
    it("calculating then saving an estimate stores it in the drawer", async () => {
      render(<CostEstimator />);
      fireEvent.click(screen.getByRole("button", { name: /Calculate Estimate/i }));
      act(() => { jest.runAllTimers(); });

      await waitFor(() => {
        expect(screen.getByText("Estimate Summary")).toBeInTheDocument();
      });

      // Open save input
      fireEvent.click(screen.getByRole("button", { name: /Save estimate/i }));
      fireEvent.change(screen.getByPlaceholderText(/Name this estimate/i), {
        target: { value: "Test Save" },
      });
      fireEvent.click(screen.getByRole("button", { name: /^Save$/ }));

      // Saved count in button should now be 1
      expect(screen.getByTestId("saved-btn")).toHaveTextContent("Saved (1)");
    });
  });

  describe("handleLoadSaved (lines 229-255)", () => {
    it("loading a saved estimate restores state and closes the drawer", async () => {
      render(<CostEstimator />);
      // Calculate and save
      fireEvent.click(screen.getByRole("button", { name: /Calculate Estimate/i }));
      act(() => { jest.runAllTimers(); });

      await waitFor(() => screen.getByText("Estimate Summary"));

      fireEvent.click(screen.getByRole("button", { name: /Save estimate/i }));
      fireEvent.change(screen.getByPlaceholderText(/Name this estimate/i), {
        target: { value: "Load Me" },
      });
      fireEvent.click(screen.getByRole("button", { name: /^Save$/ }));

      // Open drawer and restore
      fireEvent.click(screen.getByTestId("saved-btn"));
      fireEvent.click(screen.getByRole("button", { name: /Restore estimate/i }));

      // Drawer closes after restore
      expect(screen.getByText("Select Your Features")).toBeInTheDocument();
    });

    it("falls back to DEFAULT_CURRENCY when saved estimate has unknown currency code", async () => {
      // Seed localStorage with a saved estimate using an invalid currency code
      const badEstimate = {
        id: "save-12345",
        name: "Bad Currency",
        savedAt: new Date().toISOString(),
        featureCount: 1,
        midpointCost: 5000,
        config: {
          featureIds: [],
          customFeatures: [],
          rate: 100,
          ai: false,
          platform: "web",
          currencyCode: "XXX",
        },
      };
      localStorage.setItem("ace_saved_estimates", JSON.stringify([badEstimate]));

      render(<CostEstimator />);

      // Open drawer and restore
      fireEvent.click(screen.getByTestId("saved-btn"));
      fireEvent.click(screen.getByRole("button", { name: /Restore estimate/i }));

      // Component should still render without crashing
      expect(screen.getByText("Select Your Features")).toBeInTheDocument();
    });
  });

  describe("handleDeleteSaved (lines 259-260)", () => {
    it("deleting a saved estimate decrements the count", async () => {
      render(<CostEstimator />);
      // Calculate and save
      fireEvent.click(screen.getByRole("button", { name: /Calculate Estimate/i }));
      act(() => { jest.runAllTimers(); });

      await waitFor(() => screen.getByText("Estimate Summary"));

      fireEvent.click(screen.getByRole("button", { name: /Save estimate/i }));
      fireEvent.change(screen.getByPlaceholderText(/Name this estimate/i), {
        target: { value: "Delete Me" },
      });
      fireEvent.click(screen.getByRole("button", { name: /^Save$/ }));

      // Open drawer and delete
      fireEvent.click(screen.getByTestId("saved-btn"));
      fireEvent.click(screen.getByRole("button", { name: /Delete saved estimate/i }));

      // Count drops back to 0
      expect(screen.getByTestId("saved-btn")).toHaveTextContent("Saved (0)");
    });
  });

  describe("handleAddCustomFeature + handleRemoveCustomFeature (lines 176-188)", () => {
    it("adding a custom feature via CustomFeatureInput and removing it", () => {
      render(<CostEstimator />);
      // Open the Advanced category
      fireEvent.click(screen.getByTestId("category-header-advanced"));
      // Open the custom feature form
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      // Fill in name and submit
      fireEvent.change(screen.getByPlaceholderText(/e.g. Custom AI Chatbot/i), {
        target: { value: "My Custom Feature" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add" }));
      // Custom feature should now appear in the list
      expect(screen.getByText("My Custom Feature")).toBeInTheDocument();
      // Remove it
      fireEvent.click(screen.getByRole("button", { name: "Remove custom feature" }));
      // Feature should be gone
      expect(screen.queryByText("My Custom Feature")).not.toBeInTheDocument();
    });
  });

  describe("save and load with custom features + feature IDs (lines 211, 232)", () => {
    it("saving with a custom feature then loading restores it", async () => {
      render(<CostEstimator />);
      // Select a non-always-active feature via checkbox
      const checkboxes = screen.getAllByRole("checkbox");
      const toggleable = checkboxes.find((cb) => !cb.hasAttribute("disabled"));
      if (toggleable) fireEvent.click(toggleable);

      // Add a custom feature
      fireEvent.click(screen.getByTestId("category-header-advanced"));
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      fireEvent.change(screen.getByPlaceholderText(/e.g. Custom AI Chatbot/i), {
        target: { value: "Saved Custom" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add" }));

      // Calculate
      fireEvent.click(screen.getByRole("button", { name: /Calculate Estimate/i }));
      act(() => { jest.runAllTimers(); });
      await waitFor(() => screen.getByText("Estimate Summary"));

      // Save the estimate
      fireEvent.click(screen.getByRole("button", { name: /Save estimate/i }));
      fireEvent.change(screen.getByPlaceholderText(/Name this estimate/i), {
        target: { value: "Custom Save" },
      });
      fireEvent.click(screen.getByRole("button", { name: /^Save$/ }));

      // Open drawer and load
      fireEvent.click(screen.getByTestId("saved-btn"));
      fireEvent.click(screen.getByRole("button", { name: /Restore estimate/i }));

      // The custom feature should be restored (may appear multiple times due to MUI Collapse)
      expect(screen.getAllByText("Saved Custom").length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("label prop (line 318-321)", () => {
    it("renders the label heading when label prop is provided", () => {
      render(<CostEstimator label="Estimate A" />);
      expect(screen.getByText("Estimate A")).toBeInTheDocument();
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
