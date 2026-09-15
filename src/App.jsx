import { Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUpPage";
import AppHeader from "./components/AppHeader";
import { useContext } from "react";
import { AuthContext } from "./context/auth.context";
import MainMenuContent from "./components/MainMenuContent";
import PageLayout from "./components/PageLayout";
import SprintsPage from "./pages/SprintsPage";
import SprintDetailsPage from "./pages/SprintDetailsPage";
import AddEditSprintPage from "./pages/AddEditSprintPage";

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
            <main className="flex flex-1 justify-around bg-background">
              <Routes>
                <Route
                  path="/"
                  element={
                    <PageLayout pageTitle="Dashboard">
                      <DashboardPage />
                    </PageLayout>
                  }
                />
                <Route
                  path="/sprints"
                  element={
                    <PageLayout pageTitle="Sprints">
                      <SprintsPage />
                    </PageLayout>
                  }
                />
                <Route
                  path="/sprints/:sprintId"
                  element={
                    <PageLayout>
                      <SprintDetailsPage />
                    </PageLayout>
                  }
                />
                <Route
                  path="/sprints/add"
                  element={
                    <PageLayout>
                      <AddEditSprintPage mode="create" />
                    </PageLayout>
                  }
                />
                <Route
                  path="/sprints/:sprintId/edit"
                  element={
                    <PageLayout>
                      <AddEditSprintPage mode="edit" />
                    </PageLayout>
                  }
                />
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
