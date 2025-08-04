import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "../Dashboard";
import api from "../../lib/api";

const mockUseBreedData = jest.fn();

jest.mock("../../hooks/useBreedData", () => ({
  __esModule: true,
  default: () => mockUseBreedData(),
}));

jest.mock("../../lib/api", () => ({
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

jest.mock("../../components/ToastContainer", () => ({
  useToast: () => ({
    addToast: jest.fn(),
    removeToast: jest.fn(),
  }),
  ToastProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock("../../components/BreedCard", () => {
  const MockBreedCard = ({ breed, image, onUpdate, onDelete }) => (
    <div data-testid={`breed-card-${breed.name}`}>
      {breed.name}: {breed.types.join(", ")}
      <button onClick={() => onUpdate(breed.name, "Chocolate")}>Edit</button>
      <button onClick={() => onDelete(breed.name)}>Delete</button>
    </div>
  );
  return {
    __esModule: true,
    default: MockBreedCard,
  };
});

jest.mock("../../components/LoadingSpinner", () => {
  const MockLoadingSpinner = () => (
    <div data-testid="loading-spinner">Loading...</div>
  );
  return {
    __esModule: true,
    default: MockLoadingSpinner,
  };
});

jest.mock("../../components/ErrorMessage", () => {
  const MockErrorMessage = ({ message }) => (
    <div data-testid="error-message">Error: {message}</div>
  );
  return {
    __esModule: true,
    default: MockErrorMessage,
  };
});

jest.mock("../../components/BreedModal", () => {
  return {
    __esModule: true,
    default: ({
      isOpen,
      closeModal,
      title,
      breedName,
      newType,
      onNameChange,
      onTypeChange,
      onSubmit,
    }) =>
      isOpen ? (
        <div>
          <h2>{title}</h2>
          <input
            aria-label="Breed Name"
            value={breedName}
            onChange={onNameChange}
          />
          <input
            aria-label="Types (comma-separated)"
            value={newType}
            onChange={onTypeChange}
          />
          <button onClick={onSubmit}>Save</button>
        </div>
      ) : null,
  };
});

jest.mock("../../components/ConfirmationModal", () => {
  return {
    __esModule: true,
    default: ({ isOpen, title, message, onConfirm }) =>
      isOpen ? (
        <div>
          <h2>{title}</h2>
          <p>{message}</p>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      ) : null,
  };
});

describe("Dashboard Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBreedData.mockReturnValue({
      breeds: {
        Labrador: ["Yellow", "Black"],
        Poodle: ["Standard", "Miniature"],
      },
      images: {
        Labrador: "labrador.jpg",
        Poodle: "poodle.jpg",
      },
      page: 1,
      totalPages: 2,
      fetchBreeds: jest.fn(),
      isLoading: false,
      error: null,
    });
  });

  test("renders all breeds when data is loaded", () => {
    render(<Dashboard />);
    expect(screen.getByText("Labrador: Yellow, Black")).toBeInTheDocument();
    expect(screen.getByText("Poodle: Standard, Miniature")).toBeInTheDocument();
  });

  test("displays loading spinner when data is loading", () => {
    mockUseBreedData.mockReturnValue({
      breeds: {},
      images: {},
      page: 1,
      totalPages: 1,
      fetchBreeds: jest.fn(),
      isLoading: true,
      error: null,
    });
    render(<Dashboard />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("displays error message when there is an error", () => {
    mockUseBreedData.mockReturnValue({
      breeds: {},
      images: {},
      page: 1,
      totalPages: 1,
      fetchBreeds: jest.fn(),
      isLoading: false,
      error: "Failed to fetch breeds",
    });
    render(<Dashboard />);
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "Error: Failed to fetch breeds"
    );
  });

  test("opens add breed modal when 'Add Breed' button is clicked", () => {
    render(<Dashboard />);
    fireEvent.click(screen.getByRole("button", { name: /Add Breed/i }));
    expect(screen.getByText("Add New Breed")).toBeInTheDocument();
    expect(screen.getByLabelText("Breed Name")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Types (comma-separated)")
    ).toBeInTheDocument();
  });

  test("calls api.post when add breed form is submitted", async () => {
    render(<Dashboard />);
    fireEvent.click(screen.getByRole("button", { name: /Add Breed/i }));

    fireEvent.change(screen.getByLabelText("Breed Name"), {
      target: { value: "Bulldog" },
    });
    fireEvent.change(screen.getByLabelText("Types (comma-separated)"), {
      target: { value: "French, English" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/dogs", {
        breed: "Bulldog",
        types: ["French", "English"],
      });
    });
  });

  test("calls api.put when update is triggered", async () => {
    render(<Dashboard />);
    const editButton = screen
      .getByTestId("breed-card-Labrador")
      .querySelector("button");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/dogs/Labrador", {
        types: ["Chocolate"],
      });
    });
  });

  test("calls api.delete when delete is confirmed", async () => {
    render(<Dashboard />);
    const deleteButton = screen
      .getByTestId("breed-card-Labrador")
      .querySelectorAll("button")[1];
    fireEvent.click(deleteButton);
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith("/dogs/Labrador");
    });
  });
});
