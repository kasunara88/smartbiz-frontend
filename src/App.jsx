import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import MainLayout from "./features/MainLayout";
import DashboardPage from "./features/dashboard/DashboardPage";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    secondary: { main: "#f48fb1" },
    background: { default: "#0f172a", paper: "#1e293b" },
  },
});

const ProtectedLayout = (isAuthenticated, onLogout) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout onLogout={onLogout}>
      <Outlet />
    </MainLayout>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem("token", "your_token_here");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <LoginPage onLoginSuccess={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
            }
          />
          <Route
            element={
              <ProtectedLayout
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
              />
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    // <>
    //   <MainLayout />
    // </>
  );
}

export default App;
