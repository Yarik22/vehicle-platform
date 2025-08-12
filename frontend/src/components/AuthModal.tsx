import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const { login, continueAsGuest } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Введите email и пароль");
      return;
    }
    try {
      await login({ email, password });
      onClose();
    } catch (err) {
      console.error(err);
      setError("Неверный email или пароль");
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    onClose();
  };

  return (
    <Dialog open={open} disableEscapeKeyDown>
      <DialogTitle>Авторизация</DialogTitle>
      <DialogContent>
        <Typography>Пожалуйста, войдите или продолжите как гость</Typography>
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Пароль"
          type="password"
          fullWidth
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleGuest}>Продолжить как гость</Button>
        <Button onClick={handleLogin} variant="contained">
          Войти
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthModal;
