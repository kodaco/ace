import { render, screen } from "@testing-library/react";
import { AboutContent } from "@/app/_content/AboutContent";

describe("AboutContent", () => {
  it("renders without crashing", () => {
    render(<AboutContent />);
  });

  describe("section headings", () => {
    it("shows 'What is this?' heading", () => {
      render(<AboutContent />);
      expect(screen.getByText("What is this?")).toBeInTheDocument();
    });

    it("shows 'Who is it for?' heading", () => {
      render(<AboutContent />);
      expect(screen.getByText("Who is it for?")).toBeInTheDocument();
    });

    it("shows 'How are the numbers calculated?' heading", () => {
      render(<AboutContent />);
      expect(screen.getByText("How are the numbers calculated?")).toBeInTheDocument();
    });

    it("shows 'What does the AI toggle do?' heading", () => {
      render(<AboutContent />);
      expect(screen.getByText("What does the AI toggle do?")).toBeInTheDocument();
    });

    it("shows 'How accurate is this?' heading", () => {
      render(<AboutContent />);
      expect(screen.getByText("How accurate is this?")).toBeInTheDocument();
    });

    it("shows 'Is anything saved or tracked?' heading", () => {
      render(<AboutContent />);
      expect(screen.getByText("Is anything saved or tracked?")).toBeInTheDocument();
    });

    it("renders all 6 section headings", () => {
      render(<AboutContent />);
      const headings = [
        "What is this?",
        "Who is it for?",
        "How are the numbers calculated?",
        "What does the AI toggle do?",
        "How accurate is this?",
        "Is anything saved or tracked?",
      ];
      headings.forEach((heading) => {
        expect(screen.getByText(heading)).toBeInTheDocument();
      });
    });
  });

  describe("section body text", () => {
    it("shows body text for 'What is this?'", () => {
      render(<AboutContent />);
      expect(
        screen.getByText(/App Cost Estimator is a free tool/i)
      ).toBeInTheDocument();
    });

    it("shows body text for 'Who is it for?'", () => {
      render(<AboutContent />);
      expect(
        screen.getByText(/Mostly people in the early stages of planning/i)
      ).toBeInTheDocument();
    });

    it("shows body text for 'How are the numbers calculated?'", () => {
      render(<AboutContent />);
      expect(
        screen.getByText(/Each feature has a low and high hour range/i)
      ).toBeInTheDocument();
    });

    it("shows body text for 'What does the AI toggle do?'", () => {
      render(<AboutContent />);
      expect(
        screen.getByText(/If you plan to build with AI coding tools/i)
      ).toBeInTheDocument();
    });

    it("shows body text for 'How accurate is this?'", () => {
      render(<AboutContent />);
      expect(
        screen.getByText(/Think of it as a starting point/i)
      ).toBeInTheDocument();
    });

    it("shows body text for 'Is anything saved or tracked?'", () => {
      render(<AboutContent />);
      expect(
        screen.getByText(/No\. Everything runs in your browser/i)
      ).toBeInTheDocument();
    });
  });
});
