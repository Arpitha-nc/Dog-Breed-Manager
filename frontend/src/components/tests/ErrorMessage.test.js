import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorMessage from "../ErrorMessage";
import React from "react";

jest.mock("@heroicons/react/24/solid", () => ({
  XMarkIcon: (props) => <svg {...props} data-testid="x-mark-icon" />,
}));

describe("ErrorMessage", () => {
  const defaultProps = {
    message: "This is a test error message.",
  };

  test("renders correctly with a provided message", () => {
    render(<ErrorMessage {...defaultProps} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test error message.")
    ).toBeInTheDocument();
    expect(screen.getByTestId("x-mark-icon")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Dismiss alert/i })
    ).toBeInTheDocument();
  });

  test("renders default message when message prop is empty", () => {
    render(<ErrorMessage message="" />);
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  test("renders default message when message prop is not provided", () => {
    render(<ErrorMessage />);
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  test("dismisses when the close button is clicked", async () => {
    render(<ErrorMessage {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Dismiss alert/i }));
    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
