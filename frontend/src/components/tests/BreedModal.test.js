import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import BreedModal from "../BreedModal";

jest.mock("@headlessui/react", () => ({
  Dialog: ({ children, onClose, as: _as, ...props }) => (
    <div role="dialog" aria-modal="true" {...props}>
      {children}
    </div>
  ),
  Transition: ({ children, show }) => (show ? <>{children}</> : null),
  TransitionChild: ({ children, ...props }) => <div {...props}>{children}</div>,
  DialogPanel: ({ children, className }) => (
    <div className={className}>{children}</div>
  ),
  DialogTitle: ({ children, className }) => (
    <h3 className={className}>{children}</h3>
  ),
}));

jest.mock("@heroicons/react/24/solid", () => ({
  XMarkIcon: (props) => <svg {...props} data-testid="x-mark-icon" />,
}));

describe("BreedModal", () => {
  const defaultProps = {
    isOpen: true,
    closeModal: jest.fn(),
    title: "Test Modal",
    breedName: "Labrador",
    newType: "Yellow, Black",
    onNameChange: jest.fn(),
    onTypeChange: jest.fn(),
    onSubmit: jest.fn(),
    disableNameInput: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render when isOpen is false", () => {
    render(<BreedModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("renders correctly when isOpen is true", () => {
    render(<BreedModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByLabelText(/Breed Name/i)).toHaveValue("Labrador");
    expect(screen.getByLabelText(/Types/i)).toHaveValue("Yellow, Black");
    expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByTestId("x-mark-icon")).toBeInTheDocument();
  });

  test("breed name input is disabled when disableNameInput is true", () => {
    render(<BreedModal {...defaultProps} disableNameInput={true} />);
    expect(screen.getByLabelText(/Breed Name/i)).toBeDisabled();
  });

  test("breed name input is enabled when disableNameInput is false", () => {
    render(<BreedModal {...defaultProps} disableNameInput={false} />);
    expect(screen.getByLabelText(/Breed Name/i)).not.toBeDisabled();
  });

  test("calls onNameChange when breed name input changes", () => {
    render(<BreedModal {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Breed Name/i), {
      target: { value: "Poodle" },
    });
    expect(defaultProps.onNameChange).toHaveBeenCalledTimes(1);
  });

  test("calls onTypeChange when new type input changes", () => {
    render(<BreedModal {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Types/i), {
      target: { value: "Standard" },
    });
    expect(defaultProps.onTypeChange).toHaveBeenCalledTimes(1);
  });

  test("calls onSubmit when the form is submitted", async () => {
    render(<BreedModal {...defaultProps} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Save/i }));
    });
    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  test("calls closeModal when the Cancel button is clicked", () => {
    render(<BreedModal {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(defaultProps.closeModal).toHaveBeenCalledTimes(1);
  });

  test("calls closeModal when the close icon button is clicked", () => {
    render(<BreedModal {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Close dialog/i }));
    expect(defaultProps.closeModal).toHaveBeenCalledTimes(1);
  });
});
