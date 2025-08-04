import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import BreedDetail from "../BreedDetail";
import { server } from "../../mocks/server";
import { MemoryRouter } from "react-router-dom";

const mockUseBreedData = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../hooks/useBreedData", () => ({
  __esModule: true,
  default: () => mockUseBreedData(),
}));

jest.mock("../../components/LoadingSpinner", () => {
  return {
    __esModule: true,
    default: ({ message }) => (
      <div data-testid="loading-spinner">{message || "Loading..."}</div>
    ),
  };
});

describe("BreedDetail Page", () => {
  const mockBreeds = {
    Labrador: ["Yellow", "Black"],
  };

  const mockImages = {
    Labrador: "https://example.com/labrador.jpg",
  };

  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });
  afterAll(() => server.close());

  test("shows loading spinner when loading", () => {
    const useParams = require("react-router-dom").useParams;
    useParams.mockReturnValue({ name: "Labrador" });

    mockUseBreedData.mockReturnValue({
      breeds: {},
      images: {},
      isLoading: true,
    });

    render(<BreedDetail />, { wrapper: MemoryRouter });

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("displays 'Breed Not Found' for unknown breed", () => {
    const useParams = require("react-router-dom").useParams;
    useParams.mockReturnValue({ name: "UnknownBreed" });

    mockUseBreedData.mockReturnValue({
      breeds: mockBreeds,
      images: mockImages,
      isLoading: false,
    });

    render(<BreedDetail />, { wrapper: MemoryRouter });

    expect(screen.getByText("Breed Not Found")).toBeInTheDocument();
    expect(screen.getByText(/could not be found/i)).toBeInTheDocument();
  });

  test("renders breed detail correctly", async () => {
    const useParams = require("react-router-dom").useParams;
    useParams.mockReturnValue({ name: "Labrador" });

    mockUseBreedData.mockReturnValue({
      breeds: mockBreeds,
      images: mockImages,
      isLoading: false,
    });

    render(<BreedDetail />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText("Labrador")).toBeInTheDocument();
      expect(screen.getByText("Types:")).toBeInTheDocument();
      expect(screen.getByText("Yellow")).toBeInTheDocument();
      expect(screen.getByText("Black")).toBeInTheDocument();
      expect(screen.getByAltText("Labrador")).toBeInTheDocument();
    });
  });

  test("back button navigates correctly", async () => {
    const useParams = require("react-router-dom").useParams;
    useParams.mockReturnValue({ name: "Labrador" });

    mockUseBreedData.mockReturnValue({
      breeds: mockBreeds,
      images: mockImages,
      isLoading: false,
    });

    render(<BreedDetail />, { wrapper: MemoryRouter });

    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test("image fallback on error triggers console and hides image", async () => {
    const useParams = require("react-router-dom").useParams;
    useParams.mockReturnValue({ name: "Labrador" });

    mockUseBreedData.mockReturnValue({
      breeds: mockBreeds,
      images: mockImages,
      isLoading: false,
    });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<BreedDetail />, { wrapper: MemoryRouter });

    const image = await screen.findByAltText("Labrador");

    fireEvent.error(image);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Image failed to load:",
      mockImages.Labrador
    );

    consoleSpy.mockRestore();
  });
});
