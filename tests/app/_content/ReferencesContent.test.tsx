import { render, screen } from "@testing-library/react";
import { ReferencesContent } from "@/app/_content/ReferencesContent";

describe("ReferencesContent", () => {
  it("renders without crashing", () => {
    render(<ReferencesContent />);
  });

  it("shows the introductory paragraph about industry sources", () => {
    render(<ReferencesContent />);
    expect(
      screen.getByText(/based on published research from reputable software development/i)
    ).toBeInTheDocument();
  });

  it("mentions sources were reviewed in early 2026", () => {
    render(<ReferencesContent />);
    expect(screen.getByText(/reviewed in early 2026/i)).toBeInTheDocument();
  });

  describe("research source titles", () => {
    it("shows 'Netguru: Mobile App Development Cost'", () => {
      render(<ReferencesContent />);
      expect(screen.getByText("Netguru: Mobile App Development Cost")).toBeInTheDocument();
    });

    it("shows 'GetNerdify: Mobile App Development Cost Calculator'", () => {
      render(<ReferencesContent />);
      expect(
        screen.getByText("GetNerdify: Mobile App Development Cost Calculator")
      ).toBeInTheDocument();
    });

    it("shows 'Clutch: Cost to Build a Mobile App Survey'", () => {
      render(<ReferencesContent />);
      expect(screen.getByText("Clutch: Cost to Build a Mobile App Survey")).toBeInTheDocument();
    });

    it("shows 'GoodFirms: Cost to Develop an App'", () => {
      render(<ReferencesContent />);
      expect(screen.getByText("GoodFirms: Cost to Develop an App")).toBeInTheDocument();
    });

    it("shows 'Cleveroad: How Much Does It Cost to Develop an App'", () => {
      render(<ReferencesContent />);
      expect(
        screen.getByText("Cleveroad: How Much Does It Cost to Develop an App")
      ).toBeInTheDocument();
    });

    it("shows 'Stormotion: App Maintenance Cost'", () => {
      render(<ReferencesContent />);
      expect(screen.getByText("Stormotion: App Maintenance Cost")).toBeInTheDocument();
    });

    it("shows 'Appinventiv: Software Maintenance Cost'", () => {
      render(<ReferencesContent />);
      expect(screen.getByText("Appinventiv: Software Maintenance Cost")).toBeInTheDocument();
    });

    it("shows 'TopFlight Apps: App Development Costs'", () => {
      render(<ReferencesContent />);
      expect(screen.getByText("TopFlight Apps: App Development Costs")).toBeInTheDocument();
    });

    it("shows 'Mind Studios: How Much Does It Cost to Create an App'", () => {
      render(<ReferencesContent />);
      expect(
        screen.getByText("Mind Studios: How Much Does It Cost to Create an App")
      ).toBeInTheDocument();
    });

    it("shows 'Business of Apps: App Development Cost Research'", () => {
      render(<ReferencesContent />);
      expect(
        screen.getByText("Business of Apps: App Development Cost Research")
      ).toBeInTheDocument();
    });
  });

  describe("AI Toggle section", () => {
    it("shows 'AI Toggle' heading", () => {
      render(<ReferencesContent />);
      expect(screen.getByText("AI Toggle")).toBeInTheDocument();
    });

    it("shows description text for the AI toggle section", () => {
      render(<ReferencesContent />);
      expect(
        screen.getByText(/The 25% build time reduction and higher maintenance estimates/i)
      ).toBeInTheDocument();
    });

    it("shows 'Microsoft & Accenture: AI Productivity Research' source", () => {
      render(<ReferencesContent />);
      expect(
        screen.getByText("Microsoft & Accenture: AI Productivity Research")
      ).toBeInTheDocument();
    });

    it("shows 'GitClear: Code Quality in AI-Assisted Codebases' source", () => {
      render(<ReferencesContent />);
      expect(
        screen.getByText("GitClear: Code Quality in AI-Assisted Codebases")
      ).toBeInTheDocument();
    });

    it("shows 'Harness: State of Software Delivery 2025' source", () => {
      render(<ReferencesContent />);
      expect(
        screen.getByText("Harness: State of Software Delivery 2025")
      ).toBeInTheDocument();
    });

    it("shows 'Google DORA: Accelerate State of DevOps 2024' source", () => {
      render(<ReferencesContent />);
      expect(
        screen.getByText("Google DORA: Accelerate State of DevOps 2024")
      ).toBeInTheDocument();
    });

    it("shows 'METR: Measuring AI Coding Productivity (Independent Study)' source", () => {
      render(<ReferencesContent />);
      expect(
        screen.getByText("METR: Measuring AI Coding Productivity (Independent Study)")
      ).toBeInTheDocument();
    });
  });

  describe("links", () => {
    it("renders all research source links as anchor elements", () => {
      render(<ReferencesContent />);
      const links = screen.getAllByRole("link");
      // 10 main sources + 5 AI sources = 15 total links
      expect(links.length).toBe(15);
    });

    it("Netguru link has a valid href", () => {
      render(<ReferencesContent />);
      const link = screen.getByRole("link", { name: "Netguru: Mobile App Development Cost" });
      expect(link).toHaveAttribute("href", "https://www.netguru.com/blog/mobile-app-development-cost");
    });

    it("Clutch link has a valid href", () => {
      render(<ReferencesContent />);
      const link = screen.getByRole("link", { name: "Clutch: Cost to Build a Mobile App Survey" });
      expect(link).toHaveAttribute("href", "https://clutch.co/app-developers/resources/cost-build-mobile-app-survey-2015");
    });

    it("Microsoft & Accenture AI source link has a valid href", () => {
      render(<ReferencesContent />);
      const link = screen.getByRole("link", { name: "Microsoft & Accenture: AI Productivity Research" });
      expect(link).toHaveAttribute("href", expect.stringContaining("javacodegeeks.com"));
    });

    it("all links have an href attribute", () => {
      render(<ReferencesContent />);
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("href");
        expect(link.getAttribute("href")).not.toBe("");
      });
    });

    it("all links open in a new tab (target=_blank)", () => {
      render(<ReferencesContent />);
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
      });
    });

    it("all links have rel=noopener noreferrer for security", () => {
      render(<ReferencesContent />);
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });
});
