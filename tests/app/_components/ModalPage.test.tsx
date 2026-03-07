import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalPage } from "@/app/_components/ModalPage";

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

describe("ModalPage", () => {
  it("renders the title text", () => {
    render(<ModalPage title="Test Title">content</ModalPage>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <ModalPage title="Some Title">
        <p>Hello from children</p>
      </ModalPage>
    );
    expect(screen.getByText("Hello from children")).toBeInTheDocument();
  });

  it("clicking the close button calls router.back()", async () => {
    const user = userEvent.setup();
    render(<ModalPage title="Close Test">content</ModalPage>);
    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("renders as a Dialog (MUI) — the dialog role is present", () => {
    render(<ModalPage title="Dialog Check">content</ModalPage>);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
