import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import Toast, { ToastType } from "../components/Toast";

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("success");
  const [duration, setDuration] = useState(3000);

  const showToast = useCallback(
    (
      newMessage: string,
      newType: ToastType = "success",
      newDuration = 3000
    ) => {
      // If a toast is already visible, hide it first
      if (visible) {
        setVisible(false);
        setTimeout(() => {
          setMessage(newMessage);
          setType(newType);
          setDuration(newDuration);
          setVisible(true);
        }, 300); // Small delay to allow animation to complete
      } else {
        setMessage(newMessage);
        setType(newType);
        setDuration(newDuration);
        setVisible(true);
      }
    },
    [visible]
  );

  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={message}
        type={type}
        visible={visible}
        onClose={hideToast}
        duration={duration}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
