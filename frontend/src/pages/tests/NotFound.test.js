import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NotFound from "../NotFound";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

jest.mock("@heroicons/react/24/outline", () => ({
  ExclamationTriangleIcon: (props) => (
    <svg {...props} data-testid="exclamation-icon"></svg>
  ),
}));

describe("NotFound", () => {
  test("renders 404 page content correctly", () => {
    render(<NotFound />);
    expect(screen.getByText("404 - Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByText("Oops! The page you're looking for doesn't exist.")
    ).toBeInTheDocument();
    expect(screen.getByTestId("exclamation-icon")).toBeInTheDocument();
    const homepageLink = screen.getByRole("link", { name: /Go to Homepage/i });
    expect(homepageLink).toBeInTheDocument();
    expect(homepageLink).toHaveAttribute("href", "/");
  });
});
