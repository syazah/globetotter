import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { BiPlay } from "react-icons/bi";
import axios from "../utils/axios.config";
import { AxiosError } from "axios";
import { TiTick } from "react-icons/ti";

function Auth() {
  const navigate = useNavigate();
  const { user, loginWithCredentials, registerUser } = useAuthContext();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<
    "available" | "taken" | "checking" | ""
  >("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  async function handleCheckUsername() {
    if (formData.username.length < 4) return;

    setUsernameStatus("checking");
    const startTime = Date.now();

    try {
      const response = await axios.get(
        `/api/user/username/${formData.username}`
      );
      if (response.data.success) {
        setIsLoginMode(true);
        setUsernameStatus("taken");
      } else {
        setIsLoginMode(false);
        setUsernameStatus("available");
      }
    } catch (error) {
      console.log(error);
      setUsernameStatus("");
      showToast("Failed to check username", "error");
    } finally {
      // Ensure spinner shows for at least 800ms
      const elapsed = Date.now() - startTime;
      const minDisplay = 800;

      if (elapsed < minDisplay) {
        setTimeout(() => {
          setUsernameStatus((prev) =>
            prev === "checking" ? (isLoginMode ? "taken" : "available") : prev
          );
        }, minDisplay - elapsed);
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ username: "", password: "" });

    // Form validation
    let hasError = false;
    if (!formData.username) {
      setErrors((prev) => ({ ...prev, username: "Username is required" }));
      hasError = true;
    }

    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      hasError = true;
    } else if (formData.password.length < 6 && !isLoginMode) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);

    try {
      if (isLoginMode) {
        // Login logic
        await loginWithCredentials(formData.username, formData.password);
        showToast("Login successful!", "success");
        navigate("/dashboard");
      } else {
        // Registration logic
        await registerUser(formData.username, formData.password);
        showToast("Account created successfully!", "success");
        navigate("/dashboard");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast(error.response?.data.error || "An error occurred", "error");
      } else {
        showToast(
          isLoginMode ? "Login failed" : "Failed to create account",
          "error"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log(user);
    if (user && user.id) {
      navigate("/play");
    } else {
      setIsLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (formData?.username?.length > 3) {
        handleCheckUsername();
      } else {
        setUsernameStatus("");
      }
    }, 800); // Reduced delay for better responsiveness

    return () => clearTimeout(timeout);
  }, [formData?.username]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full md:h-screen flex gap-4 md:gap-0 md:flex-row flex-col justify-start items-center overflow-hidden">
      <div className="md:w-1/2 h-screen flex flex-col justify-center items-center">
        <img src="/logo.png" className="w-12" alt="Logo" />
        <h1 className="text-4xl">Globetotter</h1>
        <p className="text-base mt-2 text-center text-zinc-600">
          The world is full of wonders. Can you guess them all?
        </p>
        <form onSubmit={handleSubmit} className="md:w-1/2 flex flex-col">
          <div className="relative w-full flex justify-center items-center">
            <input
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value.trim() })
              }
              placeholder="Enter your username"
              className={`w-full rounded-sm mt-6 p-2 border-[2px] ${
                errors.username
                  ? "border-red-500"
                  : usernameStatus === "available"
                  ? "border-green-500"
                  : "border-primary"
              }`}
            />
            {usernameStatus === "checking" && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/4">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
            {usernameStatus === "available" && !isLoginMode && (
              <div className="absolute right-3 top-[55%] transform -translate-y-1/4 text-green-500">
                <TiTick className="text-green-500" />
              </div>
            )}
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username}</p>
            )}
          </div>

          <div className="relative w-full">
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password"
              className={`w-full rounded-sm mt-2 p-2 border-[2px] ${
                errors.password ? "border-red-500" : "border-primary"
              }`}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-2 bg-primary flex gap-2 cursor-pointer hover:brightness-90 justify-center items-center rounded-sm mt-4 border-[2px] border-secondary disabled:opacity-50"
          >
            <span className="text-background text-lg font-normal">
              {isSubmitting
                ? isLoginMode
                  ? "Logging in..."
                  : "Signing up..."
                : isLoginMode
                ? "Log In"
                : "Sign Up"}
            </span>
            {!isSubmitting && <BiPlay className="text-2xl text-white" />}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-zinc-600">
              {isLoginMode
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-primary font-medium hover:underline"
              >
                {isLoginMode ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>
        </form>
      </div>
      <div className="w-1/2 md:flex hidden  bg-[url('https://cdn.pixabay.com/photo/2020/06/03/15/20/balloon-5255326_1280.jpg')] bg-cover bg-right h-screen"></div>
    </div>
  );
}

export default Auth;
