import { useState, createContext, useContext, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [nextId, setNextId] = useState(0);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = "info", duration = 3000) => {
      let newId;
      setNextId((prevId) => {
        newId = prevId;
        return prevId + 1;
      });

      const newToast = { id: newId, message, type };
      setToasts((prevToasts) => [...prevToasts, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(newId);
        }, duration);
      }
      return newId;
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast toast-top toast-end z-50">
        {toasts.map((toast) => (
          <div key={toast.id} className={`alert alert-${toast.type}`}>
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="btn btn-ghost btn-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
