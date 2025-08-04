import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmationModal from "../ConfirmationModal";

jest.mock("@headlessui/react", () => ({
  Dialog: ({ children, onClose, as: _as, ...props }) => (
    <div role="dialog" aria-modal="true" {...props}>
      {children}
    </div>
  ),
  Transition: ({ children, show, as: _as }) => (show ? <>{children}</> : null),
  TransitionChild: ({
    children,
    as: _as,
    enter,
    enterFrom,
    enterTo,
    leave,
    leaveFrom,
    leaveTo,
    ...props
  }) => <div {...props}>{children}</div>,
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

describe("ConfirmationModal", () => {
  const defaultProps = {
    isOpen: true,
    closeModal: jest.fn(),
    onConfirm: jest.fn(),
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render when isOpen is false", () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("renders correctly when isOpen is true", () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to proceed?")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Confirm/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByTestId("x-mark-icon")).toBeInTheDocument();
  });

  test("calls onConfirm and closeModal when Confirm button is clicked", () => {
    render(<ConfirmationModal {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    expect(defaultProps.closeModal).toHaveBeenCalledTimes(1);
  });

  test("calls closeModal when Cancel button is clicked", () => {
    render(<ConfirmationModal {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(defaultProps.closeModal).toHaveBeenCalledTimes(1);
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });

  test("calls closeModal when close icon is clicked", () => {
    render(<ConfirmationModal {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Close dialog/i }));
    expect(defaultProps.closeModal).toHaveBeenCalledTimes(1);
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });
});
