import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoadingSpinner from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  test("renders the loading spinner and text", () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  test("renders custom loading message if provided", () => {
    render(<LoadingSpinner message="Please wait..." />);
    expect(screen.getByText("Please wait...")).toBeInTheDocument();
  });
});
