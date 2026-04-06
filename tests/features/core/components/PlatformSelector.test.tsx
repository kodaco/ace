import { render, screen, fireEvent } from "@testing-library/react";
import { PlatformSelector } from "@/features/core/components/PlatformSelector";

const defaultProps = {
  value: "web" as const,
  onChange: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("PlatformSelector", () => {
  describe("rendering", () => {
    it("renders 'Platform' label", () => {
      render(<PlatformSelector {...defaultProps} />);
      expect(screen.getByText("Platform")).toBeInTheDocument();
    });

    it("renders all four platform buttons", () => {
      render(<PlatformSelector {...defaultProps} />);
      expect(screen.getByTestId("platform-web")).toBeInTheDocument();
      expect(screen.getByTestId("platform-ios")).toBeInTheDocument();
      expect(screen.getByTestId("platform-android")).toBeInTheDocument();
      expect(screen.getByTestId("platform-cross-platform")).toBeInTheDocument();
    });

    it("shows cross-platform note when value is 'cross-platform'", () => {
      render(<PlatformSelector value="cross-platform" onChange={jest.fn()} />);
      expect(screen.getByText(/adds ~35%/i)).toBeInTheDocument();
    });

    it("does not show cross-platform note for other platforms", () => {
      render(<PlatformSelector {...defaultProps} value="web" />);
      expect(screen.queryByText(/adds ~35%/i)).not.toBeInTheDocument();
    });
  });

  describe("onChange behaviour (line 43)", () => {
    it("clicking a different platform button calls onChange with the new value", () => {
      const onChange = jest.fn();
      render(<PlatformSelector value="web" onChange={onChange} />);
      fireEvent.click(screen.getByTestId("platform-ios"));
      expect(onChange).toHaveBeenCalledWith("ios");
    });

    it("clicking the already-selected platform does not call onChange (if-v guard)", () => {
      const onChange = jest.fn();
      render(<PlatformSelector value="web" onChange={onChange} />);
      // Click the already-selected "web" button — MUI passes null → if(v) guard skips
      fireEvent.click(screen.getByTestId("platform-web"));
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
