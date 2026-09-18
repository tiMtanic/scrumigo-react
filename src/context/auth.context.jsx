import { createContext, useEffect, useState } from "react";
import { verifyAsync } from "../services/scrumigoApi.service.js";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@heroui/react";

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
      setName(result.payload.name ?? "");
      setSurname(result.payload.surname ?? "");
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
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-muted">Verifying User Credentials</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={passedContext}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthWrapper };
