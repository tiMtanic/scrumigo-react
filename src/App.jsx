import { Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/auth/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import AppHeader from "./components/AppHeader";
import { useContext } from "react";
import { AuthContext } from "./context/auth.context";
import MainMenuContent from "./components/MainMenuContent";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
  } else {
    return (
      <>
        <div className="flex h-full flex-col">
          <AppHeader />
          <div className="flex flex-1">
            <div className="hidden md:block w-3xs border-r">
              <nav className="flex flex-col gap-1 p-2">
                <MainMenuContent />
              </nav>
            </div>
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </>
    );
  }
}

export default App;
