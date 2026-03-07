import { render, screen } from "@testing-library/react";
import { TermsContent } from "@/app/_content/TermsContent";

describe("TermsContent", () => {
  it("renders without crashing", () => {
    render(<TermsContent />);
  });

  it("shows 'Last updated: March 2026' text", () => {
    render(<TermsContent />);
    expect(screen.getByText("Last updated: March 2026")).toBeInTheDocument();
  });

  describe("section headings", () => {
    it("shows 'Acceptance of Terms' heading", () => {
      render(<TermsContent />);
      expect(screen.getByText("Acceptance of Terms")).toBeInTheDocument();
    });

    it("shows 'Nature of Estimates' heading", () => {
      render(<TermsContent />);
      expect(screen.getByText("Nature of Estimates")).toBeInTheDocument();
    });

    it("shows 'No Warranty' heading", () => {
      render(<TermsContent />);
      expect(screen.getByText("No Warranty")).toBeInTheDocument();
    });

    it("shows 'Limitation of Liability' heading", () => {
      render(<TermsContent />);
      expect(screen.getByText("Limitation of Liability")).toBeInTheDocument();
    });

    it("shows 'Intellectual Property' heading", () => {
      render(<TermsContent />);
      expect(screen.getByText("Intellectual Property")).toBeInTheDocument();
    });

    it("shows 'Changes to Terms' heading", () => {
      render(<TermsContent />);
      expect(screen.getByText("Changes to Terms")).toBeInTheDocument();
    });

    it("renders all 6 section headings", () => {
      render(<TermsContent />);
      const headings = [
        "Acceptance of Terms",
        "Nature of Estimates",
        "No Warranty",
        "Limitation of Liability",
        "Intellectual Property",
        "Changes to Terms",
      ];
      headings.forEach((heading) => {
        expect(screen.getByText(heading)).toBeInTheDocument();
      });
    });
  });

  describe("key disclaimer statements", () => {
    it("states estimates are for planning purposes only", () => {
      render(<TermsContent />);
      expect(
        screen.getByText(/for planning and informational purposes only/i)
      ).toBeInTheDocument();
    });

    it("states the tool is provided 'as is' without warranty", () => {
      render(<TermsContent />);
      expect(
        screen.getByText(/provided.*as is.*without warranty/i)
      ).toBeInTheDocument();
    });

    it("includes limitation of liability language", () => {
      render(<TermsContent />);
      expect(
        screen.getByText(/shall not be liable for any direct, indirect/i)
      ).toBeInTheDocument();
    });

    it("states estimates should not be treated as quotes or guarantees", () => {
      render(<TermsContent />);
      expect(
        screen.getByText(/should not be treated as quotes, guarantees/i)
      ).toBeInTheDocument();
    });
  });
});
