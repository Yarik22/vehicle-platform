import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { userService } from "../api/userService";

interface AuthContextType {
  isLoggedIn: boolean;
  user: { name?: string; email: string } | null;
  isGuest: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return false;
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    if (!payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{ name?: string; email: string } | null>(
    null
  );
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && isTokenValid(token)) {
      if (userData) {
        setUser(JSON.parse(userData));
        setIsGuest(false);
      } else {
        setUser(null);
        setIsGuest(false);
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsGuest(false);
    }

    setLoading(false);
  }, []);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { token, user } = await userService.login(email, password);

    setUser(user);
    setIsGuest(false);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const continueAsGuest = () => {
    setUser(null);
    setIsGuest(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        user,
        isGuest,
        loading,
        login,
        logout,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
