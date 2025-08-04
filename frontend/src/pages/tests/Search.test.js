import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Search from "../Search";
import { server } from "../../mocks/server";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

const mockUseBreedData = jest.fn();
jest.mock("../../hooks/useBreedData", () => ({
  __esModule: true,
  default: (fetchAll) => mockUseBreedData(fetchAll),
}));

jest.mock("../../components/LoadingSpinner", () => {
  const MockLoadingSpinner = () => (
    <div data-testid="loading-spinner">Loading...</div>
  );
  return { __esModule: true, default: MockLoadingSpinner };
});

jest.mock("../../components/ErrorMessage", () => {
  const MockErrorMessage = ({ message }) => (
    <div data-testid="error-message">Error: {message}</div>
  );
  return { __esModule: true, default: MockErrorMessage };
});

jest.mock("../../components/DogAnimations", () => () => (
  <div data-testid="dog-animations" />
));

describe("Search Page", () => {
  const mockBreeds = {
    Labrador: ["Yellow", "Black"],
    Poodle: ["Standard", "Miniature"],
  };

  const mockImages = {
    Labrador: "labrador.jpg",
    Poodle: "poodle.jpg",
  };

  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });
  afterAll(() => server.close());

  beforeEach(() => {
    mockUseBreedData.mockReturnValue({
      breeds: mockBreeds,
      images: mockImages,
      isLoading: false,
      error: null,
    });
    mockNavigate.mockClear();
  });

  test("renders search input", () => {
    render(<Search />, { wrapper: MemoryRouter });
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  test("filters breeds based on search input", async () => {
    render(<Search />, { wrapper: MemoryRouter });
    const searchInput = screen.getByPlaceholderText("Search");

    fireEvent.change(searchInput, { target: { value: "lab" } });

    await waitFor(() => {
      expect(screen.getByText("Labrador")).toBeInTheDocument();
      expect(screen.queryByText("Poodle")).not.toBeInTheDocument();
    });

    fireEvent.change(searchInput, { target: { value: "pood" } });

    await waitFor(() => {
      expect(screen.getByText("Poodle")).toBeInTheDocument();
      expect(screen.queryByText("Labrador")).not.toBeInTheDocument();
    });
  });

  test("displays loading spinner when loading", () => {
    mockUseBreedData.mockReturnValue({
      breeds: {},
      images: {},
      isLoading: true,
      error: null,
    });

    render(<Search />, { wrapper: MemoryRouter });

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("displays error message on error", () => {
    mockUseBreedData.mockReturnValue({
      breeds: {},
      images: {},
      isLoading: false,
      error: "Fetch error",
    });

    render(<Search />, { wrapper: MemoryRouter });

    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "Error: Fetch error"
    );
  });

  test("displays 'No breeds found' if filter yields no result", () => {
    render(<Search />, { wrapper: MemoryRouter });

    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "xyz" } });

    expect(screen.getByText("No breeds found.")).toBeInTheDocument();
  });

  test("navigates to /alldogs on button click", () => {
    render(<Search />, { wrapper: MemoryRouter });

    const button = screen.getByRole("button", { name: /view all breeds/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/alldogs");
  });
});
