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
      expect(screen.getByText("User Accounts & Login")).toBeInTheDocument();
      expect(screen.getByText("Payments & Checkout")).toBeInTheDocument();
    });

    it("does not show 'Features Included' when no selectedFeatures passed", () => {
      render(<EstimateResults estimate={mockEstimate} loading={false} />);
      expect(screen.queryByText(/Features Included/i)).not.toBeInTheDocument();
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
