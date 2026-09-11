import { createContext, useEffect, useState } from "react";
import scrumigoApiService from "../services/scrumigoApi.service.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthWrapper({ children }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isVerifyingUser, setIsVerifyingUser] = useState(true);

  useEffect(() => {
    verifyUser();
  }, []);

  const setUserVariables = (authToken, payload) => {
    localStorage.setItem("authToken", authToken);
    setIsLoggedIn(true);
    setUserId(payload._id);
  };

  const verifyUser = async () => {
    try {
      const response = await scrumigoApiService.get("/auth/verify");
      setIsLoggedIn(true);
      setUserId(response.data.payload._id);
    } catch (error) {
      setIsLoggedIn(false);
      setUserId(null);
      navigate("/login");
    } finally {
      setIsVerifyingUser(false);
    }
  };

  const passedContext = {
    setUserVariables,
    isLoggedIn,
    userId,
    verifyUser,
  };

  if (isVerifyingUser) {
    return <h3>Verifying User Credentials...</h3>;
  }

  return (
    <AuthContext.Provider value={passedContext}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthWrapper };
