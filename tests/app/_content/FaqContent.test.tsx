import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FaqContent } from "@/app/_content/FaqContent";

describe("FaqContent", () => {
  it("renders without crashing", () => {
    render(<FaqContent />);
  });

  describe("category headings", () => {
    it("shows 'Cost and Budget' category", () => {
      render(<FaqContent />);
      expect(screen.getByText("Cost and Budget")).toBeInTheDocument();
    });

    it("shows 'What to Build' category", () => {
      render(<FaqContent />);
      expect(screen.getByText("What to Build")).toBeInTheDocument();
    });

    it("shows 'Finding and Working with Developers' category", () => {
      render(<FaqContent />);
      expect(screen.getByText("Finding and Working with Developers")).toBeInTheDocument();
    });

    it("shows 'Timeline and Launch' category", () => {
      render(<FaqContent />);
      expect(screen.getByText("Timeline and Launch")).toBeInTheDocument();
    });

    it("shows 'Ongoing Costs' category", () => {
      render(<FaqContent />);
      expect(screen.getByText("Ongoing Costs")).toBeInTheDocument();
    });

    it("shows 'Alternatives' category", () => {
      render(<FaqContent />);
      expect(screen.getByText("Alternatives")).toBeInTheDocument();
    });

    it("shows 'Other Costs' category", () => {
      render(<FaqContent />);
      expect(screen.getByText("Other Costs")).toBeInTheDocument();
    });
  });

  describe("question text", () => {
    it("shows 'How accurate are these estimates?' question", () => {
      render(<FaqContent />);
      expect(screen.getByText("How accurate are these estimates?")).toBeInTheDocument();
    });

    it("shows 'Why do developer quotes vary so much?' question", () => {
      render(<FaqContent />);
      expect(screen.getByText("Why do developer quotes vary so much?")).toBeInTheDocument();
    });

    it("shows 'What causes projects to go over budget?' question", () => {
      render(<FaqContent />);
      expect(screen.getByText("What causes projects to go over budget?")).toBeInTheDocument();
    });

    it("shows 'What hourly rate should I use?' question", () => {
      render(<FaqContent />);
      expect(screen.getByText("What hourly rate should I use?")).toBeInTheDocument();
    });

    it("shows 'What is an MVP and should I build one?' question", () => {
      render(<FaqContent />);
      expect(screen.getByText("What is an MVP and should I build one?")).toBeInTheDocument();
    });

    it("shows 'Do I need a mobile app or a web app?' question", () => {
      render(<FaqContent />);
      expect(screen.getByText("Do I need a mobile app or a web app?")).toBeInTheDocument();
    });

    it("shows 'Should I hire a freelancer or an agency?' question", () => {
      render(<FaqContent />);
      expect(screen.getByText("Should I hire a freelancer or an agency?")).toBeInTheDocument();
    });

    it("shows 'How long does it actually take to build an app?' question", () => {
      render(<FaqContent />);
      expect(screen.getByText("How long does it actually take to build an app?")).toBeInTheDocument();
    });

    it("shows 'What is maintenance and why does it cost money after launch?' question", () => {
      render(<FaqContent />);
      expect(
        screen.getByText("What is maintenance and why does it cost money after launch?")
      ).toBeInTheDocument();
    });

    it("shows 'What does the AI toggle change in the estimates?' question", () => {
      render(<FaqContent />);
      expect(
        screen.getByText("What does the AI toggle change in the estimates?")
      ).toBeInTheDocument();
    });

    it("shows 'Can I use a no-code or low-code tool instead of hiring a developer?' question", () => {
      render(<FaqContent />);
      expect(
        screen.getByText("Can I use a no-code or low-code tool instead of hiring a developer?")
      ).toBeInTheDocument();
    });

    it("shows 'What costs are not included in these estimates?' question", () => {
      render(<FaqContent />);
      expect(
        screen.getByText("What costs are not included in these estimates?")
      ).toBeInTheDocument();
    });
  });

  describe("accordion expand behavior", () => {
    it("clicking an accordion summary button expands it", async () => {
      const user = userEvent.setup();
      render(<FaqContent />);

      const button = screen.getByRole("button", {
        name: /How accurate are these estimates\?/i,
      });

      // Initially not expanded
      expect(button).toHaveAttribute("aria-expanded", "false");

      await user.click(button);

      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("clicking an expanded accordion summary button collapses it", async () => {
      const user = userEvent.setup();
      render(<FaqContent />);

      const button = screen.getByRole("button", {
        name: /How accurate are these estimates\?/i,
      });

      // Expand it
      await user.click(button);
      expect(button).toHaveAttribute("aria-expanded", "true");

      // Collapse it
      await user.click(button);
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("only one accordion is open at a time — opening a second closes the first", async () => {
      const user = userEvent.setup();
      render(<FaqContent />);

      const firstButton = screen.getByRole("button", {
        name: /How accurate are these estimates\?/i,
      });
      const secondButton = screen.getByRole("button", {
        name: /Why do developer quotes vary so much\?/i,
      });

      // Open the first accordion
      await user.click(firstButton);
      expect(firstButton).toHaveAttribute("aria-expanded", "true");
      expect(secondButton).toHaveAttribute("aria-expanded", "false");

      // Open the second accordion — the first should close
      await user.click(secondButton);
      expect(secondButton).toHaveAttribute("aria-expanded", "true");
      expect(firstButton).toHaveAttribute("aria-expanded", "false");
    });

    it("opening an accordion in a different category closes the previously open one", async () => {
      const user = userEvent.setup();
      render(<FaqContent />);

      const costButton = screen.getByRole("button", {
        name: /How accurate are these estimates\?/i,
      });
      const buildButton = screen.getByRole("button", {
        name: /What is an MVP and should I build one\?/i,
      });

      // Open first category accordion
      await user.click(costButton);
      expect(costButton).toHaveAttribute("aria-expanded", "true");

      // Open second category accordion — first should close
      await user.click(buildButton);
      expect(buildButton).toHaveAttribute("aria-expanded", "true");
      expect(costButton).toHaveAttribute("aria-expanded", "false");
    });
  });
});
