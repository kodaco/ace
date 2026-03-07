import { render, screen } from "@testing-library/react";
import { GotchasContent } from "@/app/_content/GotchasContent";

describe("GotchasContent", () => {
  it("renders without crashing", () => {
    render(<GotchasContent />);
  });

  describe("section headings", () => {
    it("shows 'App Store & Distribution Accounts' heading", () => {
      render(<GotchasContent />);
      expect(screen.getByText("App Store & Distribution Accounts")).toBeInTheDocument();
    });

    it("shows 'DUNS Number' heading", () => {
      render(<GotchasContent />);
      expect(screen.getByText("DUNS Number")).toBeInTheDocument();
    });

    it("shows 'Domain Name' heading", () => {
      render(<GotchasContent />);
      expect(screen.getByText("Domain Name")).toBeInTheDocument();
    });

    it("shows 'Web Hosting and Cloud Infrastructure' heading", () => {
      render(<GotchasContent />);
      expect(screen.getByText("Web Hosting and Cloud Infrastructure")).toBeInTheDocument();
    });

    it("shows 'Email and Notifications' heading", () => {
      render(<GotchasContent />);
      expect(screen.getByText("Email and Notifications")).toBeInTheDocument();
    });

    it("shows 'Security and Password Management' heading", () => {
      render(<GotchasContent />);
      expect(screen.getByText("Security and Password Management")).toBeInTheDocument();
    });

    it("shows 'Payment Processing' heading", () => {
      render(<GotchasContent />);
      expect(screen.getByText("Payment Processing")).toBeInTheDocument();
    });

    it("shows 'Third-Party Services and APIs' heading", () => {
      render(<GotchasContent />);
      expect(screen.getByText("Third-Party Services and APIs")).toBeInTheDocument();
    });

    it("shows 'Legal and Business Basics' heading", () => {
      render(<GotchasContent />);
      expect(screen.getByText("Legal and Business Basics")).toBeInTheDocument();
    });

    it("shows 'App Store Listing Assets' heading", () => {
      render(<GotchasContent />);
      expect(screen.getByText("App Store Listing Assets")).toBeInTheDocument();
    });
  });

  describe("item names", () => {
    it("shows 'Apple Developer Program' item", () => {
      render(<GotchasContent />);
      expect(screen.getByText("Apple Developer Program")).toBeInTheDocument();
    });

    it("shows 'Google Play Developer Account' item", () => {
      render(<GotchasContent />);
      expect(screen.getByText("Google Play Developer Account")).toBeInTheDocument();
    });

    it("shows 'Domain Registration' item", () => {
      render(<GotchasContent />);
      expect(screen.getByText("Domain Registration")).toBeInTheDocument();
    });

    it("shows 'SSL Certificate' item", () => {
      render(<GotchasContent />);
      expect(screen.getByText("SSL Certificate")).toBeInTheDocument();
    });

    it("shows 'Two-Factor Authentication' item", () => {
      render(<GotchasContent />);
      expect(screen.getByText("Two-Factor Authentication")).toBeInTheDocument();
    });

    it("shows 'In-App Purchase Commission' item", () => {
      render(<GotchasContent />);
      expect(screen.getByText("In-App Purchase Commission")).toBeInTheDocument();
    });
  });

  describe("cost information", () => {
    it("shows Apple Developer Program cost of $99/year", () => {
      render(<GotchasContent />);
      expect(screen.getByText("$99/year")).toBeInTheDocument();
    });

    it("shows Google Play cost of $25 one-time", () => {
      render(<GotchasContent />);
      expect(screen.getByText("$25 one-time")).toBeInTheDocument();
    });

    it("shows domain registration cost range", () => {
      render(<GotchasContent />);
      expect(screen.getByText("$10–20/year for common extensions")).toBeInTheDocument();
    });

    it("shows in-app purchase commission range", () => {
      render(<GotchasContent />);
      expect(screen.getByText("15–30% taken by Apple and Google")).toBeInTheDocument();
    });

    it("shows payment processor fee", () => {
      render(<GotchasContent />);
      expect(screen.getByText("2.9% + $0.30 per transaction (US standard)")).toBeInTheDocument();
    });
  });

  describe("notes", () => {
    it("shows a note about Apple enrollment taking one to four weeks", () => {
      render(<GotchasContent />);
      expect(
        screen.getByText(/review process can take one to four weeks/i)
      ).toBeInTheDocument();
    });

    it("shows a note about the DUNS expedited option", () => {
      render(<GotchasContent />);
      expect(
        screen.getByText(/expedited option.*can turn it around in a few days/i)
      ).toBeInTheDocument();
    });

    it("shows a note about SSL certificates being free with modern hosting", () => {
      render(<GotchasContent />);
      expect(
        screen.getByText(/Most hosting platforms handle this automatically/i)
      ).toBeInTheDocument();
    });

    it("shows the intro note for App Store section", () => {
      render(<GotchasContent />);
      expect(
        screen.getByText(/Budget time for these, not just money/i)
      ).toBeInTheDocument();
    });

    it("shows the intro note for Web Hosting section about development hours only", () => {
      render(<GotchasContent />);
      expect(
        screen.getByText(/the estimates in this tool cover development hours only/i)
      ).toBeInTheDocument();
    });
  });
});
