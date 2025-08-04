import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { ToastProvider, useToast } from "../ToastContainer";
import React from "react";

let testAddToast;

const TestComponent = () => {
  const { addToast } = useToast();
  testAddToast = addToast;
  return null;
};

jest.mock("@heroicons/react/24/solid", () => ({
  XMarkIcon: (props) => <svg {...props} data-testid="x-mark-icon" />,
}));

describe("ToastProvider", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    testAddToast = undefined;
  });

  test("renders children correctly", () => {
    render(
      <ToastProvider>
        <div data-testid="child-element">Hello from child</div>
      </ToastProvider>
    );
    expect(screen.getByTestId("child-element")).toBeInTheDocument();
  });

  test("adds and displays a success toast", async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    await act(async () => {
      testAddToast("Success message!", "success", 100);
    });
    const toast = await screen.findByText("Success message!");
    expect(toast).toBeInTheDocument();
    expect(toast.parentElement).toHaveClass("bg-green-500");
    expect(toast.parentElement).toHaveClass("text-white");
  });

  test("adds and displays an error toast", async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    await act(async () => {
      testAddToast("Error message!", "error", 100);
    });
    const toast = await screen.findByText("Error message!");
    expect(toast).toBeInTheDocument();
    expect(toast.parentElement).toHaveClass("bg-red-500");
    expect(toast.parentElement).toHaveClass("text-white");
  });

  test("adds and displays a warning toast", async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    await act(async () => {
      testAddToast("Warning message!", "warning", 100);
    });
    const toast = await screen.findByText("Warning message!");
    expect(toast).toBeInTheDocument();
    expect(toast.parentElement).toHaveClass("bg-yellow-500");
    expect(toast.parentElement).toHaveClass("text-gray-900");
  });

  test("adds and displays an info toast", async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    await act(async () => {
      testAddToast("Info message!", "info", 100);
    });
    const toast = await screen.findByText("Info message!");
    expect(toast).toBeInTheDocument();
    expect(toast.parentElement).toHaveClass("bg-blue-500");
    expect(toast.parentElement).toHaveClass("text-white");
  });

  test("automatically removes toast after duration", async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    await act(async () => {
      testAddToast("Auto-remove message", "info", 100);
    });
    const toast = await screen.findByText("Auto-remove message");
    expect(toast).toBeInTheDocument();
    await act(async () => {
      jest.advanceTimersByTime(100);
    });
    await waitFor(() => {
      expect(screen.queryByText("Auto-remove message")).not.toBeInTheDocument();
    });
  });

  test("manually removes toast when close button is clicked", async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    await act(async () => {
      testAddToast("Manual close message");
    });
    const toast = await screen.findByText("Manual close message");
    expect(toast).toBeInTheDocument();
    const closeButton = screen.getByLabelText("Close toast");
    await act(async () => {
      fireEvent.click(closeButton);
    });
    await waitFor(() => {
      expect(
        screen.queryByText("Manual close message")
      ).not.toBeInTheDocument();
    });
  });

  test("multiple toasts can be displayed and removed independently", async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    await act(async () => {
      testAddToast("Toast One", "success", 100);
      testAddToast("Toast Two", "error", 100);
    });
    const toastOne = await screen.findByText("Toast One");
    const toastTwo = await screen.findByText("Toast Two");
    expect(toastOne).toBeInTheDocument();
    expect(toastTwo).toBeInTheDocument();
    const closeButtons = screen.getAllByLabelText("Close toast");
    await act(async () => {
      fireEvent.click(closeButtons[1]);
    });
    await waitFor(() => {
      expect(screen.queryByText("Toast Two")).not.toBeInTheDocument();
      expect(screen.queryByText("Toast One")).toBeInTheDocument();
    });
    await act(async () => {
      jest.advanceTimersByTime(100);
    });
    await waitFor(() => {
      expect(screen.queryByText("Toast One")).not.toBeInTheDocument();
    });
  });
});
