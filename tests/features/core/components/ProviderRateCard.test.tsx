import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProviderRateCard } from "@/features/core/components/ProviderRateCard";
import { Provider } from "@/features/core/data/providers";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
  usePathname: () => "/",
}));

beforeEach(() => {
  mockPush.mockClear();
});

const mockProvider: Provider = {
  id: "test-provider",
  name: "Test Agency",
  description: "A test description",
  hourlyRate: 120,
  tags: ["Full-service", "Local"],
  website: "https://example.com",
};

describe("ProviderRateCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("view mode", () => {
    it("renders 'Estimating with' label", () => {
      render(<ProviderRateCard provider={mockProvider} onSetRate={jest.fn()} />);
      expect(screen.getByText(/Estimating with/i)).toBeInTheDocument();
    });

    it("shows the provider name", () => {
      render(<ProviderRateCard provider={mockProvider} onSetRate={jest.fn()} />);
      expect(screen.getByText("Test Agency")).toBeInTheDocument();
    });

    it("shows formatted hourly rate badge ($120/hr)", () => {
      render(<ProviderRateCard provider={mockProvider} onSetRate={jest.fn()} />);
      expect(screen.getByText("$120/hr")).toBeInTheDocument();
    });

    it("shows 'Change Rate' button in view mode", () => {
      render(<ProviderRateCard provider={mockProvider} onSetRate={jest.fn()} />);
      expect(screen.getByRole("button", { name: "Change Rate" })).toBeInTheDocument();
    });

    it("shows 'Show details' button in view mode", () => {
      render(<ProviderRateCard provider={mockProvider} onSetRate={jest.fn()} />);
      expect(screen.getByRole("button", { name: /Show details/i })).toBeInTheDocument();
    });
  });

  describe("edit mode", () => {
    it("clicking 'Change Rate' enters edit mode with a TextField", async () => {
      const user = userEvent.setup();
      render(<ProviderRateCard provider={mockProvider} onSetRate={jest.fn()} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    });

    it("edit mode shows TextField pre-filled with provider's hourly rate", async () => {
      const user = userEvent.setup();
      render(<ProviderRateCard provider={mockProvider} onSetRate={jest.fn()} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      const input = screen.getByRole("spinbutton") as HTMLInputElement;
      expect(input.value).toBe("120");
    });

    it("edit mode shows 'Set Rate' button", async () => {
      const user = userEvent.setup();
      render(<ProviderRateCard provider={mockProvider} onSetRate={jest.fn()} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      expect(screen.getByRole("button", { name: "Set Rate" })).toBeInTheDocument();
    });

    it("edit mode shows 'Cancel' button", async () => {
      const user = userEvent.setup();
      render(<ProviderRateCard provider={mockProvider} onSetRate={jest.fn()} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    });

    it("clicking 'Cancel' in edit mode returns to view mode without calling onSetRate", async () => {
      const onSetRate = jest.fn();
      const user = userEvent.setup();
      render(<ProviderRateCard provider={mockProvider} onSetRate={onSetRate} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));
      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(onSetRate).not.toHaveBeenCalled();
      expect(screen.getByRole("button", { name: "Change Rate" })).toBeInTheDocument();
    });

    it("clicking 'Set Rate' calls onSetRate with the new value and exits edit mode", async () => {
      const onSetRate = jest.fn();
      const user = userEvent.setup();
      render(<ProviderRateCard provider={mockProvider} onSetRate={onSetRate} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      const input = screen.getByRole("spinbutton");
      await user.clear(input);
      await user.type(input, "150");
      await user.click(screen.getByRole("button", { name: "Set Rate" }));

      expect(onSetRate).toHaveBeenCalledWith(150);
      expect(screen.getByRole("button", { name: "Change Rate" })).toBeInTheDocument();
    });
  });

  describe("edit mode — invalid input guard", () => {
    it("clicking 'Set Rate' with empty input does not call onSetRate", async () => {
      const onSetRate = jest.fn();
      const user = userEvent.setup();
      render(<ProviderRateCard provider={mockProvider} onSetRate={onSetRate} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      const input = screen.getByRole("spinbutton");
      await user.clear(input);
      await user.click(screen.getByRole("button", { name: "Set Rate" }));

      expect(onSetRate).not.toHaveBeenCalled();
    });

    it("pressing Enter with valid input calls onSetRate and exits edit mode", async () => {
      const onSetRate = jest.fn();
      const user = userEvent.setup();
      render(<ProviderRateCard provider={mockProvider} onSetRate={onSetRate} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      const input = screen.getByRole("spinbutton");
      await user.clear(input);
      await user.type(input, "200");
      await user.keyboard("{Enter}");

      expect(onSetRate).toHaveBeenCalledWith(200);
      expect(screen.getByRole("button", { name: "Change Rate" })).toBeInTheDocument();
    });

    it("pressing Escape cancels edit mode without calling onSetRate", async () => {
      const onSetRate = jest.fn();
      const user = userEvent.setup();
      render(<ProviderRateCard provider={mockProvider} onSetRate={onSetRate} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      const input = screen.getByRole("spinbutton");
      await user.clear(input);
      await user.type(input, "999");
      await user.keyboard("{Escape}");

      expect(onSetRate).not.toHaveBeenCalled();
      expect(screen.getByRole("button", { name: "Change Rate" })).toBeInTheDocument();
    });
  });

  describe("details collapse", () => {
    it("clicking 'Show details' changes button text to 'Hide details'", async () => {
      const user = userEvent.setup();
      render(<ProviderRateCard provider={mockProvider} onSetRate={jest.fn()} />);

      await user.click(screen.getByRole("button", { name: /Show details/i }));

      expect(screen.getByRole("button", { name: /Hide details/i })).toBeInTheDocument();
    });

    it("clicking 'Hide details' changes button text back to 'Show details'", async () => {
      const user = userEvent.setup();
      render(<ProviderRateCard provider={mockProvider} onSetRate={jest.fn()} />);

      await user.click(screen.getByRole("button", { name: /Show details/i }));
      await user.click(screen.getByRole("button", { name: /Hide details/i }));

      expect(screen.getByRole("button", { name: /Show details/i })).toBeInTheDocument();
    });

    it("expanded details section shows the provider description", async () => {
      const user = userEvent.setup();
      render(<ProviderRateCard provider={mockProvider} onSetRate={jest.fn()} />);

      await user.click(screen.getByRole("button", { name: /Show details/i }));

      expect(screen.getByText("A test description")).toBeInTheDocument();
    });

    it("expanded details section shows provider tags as chips", async () => {
      const user = userEvent.setup();
      render(<ProviderRateCard provider={mockProvider} onSetRate={jest.fn()} />);

      await user.click(screen.getByRole("button", { name: /Show details/i }));

      expect(screen.getByText("Full-service")).toBeInTheDocument();
      expect(screen.getByText("Local")).toBeInTheDocument();
    });

    it("expanded details section shows 'View all providers' link", async () => {
      const user = userEvent.setup();
      render(<ProviderRateCard provider={mockProvider} onSetRate={jest.fn()} />);

      await user.click(screen.getByRole("button", { name: /Show details/i }));

      expect(screen.getByText(/View all providers/i)).toBeInTheDocument();
    });
  });
});
