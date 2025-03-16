import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast = ({
  message,
  type = "success",
  visible,
  onClose,
  duration = 3000,
}: ToastProps) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose, duration]);

  const getToastStyle = () => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-500 text-green-700";
      case "error":
        return "bg-red-100 border-red-500 text-red-700";
      default:
        return "bg-blue-100 border-blue-500 text-blue-700";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-green-500 text-lg" />;
      case "error":
        return <FaExclamationCircle className="text-red-500 text-lg" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div
            className={`flex items-center justify-between p-4 rounded-md shadow-md border-l-4 ${getToastStyle()}`}
          >
            <div className="flex items-center gap-2">
              {getIcon()}
              <p>{message}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
