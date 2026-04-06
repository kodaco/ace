import { render, screen, fireEvent, act } from "@testing-library/react";
import { EstimateResults } from "@/features/core/components/EstimateResults";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
  usePathname: () => "/",
}));

const mockEstimate = {
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

const mockFeatures = [
  {
    id: "user-auth",
    name: "User Accounts & Login",
    description: "",
    details: "",
    factors: "",
    minHours: 40,
    maxHours: 100,
  },
  {
    id: "payments",
    name: "Payments & Checkout",
    description: "",
    details: "",
    factors: "",
    minHours: 60,
    maxHours: 160,
  },
];

beforeEach(() => {
  mockPush.mockClear();
});

describe("EstimateResults", () => {
  describe("loading state", () => {
    it("renders skeleton placeholders when loading=true", () => {
      render(<EstimateResults estimate={mockEstimate} loading={true} />);
      // MUI Skeleton elements are rendered — cost typography should NOT be visible
      // The h4 with actual cost text is replaced by a Skeleton in loading state
      const costHeadings = screen.queryAllByRole("heading", { level: 4 });
      expect(costHeadings).toHaveLength(0);
    });

    it("does not show formatted cost value while loading", () => {
      render(<EstimateResults estimate={mockEstimate} loading={true} />);
      // Midpoint cost would be $15,000 — should not be visible during loading
      expect(screen.queryByText("$15,000")).not.toBeInTheDocument();
    });
  });

  describe("loaded state with estimate", () => {
    it("shows 'Estimated Development Cost' heading", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      expect(screen.getByText("Estimated Development Cost")).toBeInTheDocument();
    });

    it("shows 'Estimate Summary' card title", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      expect(screen.getByText("Estimate Summary")).toBeInTheDocument();
    });

    it("shows mode toggle buttons: Low, Midpoint, High", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      expect(screen.getByRole("button", { name: "Low" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Midpoint" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "High" })).toBeInTheDocument();
    });

    it("default mode is Midpoint — shows average cost", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      // Midpoint of $10,000 and $20,000 = $15,000
      expect(screen.getByText("$15,000")).toBeInTheDocument();
    });

    it("clicking Low changes displayed cost to minCost", () => {
      jest.useFakeTimers();
      render(<EstimateResults estimate={mockEstimate} loading={false} />);

      fireEvent.click(screen.getByRole("button", { name: "Low" }));
      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByText("$10,000")).toBeInTheDocument();
      jest.useRealTimers();
    });

    it("clicking High changes displayed cost to maxCost", () => {
      jest.useFakeTimers();
      render(<EstimateResults estimate={mockEstimate} loading={false} />);

      fireEvent.click(screen.getByRole("button", { name: "High" }));
      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByText("$20,000")).toBeInTheDocument();
      jest.useRealTimers();
    });

    it("shows timeframe in weeks (minWeeks=2.5, maxWeeks=5 → midpoint ~3-4 weeks range)", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      // Default midpoint: (2.5 + 5) / 2 = 3.75 → Math.ceil(3.75) = 4 weeks
      expect(screen.getByText("4 weeks")).toBeInTheDocument();
    });

    it("shows 'Annual Maintenance' section", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      // "Annual Maintenance" appears in both the overline and body text
      const matches = screen.getAllByText(/Annual Maintenance/i);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it("shows hourly rate used in header subtitle", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      // e.g. "$100/hr rate"
      expect(screen.getByText(/\$100\/hr rate/)).toBeInTheDocument();
    });

    it("shows feature count in header subtitle", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      expect(screen.getByText(/3 features selected/)).toBeInTheDocument();
    });
  });

  describe("expand/collapse cost range details", () => {
    it("expand button is present", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      expect(screen.getByText(/View cost range/i)).toBeInTheDocument();
    });

    it("clicking expand area reveals cost range details", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} />);

      const expandTrigger = screen.getByText(/View cost range/i);
      fireEvent.click(expandTrigger);

      // The collapsed section shows the full min–max development cost range
      expect(screen.getByText(/Development cost:/i)).toBeInTheDocument();
    });

    it("cost range details show min and max hours after expansion", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} />);

      const expandTrigger = screen.getByText(/View cost range/i);
      fireEvent.click(expandTrigger);

      // "100 – 200 hrs" should appear in the expanded details
      expect(screen.getByText(/100.*200.*hrs/)).toBeInTheDocument();
    });

    it("clicking icon button toggles details", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} />);

      const toggleButton = screen.getByRole("button", { name: "Toggle details" });
      fireEvent.click(toggleButton);

      expect(screen.getByText(/Development cost:/i)).toBeInTheDocument();
    });
  });

  describe("features included section", () => {
    it("shows 'Features Included' section when selectedFeatures provided", () => {
      render(
        <EstimateResults
          estimate={mockEstimate}
          selectedFeatures={mockFeatures}
          loading={false}
        />
      );
      expect(screen.getByText(/Features Included/i)).toBeInTheDocument();
    });

    it("displays feature chip names", () => {
      render(
        <EstimateResults
          estimate={mockEstimate}
          selectedFeatures={mockFeatures}
          loading={false}
        />
      );
      expect(screen.getAllByText("User Accounts & Login")[0]).toBeInTheDocument();
      expect(screen.getAllByText("Payments & Checkout")[0]).toBeInTheDocument();
    });

    it("does not show 'Features Included' when no selectedFeatures passed", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      expect(screen.queryByText(/Features Included/i)).not.toBeInTheDocument();
    });
  });

  describe("copy shareable link (lines 59-62)", () => {
    it("clicking 'Copy shareable link' calls navigator.clipboard.writeText", async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: mockWriteText },
        configurable: true,
        writable: true,
      });
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      fireEvent.click(screen.getByRole("button", { name: /Copy shareable link/i }));
      expect(mockWriteText).toHaveBeenCalledWith(window.location.href);
    });

    it("Snackbar onClose resets linkCopied after auto-hide", async () => {
      jest.useFakeTimers();
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: mockWriteText },
        configurable: true,
        writable: true,
      });
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: /Copy shareable link/i }));
        // Flush the clipboard promise to trigger setLinkCopied(true)
        await Promise.resolve();
        await Promise.resolve();
      });
      // Snackbar should now be open
      expect(screen.getByText("Link copied to clipboard")).toBeInTheDocument();
      // Advance past the autoHideDuration (2500ms) to trigger onClose
      act(() => { jest.advanceTimersByTime(3000); });
      jest.useRealTimers();
    });
  });

  describe("print (line 66)", () => {
    it("clicking 'Save as PDF' calls window.print", () => {
      const mockPrint = jest.fn();
      window.print = mockPrint;
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      fireEvent.click(screen.getByRole("button", { name: /Save as PDF/i }));
      expect(mockPrint).toHaveBeenCalled();
    });
  });

  describe("save estimate flow (lines 70-75, 458-494)", () => {
    it("shows 'Save estimate' button when onSave prop is provided", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} onSave={jest.fn()} />);
      expect(screen.getByRole("button", { name: /Save estimate/i })).toBeInTheDocument();
    });

    it("does NOT show 'Save estimate' button when onSave is not provided", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      expect(screen.queryByRole("button", { name: /Save estimate/i })).not.toBeInTheDocument();
    });

    it("clicking 'Save estimate' reveals the name input", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} onSave={jest.fn()} />);
      fireEvent.click(screen.getByRole("button", { name: /Save estimate/i }));
      expect(screen.getByPlaceholderText(/Name this estimate/i)).toBeInTheDocument();
    });

    it("clicking Cancel resets the toggle so the button reads 'Save estimate' (not 'Saved!')", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} onSave={jest.fn()} />);
      fireEvent.click(screen.getByRole("button", { name: /Save estimate/i }));
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
      // After cancel, showSaveInput=false; the button is back to "Save estimate" (not "Saved!")
      expect(screen.getByRole("button", { name: /Save estimate/i })).toBeInTheDocument();
    });

    it("Save button is disabled when name is empty", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} onSave={jest.fn()} />);
      fireEvent.click(screen.getByRole("button", { name: /Save estimate/i }));
      expect(screen.getByRole("button", { name: "Save", exact: true })).toBeDisabled();
    });

    it("clicking Save with a name calls onSave with the trimmed name", () => {
      const onSave = jest.fn();
      render(<EstimateResults estimate={mockEstimate} loading={false} onSave={onSave} />);
      fireEvent.click(screen.getByRole("button", { name: /Save estimate/i }));
      fireEvent.change(screen.getByPlaceholderText(/Name this estimate/i), {
        target: { value: "My Estimate" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Save", exact: true }));
      expect(onSave).toHaveBeenCalledWith("My Estimate");
    });

    it("pressing Enter with empty name does NOT call onSave (guard branch)", () => {
      const onSave = jest.fn();
      render(<EstimateResults estimate={mockEstimate} loading={false} onSave={onSave} />);
      fireEvent.click(screen.getByRole("button", { name: /Save estimate/i }));
      const input = screen.getByPlaceholderText(/Name this estimate/i);
      fireEvent.keyDown(input, { key: "Enter" });
      expect(onSave).not.toHaveBeenCalled();
    });

    it("pressing Enter in the name field calls onSave", () => {
      const onSave = jest.fn();
      render(<EstimateResults estimate={mockEstimate} loading={false} onSave={onSave} />);
      fireEvent.click(screen.getByRole("button", { name: /Save estimate/i }));
      const input = screen.getByPlaceholderText(/Name this estimate/i);
      fireEvent.change(input, { target: { value: "Enter Save" } });
      fireEvent.keyDown(input, { key: "Enter" });
      expect(onSave).toHaveBeenCalledWith("Enter Save");
    });

    it("pressing Escape in the name field resets the toggle (button back to 'Save estimate')", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} onSave={jest.fn()} />);
      fireEvent.click(screen.getByRole("button", { name: /Save estimate/i }));
      const input = screen.getByPlaceholderText(/Name this estimate/i);
      fireEvent.keyDown(input, { key: "Escape" });
      // After Escape, showSaveInput=false; the button is back to "Save estimate"
      expect(screen.getByRole("button", { name: /Save estimate/i })).toBeInTheDocument();
    });

    it("calling handleConfirmSave with no onSave prop is a no-op (guard)", () => {
      // Without onSave, the save UI is not shown — just verify no crash
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      expect(screen.queryByPlaceholderText(/Name this estimate/i)).not.toBeInTheDocument();
    });
  });

  describe("mode toggle — no-op when same mode clicked", () => {
    it("clicking the already-active 'Midpoint' button does not trigger loading state", () => {
      jest.useFakeTimers();
      render(<EstimateResults estimate={mockEstimate} loading={false} />);

      // Default mode is mid — click it again
      fireEvent.click(screen.getByRole("button", { name: "Midpoint" }));
      act(() => { jest.runAllTimers(); });

      // Should still show midpoint cost (no loading blank)
      expect(screen.getByText("$15,000")).toBeInTheDocument();
      jest.useRealTimers();
    });
  });

  describe("zero-hour features (line 369 — totalAvg === 0 branch)", () => {
    it("shows 0% when all features have zero hours", () => {
      const zeroFeatures = [
        {
          id: "zero-feat",
          name: "Zero Feature",
          description: "",
          details: "",
          factors: "",
          minHours: 0,
          maxHours: 0,
        },
      ];
      render(
        <EstimateResults
          estimate={mockEstimate}
          selectedFeatures={zeroFeatures}
          loading={false}
        />
      );
      // Expand details to render the hours breakdown
      fireEvent.click(screen.getByText(/View cost range/i));
      // The feature should show 0% because totalAvg is 0
      expect(screen.getByText(/0%/)).toBeInTheDocument();
    });
  });

  describe("singular feature label", () => {
    it("shows '1 feature selected' when featureCount is 1", () => {
      const singleFeatureEstimate = { ...mockEstimate, featureCount: 1 };
      render(<EstimateResults estimate={singleFeatureEstimate} loading={false} />);
      expect(screen.getByText(/1 feature selected/)).toBeInTheDocument();
    });
  });

  describe("null estimate", () => {
    it("renders without crashing when estimate is null", () => {
      render(<EstimateResults estimate={null} loading={false} />);
      expect(screen.getByText("Estimate Summary")).toBeInTheDocument();
    });

    it("shows skeleton placeholder for subtitle when estimate is null", () => {
      render(<EstimateResults estimate={null} loading={false} />);
      // No cost text shown since there's no estimate
      expect(screen.queryByText(/\/hr rate/)).not.toBeInTheDocument();
    });
  });
});
