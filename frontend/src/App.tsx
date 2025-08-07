import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import VehiclesPage from './pages/VehiclesPage';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Router>
          <Navigation />
          <main className="main-content">
            <div className="page-wrapper">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
              </Routes>
            </div>
          </main>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
