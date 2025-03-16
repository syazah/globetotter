import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaUser, FaLock, FaTimes, FaSpinner } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import html2canvas from "html2canvas";
import axios from "../../utils/axios.config";

// Types for form state
interface FormData {
  username: string;
  password: string;
}

// Types for user validation
interface ValidationState {
  isUsernameAvailable: boolean;
  isUsernameChecking: boolean;
  errorMessage: string;
}

// Props for the invite modal
interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  currentClue?: string;
}

// Main InviteModal component
const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  score,
  currentClue,
}) => {
  // States for controlling the flow
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [validation, setValidation] = useState<ValidationState>({
    isUsernameAvailable: false,
    isUsernameChecking: false,
    errorMessage: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [friendsToken, setFriendsToken] = useState<string | null>(null);

  // Auth context for user operations - using registerUser from AuthContext
  const { registerFriend, user: invitingUser } = useAuthContext();

  // Toast context for notifications
  const { showToast } = useToast();

  // Refs for the share image container
  const shareContentRef = useRef<HTMLDivElement>(null);

  // Close modal and reset state
  const handleClose = () => {
    setStep(1);
    setFormData({ username: "", password: "" });
    setValidation({
      isUsernameAvailable: false,
      isUsernameChecking: false,
      errorMessage: "",
    });
    setIsCreating(false);
    setShareImage(null);
    onClose();
  };

  // Check if username is available after debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username.length >= 3) {
        checkUsername(formData.username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  // Use the existing username availability check function
  const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setValidation({
        isUsernameAvailable: false,
        isUsernameChecking: false,
        errorMessage: "Username must be at least 3 characters",
      });
      return;
    }

    setValidation({
      ...validation,
      isUsernameChecking: true,
      errorMessage: "",
    });

    try {
      // Use the existing API endpoint to check username availability
      const response = await axios.get(`/api/user/username/${username}`);

      // If success is true, the username is taken
      // If success is false, the username is available
      const isAvailable = !response.data.success;

      setValidation({
        isUsernameAvailable: isAvailable,
        isUsernameChecking: false,
        errorMessage: isAvailable ? "" : "Username is already taken",
      });

      // Show toast notification if username is taken
      if (!isAvailable) {
        showToast("Username is already taken", "error");
      }
    } catch (error) {
      console.log(error);
      setValidation({
        ...validation,
        isUsernameChecking: false,
        errorMessage: "Error checking username",
      });
      showToast("Failed to check username availability", "error");
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset validation when username changes
    if (name === "username") {
      setValidation({
        isUsernameAvailable: false,
        isUsernameChecking: false,
        errorMessage: "",
      });
    }
  };

  // Handle form submission for each step
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1 && validation.isUsernameAvailable) {
      setStep(2);
    } else if (step === 2) {
      try {
        setIsCreating(true);

        const friendsToken = await registerFriend(
          formData.username,
          formData.password
        );

        setFriendsToken(friendsToken);

        setStep(3);
        setIsCreating(false);

        // Show success toast notification
        showToast(
          `Account created successfully as ${formData.username}!`,
          "success"
        );

        // Generate share image after a small delay
        setTimeout(() => {
          generateShareImage();
        }, 1500);
      } catch (error) {
        console.log(error);
        setIsCreating(false);
        setValidation({
          ...validation,
          errorMessage: "Error creating account",
        });
        showToast("Failed to create account", "error");
      }
    }
  };

  // Generate image for sharing
  const generateShareImage = async () => {
    if (shareContentRef.current) {
      try {
        const images = shareContentRef.current.querySelectorAll("img");
        if (images.length > 0) {
          await Promise.all(
            [...images].map((img) => {
              if (img.complete) return Promise.resolve();
              return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
              });
            })
          );
        }
        const canvas = await html2canvas(shareContentRef.current, {
          scale: 2,
          backgroundColor: null,
          logging: false,
        });

        const image = canvas.toDataURL("image/png");
        setShareImage(image);
      } catch (error) {
        console.error("Error generating share image:", error);
        showToast("Failed to generate share image", "error");
      }
    }
  };

  // Share to WhatsApp
  const shareToWhatsApp = () => {
    const frontendURL = import.meta.env.VITE_FRONTEND_URL;
    if (!shareImage) return;

    const text = `🌍 *Globetotter Challenge!* 🌍\n\n${invitingUser?.username}, has challenged you to beat their score of ${score} points in Globetotter! Can you guess the destinations better?\n\n Your username: ${formData?.username} and Your Password: ${formData?.password} \n \nPlay now: ${frontendURL}/welcome/${friendsToken}`;

    try {
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(shareUrl, "_blank");

      showToast("Challenge shared successfully!", "success");
    } catch (error) {
      console.error("Error sharing to WhatsApp:", error);
      showToast("Failed to share challenge", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {step === 1
              ? "Create Username"
              : step === 2
              ? "Set Password"
              : "Share Challenge"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          {step === 1 && (
            <UsernameForm
              username={formData.username}
              onChange={handleChange}
              onSubmit={handleSubmit}
              validation={validation}
            />
          )}

          {step === 2 && (
            <PasswordForm
              password={formData.password}
              onChange={handleChange}
              onSubmit={handleSubmit}
              isCreating={isCreating}
              errorMessage={validation.errorMessage}
            />
          )}

          {step === 3 && (
            <ShareContent
              username={formData.username}
              score={score}
              currentClue={currentClue}
              shareImage={shareImage}
              shareToWhatsApp={shareToWhatsApp}
              ref={shareContentRef}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Username Form Component
const UsernameForm: React.FC<{
  username: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  validation: ValidationState;
}> = ({ username, onChange, onSubmit, validation }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Enter a unique username
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaUser className="text-gray-400" />
          </div>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={onChange}
            className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Username"
            minLength={3}
            required
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {validation.isUsernameChecking && (
              <FaSpinner className="animate-spin text-gray-400" />
            )}
            {validation.isUsernameAvailable &&
              !validation.isUsernameChecking && (
                <div className="text-green-500">✓</div>
              )}
            {!validation.isUsernameAvailable &&
              !validation.isUsernameChecking &&
              username.length >= 3 && <div className="text-red-500">✗</div>}
          </div>
        </div>
        {validation.errorMessage && (
          <p className="text-red-500 text-sm mt-1">{validation.errorMessage}</p>
        )}
        {username.length > 0 && username.length < 3 && (
          <p className="text-yellow-500 text-sm mt-1">
            Username must be at least 3 characters
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={
          !validation.isUsernameAvailable ||
          validation.isUsernameChecking ||
          username.length < 3
        }
        className={`w-full py-2 rounded-md font-medium transition-colors ${
          validation.isUsernameAvailable &&
          !validation.isUsernameChecking &&
          username.length >= 3
            ? "bg-primary text-white hover:bg-primary/90"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </form>
  );
};

// Password Form Component
const PasswordForm: React.FC<{
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isCreating: boolean;
  errorMessage: string;
}> = ({ password, onChange, onSubmit, isCreating, errorMessage }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Create a password for your account
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="text-gray-400" />
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Password"
            minLength={6}
            required
          />
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
        {password.length > 0 && password.length < 6 && (
          <p className="text-yellow-500 text-sm mt-1">
            Password must be at least 6 characters
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isCreating || password.length < 6}
        className={`w-full py-2 rounded-md font-medium transition-colors flex justify-center items-center ${
          password.length >= 6 && !isCreating
            ? "bg-primary text-white hover:bg-primary/90"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isCreating ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

// Share Content Component
// Share Content Component with simplified styling for html2canvas compatibility
const ShareContent = React.forwardRef<
  HTMLDivElement,
  {
    username?: string;
    score?: number;
    currentClue?: string;
    shareImage: string | null;
    shareToWhatsApp: () => void;
  }
>(({ currentClue, shareImage, shareToWhatsApp }, ref) => {
  const { user: invitingUser } = useAuthContext();

  return (
    <div className="space-y-6">
      <div
        ref={ref}
        // Using standard CSS colors that html2canvas can handle
        style={{
          background: "linear-gradient(to right, #4f46e5, #7c3aed)",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Content */}
        <div
          style={{ position: "relative", zIndex: "10", textAlign: "center" }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src="/logo.png"
              alt="Globetotter"
              style={{
                height: "3rem",
                width: "3rem",
                objectFit: "contain",

                filter: "invert(1)",
              }}
            />
          </div>

          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              margin: "0.75rem 0",
            }}
          >
            {invitingUser?.username} has challenged you!
          </h3>

          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "0.5rem",
              padding: "0.75rem",
              margin: "0.75rem 0",
            }}
          >
            <p style={{ fontWeight: "500" }}>Current Score</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {invitingUser?.score} points
            </p>
          </div>

          {currentClue && (
            <div
              style={{
                fontSize: "0.875rem",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                margin: "0.75rem 0",
              }}
            >
              <p style={{ fontWeight: "500", marginBottom: "0.25rem" }}>
                Sample Clue:
              </p>
              <p style={{ fontStyle: "italic" }}>"{currentClue}"</p>
            </div>
          )}

          <p style={{ fontSize: "0.875rem", marginTop: "0.75rem" }}>
            Can you beat their score?
          </p>
        </div>
      </div>

      {shareImage ? (
        <button
          onClick={shareToWhatsApp}
          className="w-full py-3 bg-[#25D366] text-white rounded-md font-medium flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors"
        >
          <FaWhatsapp className="text-xl" />
          Share to WhatsApp
        </button>
      ) : (
        <div className="flex justify-center">
          <FaSpinner className="animate-spin text-primary text-2xl" />
        </div>
      )}

      <p className="text-sm text-center text-gray-500">
        Your friend will be able to see your score and try to beat it!
      </p>
    </div>
  );
});
ShareContent.displayName = "ShareContent";

export default InviteModal;
