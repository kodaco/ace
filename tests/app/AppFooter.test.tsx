import { render, screen } from "@testing-library/react";
import { AppFooter } from "@/app/AppFooter";

const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  usePathname: () => "/",
}));

beforeEach(() => {
  mockPush.mockClear();
  mockBack.mockClear();
});

describe("AppFooter", () => {
  beforeEach(() => {
    render(<AppFooter />);
  });

  it("renders the 'ace' brand name", () => {
    // The brand name appears in the footer logo area (subtitle1 Typography)
    expect(screen.getAllByText("ace").length).toBeGreaterThan(0);
  });

  it("renders the current year in the copyright notice", () => {
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  it("renders the 'About' tool link", () => {
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("renders the 'How It Works' tool link", () => {
    expect(screen.getByText("How It Works")).toBeInTheDocument();
  });

  it("renders the 'FAQs' tool link", () => {
    expect(screen.getByText("FAQs")).toBeInTheDocument();
  });

  it("renders the 'Before You Build' tool link", () => {
    expect(screen.getByText("Before You Build")).toBeInTheDocument();
  });

  // it("renders the 'Service Providers' tool link", () => {
  //   expect(screen.getByText("Service Providers")).toBeInTheDocument();
  // });

  it("renders the 'Privacy' legal link", () => {
    expect(screen.getByText("Privacy")).toBeInTheDocument();
  });

  it("renders the 'Terms' legal link", () => {
    expect(screen.getByText("Terms")).toBeInTheDocument();
  });

  it("renders the 'References' legal link", () => {
    expect(screen.getByText("References")).toBeInTheDocument();
  });

  it("renders the 'Designed by koda co., Sun & Prairie Studios' attribution", () => {
    expect(screen.getByText('Designed by koda co., Sun & Prairie Studios')).toBeInTheDocument();
  });
});
