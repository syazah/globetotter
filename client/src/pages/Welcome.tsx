import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import axios from "../utils/axios.config";
import Loading from "./Loading";

function Welcome() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { validateAndLoadUser } = useAuthContext();

  useEffect(() => {
    const handleInvitation = async () => {
      if (token) {
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          await validateAndLoadUser();
          // Add delay to show the score
          setTimeout(() => {
            navigate("/play");
          }, 3000);
        } catch (error) {
          console.error("Error validating invitation:", error);
          navigate("/signin");
        }
      } else {
        navigate("/signin");
      }
    };

    handleInvitation();
  }, [token, navigate, validateAndLoadUser]);

  return (
    <div className="h-screen bg-gradient-to-br from-primary to-primary/60 flex flex-col items-center justify-center p-4">
      <Loading />
    </div>
  );
}

export default Welcome;
