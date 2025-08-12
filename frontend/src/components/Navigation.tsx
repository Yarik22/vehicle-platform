import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { People, DirectionsCar, Home } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import styles from "./Navigation.module.css";
import AuthModal from "./AuthModal";

const ANIMATION_DURATION = 200;

const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuPointer, setMobileMenuPointer] = useState(false);

  const { isLoggedIn, logout } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (mobileMenuOpen) {
      setMobileMenuPointer(true);
    } else {
      timeout = setTimeout(
        () => setMobileMenuPointer(false),
        ANIMATION_DURATION
      );
    }
    return () => clearTimeout(timeout);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        mobileMenuOpen &&
        !target.closest(".mobile-nav-toggle") &&
        !target.closest(".mobile-nav-menu")
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 600 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  const navItems = [
    { to: "/", label: "Главная", icon: <Home /> },
    { to: "/users", label: "Пользователи", icon: <People /> },
    {
      to: "/vehicles",
      label: "Транспортные средства",
      icon: <DirectionsCar />,
    },
  ];

  return (
    <>
      <AppBar position="static" className={styles.navbar}>
        <Toolbar className={styles.toolbar}>
          <Typography variant="h6" component="div" className={styles.title}>
            Vehicle Service Platform
          </Typography>

          <Box className={`${styles.navButtons} desktop-nav`}>
            {navItems.map((item) => (
              <Button
                key={item.to}
                color="inherit"
                component={RouterLink}
                to={item.to}
                startIcon={item.icon}
                className={styles.navButton}
              >
                {item.label}
              </Button>
            ))}

            {isLoggedIn ? (
              <Button
                color="inherit"
                onClick={logout}
                className={styles.navButton}
                sx={{ ml: 2 }}
              >
                Выйти
              </Button>
            ) : (
              <Button
                color="inherit"
                onClick={() => setAuthModalOpen(true)}
                className={styles.navButton}
                sx={{ ml: 2 }}
              >
                Войти
              </Button>
            )}
          </Box>
          <button
            className={`mobile-nav-toggle ${mobileMenuOpen ? "active" : ""}`}
            onClick={handleMobileMenuToggle}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </button>
        </Toolbar>
        <div
          className={`mobile-nav-menu${mobileMenuOpen ? " active" : ""}${
            mobileMenuPointer ? " pointer" : ""
          }`}
        >
          {navItems.map((item) => (
            <RouterLink
              key={item.to}
              to={item.to}
              className="mobile-nav-item"
              onClick={handleMobileMenuClose}
            >
              {item.label}
            </RouterLink>
          ))}

          {isLoggedIn ? (
            <Button
              color="inherit"
              onClick={logout}
              className={`${styles.navButton} ${styles.loginLogout}`}
              sx={{ ml: 2 }}
            >
              Выйти
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={() => setAuthModalOpen(true)}
              className={`${styles.navButton} ${styles.loginLogout}`}
              sx={{ ml: 2 }}
            >
              Войти
            </Button>
          )}
        </div>
      </AppBar>
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default Navigation;
