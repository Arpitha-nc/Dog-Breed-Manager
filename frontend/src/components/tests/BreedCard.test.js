import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import BreedCard from "../BreedCard";

jest.mock("../BreedModal.jsx", () => {
  const MockBreedModal = ({
    isOpen,
    closeModal,
    onSubmit,
    title,
    breedName,
    newType,
    onNameChange,
    onTypeChange,
    disableNameInput,
  }) => {
    if (!isOpen) return null;
    return (
      <div role="dialog" aria-modal="true">
        <h2>{title}</h2>
        <label htmlFor="breed-name">Breed Name</label>
        <input
          id="breed-name"
          value={breedName}
          onChange={onNameChange}
          disabled={disableNameInput}
        />
        <label htmlFor="new-type">Types (comma-separated)</label>
        <input id="new-type" value={newType} onChange={onTypeChange} />
        <button onClick={onSubmit}>Save</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    );
  };
  return {
    __esModule: true,
    default: MockBreedModal,
  };
});

describe("BreedCard", () => {
  const mockBreed = {
    name: "Golden Retriever",
    types: ["Standard", "Mini"],
  };
  const mockImage = "https://placehold.co/300x200";
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders breed name, image and types", () => {
    render(
      <BreedCard
        breed={mockBreed}
        image={mockImage}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText("Golden Retriever")).toBeInTheDocument();
    expect(screen.getByText("Standard")).toBeInTheDocument();
    expect(screen.getByText("Mini")).toBeInTheDocument();
    expect(screen.getByAltText("Golden Retriever")).toBeInTheDocument();
  });

  test("opens BreedModal on Edit click", async () => {
    render(
      <BreedCard
        breed={mockBreed}
        image={mockImage}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));
    await waitFor(() => {
      expect(
        screen.getByText(`Edit Breed: ${mockBreed.name}`)
      ).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/Breed Name/i)).toHaveValue(
      "Golden Retriever"
    );
    expect(screen.getByLabelText(/Types/i)).toHaveValue("Standard, Mini");
  });

  test("calls onUpdate with new types on modal submit", async () => {
    render(
      <BreedCard
        breed={mockBreed}
        image={mockImage}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Types/i)).toBeInTheDocument();
    });

    const typeInput = screen.getByLabelText(/Types/i);
    fireEvent.change(typeInput, { target: { value: "Standard, Mini, Large" } });

    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(
        "Golden Retriever",
        "Standard, Mini, Large"
      );
    });
  });

  test("calls onDelete when Delete is clicked", () => {
    render(
      <BreedCard
        breed={mockBreed}
        image={mockImage}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
    expect(mockOnDelete).toHaveBeenCalledWith("Golden Retriever");
  });

  test("closes modal on Cancel", async () => {
    render(
      <BreedCard
        breed={mockBreed}
        image={mockImage}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));
    await waitFor(() => {
      expect(
        screen.getByText(`Edit Breed: ${mockBreed.name}`)
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    await waitFor(() => {
      expect(
        screen.queryByText(`Edit Breed: ${mockBreed.name}`)
      ).not.toBeInTheDocument();
    });
  });
});
