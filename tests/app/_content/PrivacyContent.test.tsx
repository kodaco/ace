import { render, screen } from "@testing-library/react";
import { PrivacyContent } from "@/app/_content/PrivacyContent";

describe("PrivacyContent", () => {
  it("renders without crashing", () => {
    render(<PrivacyContent />);
  });

  it("shows 'Last updated: March 2026' text", () => {
    render(<PrivacyContent />);
    expect(screen.getByText("Last updated: March 2026")).toBeInTheDocument();
  });

  describe("section headings", () => {
    it("shows 'Information We Collect' heading", () => {
      render(<PrivacyContent />);
      expect(screen.getByText("Information We Collect")).toBeInTheDocument();
    });

    it("shows 'Analytics' heading", () => {
      render(<PrivacyContent />);
      expect(screen.getByText("Analytics")).toBeInTheDocument();
    });

    it("shows 'Cookies' heading", () => {
      render(<PrivacyContent />);
      expect(screen.getByText("Cookies")).toBeInTheDocument();
    });

    it("shows 'Third-Party Services' heading", () => {
      render(<PrivacyContent />);
      expect(screen.getByText("Third-Party Services")).toBeInTheDocument();
    });

    it("shows \"Children's Privacy\" heading", () => {
      render(<PrivacyContent />);
      expect(screen.getByText("Children's Privacy")).toBeInTheDocument();
    });

    it("shows 'Changes to This Policy' heading", () => {
      render(<PrivacyContent />);
      expect(screen.getByText("Changes to This Policy")).toBeInTheDocument();
    });

    it("shows 'Contact' heading", () => {
      render(<PrivacyContent />);
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("renders all 7 section headings", () => {
      render(<PrivacyContent />);
      const headings = [
        "Information We Collect",
        "Analytics",
        "Cookies",
        "Third-Party Services",
        "Children's Privacy",
        "Changes to This Policy",
        "Contact",
      ];
      headings.forEach((heading) => {
        expect(screen.getByText(heading)).toBeInTheDocument();
      });
    });
  });

  describe("key privacy statements", () => {
    it("states no personal information is collected or stored", () => {
      render(<PrivacyContent />);
      expect(
        screen.getByText(/do not collect, store, or transmit/i)
      ).toBeInTheDocument();
    });

    it("states the site does not use tracking cookies", () => {
      render(<PrivacyContent />);
      expect(
        screen.getByText(/does not use tracking cookies or advertising cookies/i)
      ).toBeInTheDocument();
    });

    it("states no data is shared with third-party advertising networks", () => {
      render(<PrivacyContent />);
      expect(
        screen.getByText(/We do not share any data with third-party advertising networks/i)
      ).toBeInTheDocument();
    });

    it("mentions the service is not directed at children under 13", () => {
      render(<PrivacyContent />);
      expect(
        screen.getByText(/not directed at children under the age of 13/i)
      ).toBeInTheDocument();
    });
  });
});
