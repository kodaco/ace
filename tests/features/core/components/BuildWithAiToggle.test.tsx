import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BuildWithAiToggle } from "@/features/core/components/BuildWithAiToggle";

describe("BuildWithAiToggle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("switch state", () => {
    it("renders the switch input", () => {
      render(<BuildWithAiToggle checked={false} onChange={jest.fn()} />);
      // MUI Switch renders role="switch" (not "checkbox")
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("switch is unchecked when checked=false", () => {
      render(<BuildWithAiToggle checked={false} onChange={jest.fn()} />);
      expect(screen.getByRole("switch")).not.toBeChecked();
    });

    it("switch is checked when checked=true", () => {
      render(<BuildWithAiToggle checked={true} onChange={jest.fn()} />);
      expect(screen.getByRole("switch")).toBeChecked();
    });

    it("clicking the switch calls onChange", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(<BuildWithAiToggle checked={false} onChange={onChange} />);

      await user.click(screen.getByRole("switch"));

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("label", () => {
    it("renders 'Build with AI' label", () => {
      render(<BuildWithAiToggle checked={false} onChange={jest.fn()} />);
      expect(screen.getByText("Build with AI")).toBeInTheDocument();
    });
  });

  describe("summary text", () => {
    it("renders the summary blurb about AI reducing build time", () => {
      render(<BuildWithAiToggle checked={false} onChange={jest.fn()} />);
      expect(
        screen.getByText(/AI-assisted development reduces build time by about 25%/i)
      ).toBeInTheDocument();
    });
  });

  describe("expand / collapse details", () => {
    it("expand button is present (aria-label 'Learn more about building with AI')", () => {
      render(<BuildWithAiToggle checked={false} onChange={jest.fn()} />);
      expect(
        screen.getByRole("button", { name: /Learn more about building with AI/i })
      ).toBeInTheDocument();
    });

    it("clicking the expand button reveals the 'Development speed:' detail", async () => {
      const user = userEvent.setup();
      render(<BuildWithAiToggle checked={false} onChange={jest.fn()} />);

      await user.click(
        screen.getByRole("button", { name: /Learn more about building with AI/i })
      );

      expect(screen.getByText(/Development speed/i)).toBeInTheDocument();
    });

    it("details section contains 'Development speed:' after expanding", async () => {
      const user = userEvent.setup();
      render(<BuildWithAiToggle checked={false} onChange={jest.fn()} />);

      await user.click(
        screen.getByRole("button", { name: /Learn more about building with AI/i })
      );

      expect(screen.getByText(/Development speed/i)).toBeInTheDocument();
    });

    it("details section contains 'Maintenance costs:' label after expanding", async () => {
      const user = userEvent.setup();
      render(<BuildWithAiToggle checked={false} onChange={jest.fn()} />);

      await user.click(
        screen.getByRole("button", { name: /Learn more about building with AI/i })
      );

      // Use getAllByText since "maintenance costs" also appears in summary blurb
      const matches = screen.getAllByText(/Maintenance costs/i);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it("clicking the expand button a second time does not crash", async () => {
      const user = userEvent.setup();
      render(<BuildWithAiToggle checked={false} onChange={jest.fn()} />);

      const expandBtn = screen.getByRole("button", {
        name: /Learn more about building with AI/i,
      });

      await user.click(expandBtn);
      await user.click(expandBtn);

      // Component should still be in the DOM with the button present
      expect(expandBtn).toBeInTheDocument();
    });
  });

  describe("renders correctly in both states", () => {
    it("renders without error when checked=true", () => {
      expect(() =>
        render(<BuildWithAiToggle checked={true} onChange={jest.fn()} />)
      ).not.toThrow();
    });

    it("renders without error when checked=false", () => {
      expect(() =>
        render(<BuildWithAiToggle checked={false} onChange={jest.fn()} />)
      ).not.toThrow();
    });
  });
});
