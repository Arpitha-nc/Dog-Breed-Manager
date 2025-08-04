import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../Navbar";

describe("Navbar", () => {
  test("renders the navigation bar with the correct title and link", () => {
    render(<Navbar />);
    expect(
      screen.getByRole("link", { name: /Dog Breeds Manager/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Dog Breeds Manager/i })
    ).toHaveAttribute("href", "/");
  });
});
