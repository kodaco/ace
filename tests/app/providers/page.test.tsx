import { render, screen, fireEvent } from "@testing-library/react";
import ProvidersPage from "@/app/providers/page";
import { PROVIDERS } from "@/features/core/data/providers";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
  usePathname: () => "/providers",
}));

beforeEach(() => {
  mockPush.mockClear();
  sessionStorage.clear();
});

describe("ProvidersPage", () => {
  describe("heading and navigation", () => {
    it("renders page heading 'Service Providers'", () => {
      render(<ProvidersPage />);
      expect(
        screen.getByRole("heading", { name: "Service Providers" })
      ).toBeInTheDocument();
    });

    it("renders 'Back to home' back link", () => {
      render(<ProvidersPage />);
      expect(screen.getByText("Back to home")).toBeInTheDocument();
    });
  });

  describe("provider cards", () => {
    it("renders all 6 provider cards", () => {
      render(<ProvidersPage />);
      const runEstimateButtons = screen.getAllByRole("button", {
        name: "Run Estimate",
      });
      expect(runEstimateButtons).toHaveLength(PROVIDERS.length);
      expect(runEstimateButtons).toHaveLength(6);
    });

    it("renders each provider by name", () => {
      render(<ProvidersPage />);
      PROVIDERS.forEach((provider) => {
        expect(screen.getByText(provider.name)).toBeInTheDocument();
      });
    });

    it("renders Acme Digital", () => {
      render(<ProvidersPage />);
      expect(screen.getByText("Acme Digital")).toBeInTheDocument();
    });

    it("renders Blue Horizon Studios", () => {
      render(<ProvidersPage />);
      expect(screen.getByText("Blue Horizon Studios")).toBeInTheDocument();
    });

    it("renders Pixel Craft", () => {
      render(<ProvidersPage />);
      expect(screen.getByText("Pixel Craft")).toBeInTheDocument();
    });

    it("renders NovaTech Solutions", () => {
      render(<ProvidersPage />);
      expect(screen.getByText("NovaTech Solutions")).toBeInTheDocument();
    });

    it("renders Code Collective", () => {
      render(<ProvidersPage />);
      expect(screen.getByText("Code Collective")).toBeInTheDocument();
    });

    it("renders Remote Build Co.", () => {
      render(<ProvidersPage />);
      expect(screen.getByText("Remote Build Co.")).toBeInTheDocument();
    });

    it("each card shows an hourly rate badge", () => {
      render(<ProvidersPage />);
      // Spot-check a few formatted rates from the PROVIDERS list
      expect(screen.getByText("$150/hr")).toBeInTheDocument(); // Acme Digital
      expect(screen.getByText("$120/hr")).toBeInTheDocument(); // Blue Horizon Studios
      expect(screen.getByText("$55/hr")).toBeInTheDocument();  // Remote Build Co.
    });

    it("each provider card has a 'Run Estimate' button", () => {
      render(<ProvidersPage />);
      const buttons = screen.getAllByRole("button", { name: "Run Estimate" });
      expect(buttons.length).toBe(PROVIDERS.length);
    });
  });

  describe("provider descriptions", () => {
    it("shows Acme Digital description", () => {
      render(<ProvidersPage />);
      expect(
        screen.getByText(/Full-service web and mobile agency/i)
      ).toBeInTheDocument();
    });

    it("shows Blue Horizon Studios description", () => {
      render(<ProvidersPage />);
      expect(
        screen.getByText(/Boutique studio focused on mobile-first/i)
      ).toBeInTheDocument();
    });

    it("shows description text for all providers", () => {
      render(<ProvidersPage />);
      PROVIDERS.forEach((provider) => {
        // Each provider has a non-empty description — check it is partially present
        const snippet = provider.description.slice(0, 20);
        expect(screen.getByText(new RegExp(snippet, "i"))).toBeInTheDocument();
      });
    });
  });

  describe("provider tags", () => {
    it("shows 'Full-service' tag chip for Acme Digital", () => {
      render(<ProvidersPage />);
      // There may be multiple chips with the same label across providers
      const chips = screen.getAllByText("Full-service");
      expect(chips.length).toBeGreaterThanOrEqual(1);
    });

    it("shows 'Mobile' tag chip for Blue Horizon Studios", () => {
      render(<ProvidersPage />);
      expect(screen.getByText("Mobile")).toBeInTheDocument();
    });

    it("shows 'Remote' tag chip for Remote Build Co.", () => {
      render(<ProvidersPage />);
      expect(screen.getByText("Remote")).toBeInTheDocument();
    });

    it("shows 'Budget-friendly' tag chip", () => {
      render(<ProvidersPage />);
      expect(screen.getByText("Budget-friendly")).toBeInTheDocument();
    });
  });

  describe("Run Estimate interaction", () => {
    it("clicking 'Run Estimate' on first provider sets sessionStorage", () => {
      render(<ProvidersPage />);
      const firstProvider = PROVIDERS[0]; // acme-digital
      const runEstimateButtons = screen.getAllByRole("button", {
        name: "Run Estimate",
      });

      fireEvent.click(runEstimateButtons[0]);

      expect(sessionStorage.getItem("selectedProviderId")).toBe(
        firstProvider.id
      );
    });

    it("clicking 'Run Estimate' on first provider calls router.push('/#calculator')", () => {
      render(<ProvidersPage />);
      const runEstimateButtons = screen.getAllByRole("button", {
        name: "Run Estimate",
      });

      fireEvent.click(runEstimateButtons[0]);

      expect(mockPush).toHaveBeenCalledWith("/#calculator");
    });

    it("clicking 'Run Estimate' on second provider sets correct provider id", () => {
      render(<ProvidersPage />);
      const secondProvider = PROVIDERS[1]; // blue-horizon
      const runEstimateButtons = screen.getAllByRole("button", {
        name: "Run Estimate",
      });

      fireEvent.click(runEstimateButtons[1]);

      expect(sessionStorage.getItem("selectedProviderId")).toBe(
        secondProvider.id
      );
    });

    it("clicking 'Run Estimate' navigates via router push", () => {
      render(<ProvidersPage />);
      const runEstimateButtons = screen.getAllByRole("button", {
        name: "Run Estimate",
      });

      fireEvent.click(runEstimateButtons[2]); // Pixel Craft

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/#calculator");
    });
  });
});
