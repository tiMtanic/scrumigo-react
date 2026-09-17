import { createContext, useEffect, useState } from "react";
import { verifyAsync } from "../services/scrumigoApi.service.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthWrapper({ children }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [isVerifyingUser, setIsVerifyingUser] = useState(true);

  useEffect(() => {
    verifyUser();
  }, []);

  const setUserVariables = async (authToken, payload) => {
    localStorage.setItem("authToken", authToken);
    setIsLoggedIn(true);
    setUserId(payload._id);
    setName(payload.name ?? "");
    setSurname(payload.surname ?? "");
  };

  const verifyUser = async () => {
    try {
      const result = await verifyAsync();
      setIsLoggedIn(true);
      setUserId(result.payload._id);
      setName(payload.name ?? "");
      setSurname(payload.surname ?? "");
    } catch (error) {
      setIsLoggedIn(false);
      setUserId(null);
      setName("");
      setSurname("");
      navigate("/login");
    } finally {
      setIsVerifyingUser(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUserId(null);
    setName("");
    setSurname("");
    navigate("/login");
  };

  const passedContext = {
    setUserVariables,
    isLoggedIn,
    userId,
    name,
    surname,
    verifyUser,
    logout,
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
