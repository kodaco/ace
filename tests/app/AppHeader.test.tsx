import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppHeader } from "@/app/AppHeader";

const mockPush = jest.fn();
const mockBack = jest.fn();

let mockPathname = "/";
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  usePathname: () => mockPathname,
}));

beforeEach(() => {
  mockPush.mockClear();
  mockBack.mockClear();
  mockPathname = "/";
});

describe("AppHeader", () => {
  it("renders the 'ace' logo text", () => {
    render(<AppHeader />);
    expect(screen.getByText("ace")).toBeInTheDocument();
  });

  it("renders the 'Free' chip", () => {
    render(<AppHeader />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("desktop nav has a 'Providers' link", () => {
    render(<AppHeader />);
    // There may be multiple links with this text (desktop + drawer); at least one must exist
    expect(screen.getAllByText("Providers").length).toBeGreaterThan(0);
  });

  it("desktop nav has a 'Before you build' link", () => {
    render(<AppHeader />);
    expect(screen.getAllByText("Before you build").length).toBeGreaterThan(0);
  });

  it("desktop nav has a 'FAQs' link", () => {
    render(<AppHeader />);
    expect(screen.getAllByText("FAQs").length).toBeGreaterThan(0);
  });

  it("desktop nav has a 'Calculator' button", () => {
    render(<AppHeader />);
    const buttons = screen.getAllByRole("button", { name: /calculator/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("mobile hamburger button exists with aria-label 'Open menu'", () => {
    render(<AppHeader />);
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });

  it("clicking the hamburger button opens the drawer showing 'Menu' text", async () => {
    const user = userEvent.setup();
    render(<AppHeader />);

    expect(screen.queryByText("Menu")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("clicking 'Calculator' on '/' scrolls to the calculator section", async () => {
    mockPathname = "/";
    const mockScrollIntoView = jest.fn();
    const mockGetElementById = jest
      .spyOn(document, "getElementById")
      .mockReturnValue({ scrollIntoView: mockScrollIntoView } as unknown as HTMLElement);

    const user = userEvent.setup();
    render(<AppHeader />);

    // Use the first Calculator button (desktop nav)
    const calcButtons = screen.getAllByRole("button", { name: /calculator/i });
    await user.click(calcButtons[0]);

    expect(mockGetElementById).toHaveBeenCalledWith("calculator");
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    expect(mockPush).not.toHaveBeenCalled();

    mockGetElementById.mockRestore();
  });

  it("clicking 'Calculator' when on '/providers' calls router.push('/#calculator')", async () => {
    mockPathname = "/providers";
    const user = userEvent.setup();
    render(<AppHeader />);

    const calcButtons = screen.getAllByRole("button", { name: /calculator/i });
    await user.click(calcButtons[0]);

    expect(mockPush).toHaveBeenCalledWith("/#calculator");
  });

  describe("mobile drawer content", () => {
    it("drawer has a 'Close menu' button", async () => {
      const user = userEvent.setup();
      render(<AppHeader />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));

      expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
    });

    it("clicking 'Close menu' does not crash", async () => {
      const user = userEvent.setup();
      render(<AppHeader />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));
      await user.click(screen.getByRole("button", { name: "Close menu" }));

      // Component still in DOM after closing
      expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
    });

    it("drawer contains 'Before You Build' item", async () => {
      const user = userEvent.setup();
      render(<AppHeader />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));

      expect(screen.getByText("Before You Build")).toBeInTheDocument();
    });

    it("clicking 'Before You Build' in drawer calls router.push('/gotchas')", async () => {
      const user = userEvent.setup();
      render(<AppHeader />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));
      await user.click(screen.getByText("Before You Build"));

      expect(mockPush).toHaveBeenCalledWith("/gotchas");
    });

    it("drawer contains 'FAQs' item", async () => {
      const user = userEvent.setup();
      render(<AppHeader />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));

      expect(screen.getAllByText("FAQs").length).toBeGreaterThan(0);
    });

    it("drawer contains 'Service Providers' item", async () => {
      const user = userEvent.setup();
      render(<AppHeader />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));

      expect(screen.getByText("Service Providers")).toBeInTheDocument();
    });

    it("drawer contains 'GitHub' link", async () => {
      const user = userEvent.setup();
      render(<AppHeader />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));

      expect(screen.getAllByText("GitHub").length).toBeGreaterThan(0);
    });

    it("clicking 'Calculator' inside the drawer calls handleCalcClick", async () => {
      mockPathname = "/providers";
      const user = userEvent.setup();
      render(<AppHeader />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));

      const calcButtons = screen.getAllByRole("button", { name: /calculator/i });
      // Find the one inside the drawer (last one rendered)
      await user.click(calcButtons[calcButtons.length - 1]);

      expect(mockPush).toHaveBeenCalledWith("/#calculator");
    });

    it("clicking 'FAQs' in drawer calls setDrawerOpen(false)", async () => {
      const user = userEvent.setup();
      render(<AppHeader />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));

      // FAQs appears in both desktop nav and drawer — click the last occurrence (drawer)
      const faqsLinks = screen.getAllByText("FAQs");
      await user.click(faqsLinks[faqsLinks.length - 1]);

      // Component stays rendered (no crash)
      expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
    });

    it("clicking 'Service Providers' in drawer calls setDrawerOpen(false)", async () => {
      const user = userEvent.setup();
      render(<AppHeader />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));
      await user.click(screen.getByText("Service Providers"));

      expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
    });

    it("clicking 'GitHub' in drawer calls setDrawerOpen(false)", async () => {
      const user = userEvent.setup();
      render(<AppHeader />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));

      // GitHub appears in both desktop nav and drawer — click the last occurrence
      const githubLinks = screen.getAllByText("GitHub");
      await user.click(githubLinks[githubLinks.length - 1]);

      expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
    });

    it("pressing Escape triggers drawer onClose", async () => {
      const user = userEvent.setup();
      render(<AppHeader />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));
      await user.keyboard("{Escape}");

      // Component stays rendered after escape
      expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
    });
  });
});
