import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HourlyRateInput } from "@/features/core/components/HourlyRateInput";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
  usePathname: () => "/",
}));

beforeEach(() => {
  mockPush.mockClear();
});

describe("HourlyRateInput", () => {
  const defaultProps = {
    value: 100,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("read-only mode", () => {
    it("renders 'Hourly Rate' heading", () => {
      render(<HourlyRateInput {...defaultProps} />);
      expect(screen.getByText("Hourly Rate")).toBeInTheDocument();
    });

    it("shows formatted rate for value=100", () => {
      render(<HourlyRateInput {...defaultProps} value={100} />);
      expect(screen.getByText(/\$100/)).toBeInTheDocument();
    });

    it("shows '/ hr' suffix", () => {
      render(<HourlyRateInput {...defaultProps} />);
      expect(screen.getByText("/ hr")).toBeInTheDocument();
    });

    it("shows 'Change Rate' button", () => {
      render(<HourlyRateInput {...defaultProps} />);
      expect(screen.getByRole("button", { name: "Change Rate" })).toBeInTheDocument();
    });

    it("shows 'View provider rates' link", () => {
      render(<HourlyRateInput {...defaultProps} />);
      expect(screen.getByText(/View provider rates/)).toBeInTheDocument();
    });

    it("shows helper text about not knowing what to enter", () => {
      render(<HourlyRateInput {...defaultProps} />);
      expect(
        screen.getByText(/Not sure what to enter/i)
      ).toBeInTheDocument();
    });
  });

  describe("entering edit mode", () => {
    it("clicking 'Change Rate' shows a TextField with $ adornment", async () => {
      const user = userEvent.setup();
      render(<HourlyRateInput {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      // $ start adornment visible
      expect(screen.getByText("$")).toBeInTheDocument();
      // text input present
      expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    });

    it("edit mode shows 'Set Rate' button", async () => {
      const user = userEvent.setup();
      render(<HourlyRateInput {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      expect(screen.getByRole("button", { name: "Set Rate" })).toBeInTheDocument();
    });

    it("edit mode shows 'Cancel' button", async () => {
      const user = userEvent.setup();
      render(<HourlyRateInput {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    });
  });

  describe("cancelling edit", () => {
    it("clicking 'Cancel' returns to read-only mode", async () => {
      const user = userEvent.setup();
      render(<HourlyRateInput {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));
      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(screen.getByRole("button", { name: "Change Rate" })).toBeInTheDocument();
    });

    it("clicking 'Cancel' does not call onChange", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(<HourlyRateInput value={100} onChange={onChange} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));
      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(onChange).not.toHaveBeenCalled();
    });

    it("pressing Escape in edit mode cancels and returns to read-only", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(<HourlyRateInput value={100} onChange={onChange} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));
      await user.keyboard("{Escape}");

      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByRole("button", { name: "Change Rate" })).toBeInTheDocument();
    });
  });

  describe("accepting edit", () => {
    it("typing a value and clicking 'Set Rate' calls onChange with parsed number", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(<HourlyRateInput value={100} onChange={onChange} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      const input = screen.getByRole("spinbutton");
      await user.clear(input);
      await user.type(input, "150");
      await user.click(screen.getByRole("button", { name: "Set Rate" }));

      expect(onChange).toHaveBeenCalledWith(150);
    });

    it("pressing Enter in edit mode accepts and calls onChange", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(<HourlyRateInput value={100} onChange={onChange} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      const input = screen.getByRole("spinbutton");
      await user.clear(input);
      await user.type(input, "200");
      await user.keyboard("{Enter}");

      expect(onChange).toHaveBeenCalledWith(200);
    });

    it("pressing Enter returns to read-only mode after accepting", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(<HourlyRateInput value={100} onChange={onChange} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      const input = screen.getByRole("spinbutton");
      await user.clear(input);
      await user.type(input, "200");
      await user.keyboard("{Enter}");

      expect(screen.getByRole("button", { name: "Change Rate" })).toBeInTheDocument();
    });
  });

  describe("invalid input", () => {
    it("empty input does not call onChange when 'Set Rate' is clicked", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(<HourlyRateInput value={100} onChange={onChange} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      const input = screen.getByRole("spinbutton");
      await user.clear(input);
      await user.click(screen.getByRole("button", { name: "Set Rate" }));

      expect(onChange).not.toHaveBeenCalled();
    });

    it("non-numeric input does not call onChange when 'Set Rate' is clicked", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(<HourlyRateInput value={100} onChange={onChange} />);

      await user.click(screen.getByRole("button", { name: "Change Rate" }));

      const input = screen.getByRole("spinbutton");
      await user.clear(input);
      // Type letters — spinbutton will hold empty string since browser filters non-numeric
      await user.type(input, "abc");
      await user.click(screen.getByRole("button", { name: "Set Rate" }));

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
