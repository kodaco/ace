import { render, screen, fireEvent } from "@testing-library/react";
import { SavedEstimatesDrawer } from "@/features/core/components/SavedEstimatesDrawer";
import { SavedEstimate } from "@/features/core/services/estimate-storage";

const mockSaved: SavedEstimate[] = [
  {
    id: "save-1",
    name: "MVP Build",
    savedAt: "2025-03-01T10:00:00.000Z",
    featureCount: 5,
    midpointCost: 15000,
    config: {
      featureIds: ["user-auth"],
      customFeatures: [],
      rate: 100,
      ai: false,
      platform: "web",
      currencyCode: "USD",
    },
  },
];

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  savedEstimates: [],
  onLoad: jest.fn(),
  onDelete: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("SavedEstimatesDrawer", () => {
  describe("drawer heading", () => {
    it("renders 'Saved Estimates' heading when open", () => {
      render(<SavedEstimatesDrawer {...defaultProps} />);
      expect(screen.getByText("Saved Estimates")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("shows 'No saved estimates yet.' when list is empty", () => {
      render(<SavedEstimatesDrawer {...defaultProps} savedEstimates={[]} />);
      expect(screen.getByText("No saved estimates yet.")).toBeInTheDocument();
    });

    it("shows instructional caption when empty", () => {
      render(<SavedEstimatesDrawer {...defaultProps} savedEstimates={[]} />);
      expect(screen.getByText(/Run an estimate and click/i)).toBeInTheDocument();
    });
  });

  describe("estimate list", () => {
    it("shows the estimate name", () => {
      render(<SavedEstimatesDrawer {...defaultProps} savedEstimates={mockSaved} />);
      expect(screen.getByText("MVP Build")).toBeInTheDocument();
    });

    it("shows feature count", () => {
      render(<SavedEstimatesDrawer {...defaultProps} savedEstimates={mockSaved} />);
      expect(screen.getByText(/5 features/)).toBeInTheDocument();
    });

    it("shows midpoint cost in USD", () => {
      render(<SavedEstimatesDrawer {...defaultProps} savedEstimates={mockSaved} />);
      expect(screen.getByText(/\$15,000/)).toBeInTheDocument();
    });

    it("shows formatted date", () => {
      render(<SavedEstimatesDrawer {...defaultProps} savedEstimates={mockSaved} />);
      expect(screen.getByText(/Mar 1, 2025/)).toBeInTheDocument();
    });

    it("shows 'Up to 5 estimates' footer when list is non-empty", () => {
      render(<SavedEstimatesDrawer {...defaultProps} savedEstimates={mockSaved} />);
      expect(screen.getByText(/Up to 5 estimates saved locally/i)).toBeInTheDocument();
    });

    it("uses singular 'feature' when featureCount is 1", () => {
      const single = [{ ...mockSaved[0], featureCount: 1 }];
      render(<SavedEstimatesDrawer {...defaultProps} savedEstimates={single} />);
      // Should show "1 feature ·" — no trailing 's'
      expect(screen.getByText(/1 feature\s*·/)).toBeInTheDocument();
    });

    it("shows converted cost for non-USD currency", () => {
      const eurSaved = [
        { ...mockSaved[0], config: { ...mockSaved[0].config, currencyCode: "EUR" } },
      ];
      render(<SavedEstimatesDrawer {...defaultProps} savedEstimates={eurSaved} />);
      expect(screen.getByText(/€/)).toBeInTheDocument();
    });

    it("falls back to first currency when code is unknown (line 25 ?? branch)", () => {
      const unknownCurrSaved = [
        { ...mockSaved[0], config: { ...mockSaved[0].config, currencyCode: "UNKNOWN" } },
      ];
      render(<SavedEstimatesDrawer {...defaultProps} savedEstimates={unknownCurrSaved} />);
      // Falls back to CURRENCIES[0] which is USD ($)
      expect(screen.getByText(/\$/)).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("clicking Close icon calls onClose", () => {
      const onClose = jest.fn();
      render(<SavedEstimatesDrawer {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByRole("button", { name: "Close" }));
      expect(onClose).toHaveBeenCalled();
    });

    it("clicking 'Restore estimate' calls onLoad with the estimate and then onClose", () => {
      const onLoad = jest.fn();
      const onClose = jest.fn();
      render(
        <SavedEstimatesDrawer
          {...defaultProps}
          savedEstimates={mockSaved}
          onLoad={onLoad}
          onClose={onClose}
        />
      );
      fireEvent.click(screen.getByRole("button", { name: /Restore estimate/i }));
      expect(onLoad).toHaveBeenCalledWith(mockSaved[0]);
      expect(onClose).toHaveBeenCalled();
    });

    it("clicking the delete icon calls onDelete with the estimate id", () => {
      const onDelete = jest.fn();
      render(
        <SavedEstimatesDrawer
          {...defaultProps}
          savedEstimates={mockSaved}
          onDelete={onDelete}
        />
      );
      fireEvent.click(screen.getByRole("button", { name: /Delete saved estimate/i }));
      expect(onDelete).toHaveBeenCalledWith("save-1");
    });
  });
});
