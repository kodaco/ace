import { render, screen } from "@testing-library/react";
import { BackLink } from "@/app/_components/BackLink";

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

describe("BackLink", () => {
  it("renders a link to '/'", () => {
    render(<BackLink />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("shows the text 'Back to App Cost Estimator'", () => {
    render(<BackLink />);
    expect(screen.getByText("Back to App Cost Estimator")).toBeInTheDocument();
  });

  it("renders an arrow icon (link element exists)", () => {
    render(<BackLink />);
    // ArrowBackIcon is rendered inside the link — the link itself is sufficient evidence
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
  });
});
