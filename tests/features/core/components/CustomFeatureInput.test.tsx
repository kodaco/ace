import { render, screen, fireEvent } from "@testing-library/react";
import { CustomFeatureInput } from "@/features/core/components/CustomFeatureInput";

describe("CustomFeatureInput", () => {
  describe("initial state", () => {
    it("shows 'Add a custom feature' button", () => {
      render(<CustomFeatureInput onAdd={jest.fn()} />);
      expect(
        screen.getByRole("button", { name: /Add a custom feature/i })
      ).toBeInTheDocument();
    });

    it("does not show the form initially", () => {
      render(<CustomFeatureInput onAdd={jest.fn()} />);
      expect(
        screen.queryByPlaceholderText(/e.g. Custom AI Chatbot/i)
      ).not.toBeInTheDocument();
    });
  });

  describe("opening the form", () => {
    it("clicking the button reveals the name field", () => {
      render(<CustomFeatureInput onAdd={jest.fn()} />);
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      expect(screen.getByPlaceholderText(/e.g. Custom AI Chatbot/i)).toBeInTheDocument();
    });

    it("shows size toggle buttons (Small, Medium, Large)", () => {
      render(<CustomFeatureInput onAdd={jest.fn()} />);
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      expect(screen.getByRole("button", { name: /Small/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Medium/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Large/i })).toBeInTheDocument();
    });

    it("clicking the already-selected size button does not change size (null guard line 32)", () => {
      const onAdd = jest.fn();
      render(<CustomFeatureInput onAdd={onAdd} />);
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      // Medium is selected by default — clicking it again sends null from MUI
      fireEvent.click(screen.getByRole("button", { name: /Medium/i }));
      // Fill in a name and add — should still use Medium hours
      fireEvent.change(screen.getByPlaceholderText(/e.g. Custom AI Chatbot/i), {
        target: { value: "Still Medium" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add" }));
      expect(onAdd).toHaveBeenCalledWith(
        expect.objectContaining({ minHours: 60, maxHours: 100 })
      );
    });
  });

  describe("Add button state", () => {
    it("'Add' submit button is disabled when name is empty", () => {
      render(<CustomFeatureInput onAdd={jest.fn()} />);
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      // The contained "Add" button (not "Add a custom feature")
      const addBtn = screen.getByRole("button", { name: "Add" });
      expect(addBtn).toBeDisabled();
    });

    it("'Add' submit button is enabled when name is typed", () => {
      render(<CustomFeatureInput onAdd={jest.fn()} />);
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      fireEvent.change(screen.getByPlaceholderText(/e.g. Custom AI Chatbot/i), {
        target: { value: "My Feature" },
      });
      expect(screen.getByRole("button", { name: "Add" })).not.toBeDisabled();
    });
  });

  describe("adding a feature", () => {
    it("clicking Add calls onAdd with a custom-prefixed id", () => {
      const onAdd = jest.fn();
      render(<CustomFeatureInput onAdd={onAdd} />);
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      fireEvent.change(screen.getByPlaceholderText(/e.g. Custom AI Chatbot/i), {
        target: { value: "My Feature" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add" }));
      expect(onAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringContaining("custom-"),
          name: "My Feature",
          category: "advanced",
        })
      );
    });

    it("uses Medium hours by default (min:60, max:100)", () => {
      const onAdd = jest.fn();
      render(<CustomFeatureInput onAdd={onAdd} />);
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      fireEvent.change(screen.getByPlaceholderText(/e.g. Custom AI Chatbot/i), {
        target: { value: "Med Feature" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add" }));
      expect(onAdd).toHaveBeenCalledWith(
        expect.objectContaining({ minHours: 60, maxHours: 100 })
      );
    });

    it("selecting Small uses min:10, max:30", () => {
      const onAdd = jest.fn();
      render(<CustomFeatureInput onAdd={onAdd} />);
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      fireEvent.click(screen.getByRole("button", { name: /Small/i }));
      fireEvent.change(screen.getByPlaceholderText(/e.g. Custom AI Chatbot/i), {
        target: { value: "Small Feature" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add" }));
      expect(onAdd).toHaveBeenCalledWith(
        expect.objectContaining({ minHours: 10, maxHours: 30 })
      );
    });

    it("selecting Large uses min:160, max:240", () => {
      const onAdd = jest.fn();
      render(<CustomFeatureInput onAdd={onAdd} />);
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      fireEvent.click(screen.getByRole("button", { name: /Large/i }));
      fireEvent.change(screen.getByPlaceholderText(/e.g. Custom AI Chatbot/i), {
        target: { value: "Large Feature" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add" }));
      expect(onAdd).toHaveBeenCalledWith(
        expect.objectContaining({ minHours: 160, maxHours: 240 })
      );
    });

    it("form resets to Add button after successful add", () => {
      const onAdd = jest.fn();
      render(<CustomFeatureInput onAdd={onAdd} />);
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      fireEvent.change(screen.getByPlaceholderText(/e.g. Custom AI Chatbot/i), {
        target: { value: "My Feature" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add" }));
      expect(
        screen.getByRole("button", { name: /Add a custom feature/i })
      ).toBeInTheDocument();
    });
  });

  describe("keyboard interactions", () => {
    it("pressing Enter with a name calls onAdd", () => {
      const onAdd = jest.fn();
      render(<CustomFeatureInput onAdd={onAdd} />);
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      const input = screen.getByPlaceholderText(/e.g. Custom AI Chatbot/i);
      fireEvent.change(input, { target: { value: "Keyboard Feature" } });
      fireEvent.keyDown(input, { key: "Enter" });
      expect(onAdd).toHaveBeenCalled();
    });

    it("pressing Enter with an empty name does NOT call onAdd", () => {
      const onAdd = jest.fn();
      render(<CustomFeatureInput onAdd={onAdd} />);
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      const input = screen.getByPlaceholderText(/e.g. Custom AI Chatbot/i);
      fireEvent.keyDown(input, { key: "Enter" });
      expect(onAdd).not.toHaveBeenCalled();
    });

    it("pressing Escape closes the form", () => {
      render(<CustomFeatureInput onAdd={jest.fn()} />);
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      const input = screen.getByPlaceholderText(/e.g. Custom AI Chatbot/i);
      fireEvent.keyDown(input, { key: "Escape" });
      expect(
        screen.getByRole("button", { name: /Add a custom feature/i })
      ).toBeInTheDocument();
    });
  });

  describe("Cancel button", () => {
    it("clicking Cancel closes the form", () => {
      render(<CustomFeatureInput onAdd={jest.fn()} />);
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
      expect(
        screen.getByRole("button", { name: /Add a custom feature/i })
      ).toBeInTheDocument();
    });

    it("clicking Cancel does not call onAdd", () => {
      const onAdd = jest.fn();
      render(<CustomFeatureInput onAdd={onAdd} />);
      fireEvent.click(screen.getByRole("button", { name: /Add a custom feature/i }));
      fireEvent.change(screen.getByPlaceholderText(/e.g. Custom AI Chatbot/i), {
        target: { value: "Cancelled Feature" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
      expect(onAdd).not.toHaveBeenCalled();
    });
  });
});
