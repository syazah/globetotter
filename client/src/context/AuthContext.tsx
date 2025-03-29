import axios from "../utils/axios.config";
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { useToast } from "./ToastContext";
import { AxiosError } from "axios";

export interface User {
  username: string;
  id: string;
  score: number;
}

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loginWithCredentials: (
    username: string,
    password: string
  ) => Promise<boolean>;
  registerUser: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  validateAndLoadUser: () => Promise<void>;
  registerFriend: (username: string, password: string) => Promise<string>;
}
interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const { showToast } = useToast();
  //SIGN IN USER
  async function loginWithCredentials(username: string, password: string) {
    try {
      const res = await axios.post("/api/user/signin", { username, password });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;
        localStorage.setItem("token", res.data.token);
        return true;
      } else {
        showToast(res.data.error, "error");
        return false;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          showToast(error.response.data.error, "error");
        } else {
          showToast(error.message, "error");
        }
      } else {
        showToast("Failed to sign in", "error");
      }
      return false;
    }
  }
  //SIGN UP USER
  async function registerUser(username: string, password: string) {
    try {
      const res = await axios.post("/api/user/signup", { username, password });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;
        return true;
      } else {
        showToast(res.data.error, "error");
        return false;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          showToast(error.response.data.error, "error");
        } else {
          showToast(error.message, "error");
        }
      } else {
        showToast("Failed to sign in", "error");
      }
      return false;
    }
  }

  //REGISTER A FRIEND
  async function registerFriend(username: string, password: string) {
    try {
      const res = await axios.post("/api/user/signup", { username, password });
      if (res.data.success) {
        showToast("Friend added", "success");
        return res.data.token;
      } else {
        showToast(res.data.error, "error");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          showToast(error.response.data.error, "error");
        } else {
          showToast(error.message, "error");
        }
      } else {
        showToast("Failed to sign in", "error");
      }
      return false;
    }
  }

  // LOGOUT USER
  function logout() {
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    // Optional: redirect
    window.location.href = "/signin";
  }

  //GETTING TOKEN
  async function validateAndLoadUser() {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await axios.get("/api/user/validate");
        if (!response.data.success) {
          localStorage.removeItem("token");
          showToast(response.data.error, "error");
          delete axios.defaults.headers.common["Authorization"];
        } else {
          setUser(response.data.user);
        }
      } catch (error) {
        console.log(error);
        showToast("Failed to load user", "error");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      }
    }
  }

  useEffect(() => {
    validateAndLoadUser();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginWithCredentials,
        registerUser,
        logout,
        registerFriend,
        validateAndLoadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthContextProvider");
  }
  return context;
};
export default AuthContextProvider;
