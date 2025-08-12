import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import UsersPage from "./pages/UsersPage";
import VehiclesPage from "./pages/VehiclesPage";
import AuthModal from "./components/AuthModal";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
  typography: { fontFamily: "Roboto, Arial, sans-serif" },
});

const AppContent: React.FC = () => {
  const { isGuest, isLoggedIn, loading } = useAuth();
  const [authOpen, setAuthOpen] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !isLoggedIn && !isGuest) {
      setAuthOpen(true);
    } else {
      setAuthOpen(false);
    }
  }, [loading, isLoggedIn, isGuest]);

  return (
    <>
      <Navigation />
      <main className="main-content">
        <div className="page-wrapper">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={<UsersPage isGuest={isGuest} />} />
            <Route
              path="/vehicles"
              element={<VehiclesPage isGuest={isGuest} />}
            />
          </Routes>
        </div>
      </main>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Router>
            <AppContent />
          </Router>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
