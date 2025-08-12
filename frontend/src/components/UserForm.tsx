import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import type { User, CreateUserRequest, UpdateUserRequest } from "../types";
import styles from "./UserForm.module.css";

const createUserSchema = z.object({
  email: z.string().email("Введите корректный email"),
  name: z.string().min(2, "Имя должно содержать минимум 2 символа").optional(),
  password: z.string().min(6, "Пароль должен быть минимум 6 символов"),
});

const updateUserSchema = z.object({
  email: z.string().email("Введите корректный email").optional(),
  name: z.string().min(2, "Имя должно содержать минимум 2 символа").optional(),
  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 6,
      "Пароль должен быть минимум 6 символов"
    ),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateUserRequest | (UpdateUserRequest & { password?: string })
  ) => void;
  user?: User;
  users: User[];
  isLoading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  open,
  onClose,
  onSubmit,
  user,
  users,
  isLoading = false,
}) => {
  const isEditMode = !!user;
  const schema = isEditMode ? updateUserSchema : createUserSchema;

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email || "",
      name: user?.name || "",
      password: "",
    },
  });

  useEffect(() => {
    reset({
      email: user?.email || "",
      name: user?.name || "",
      password: "",
    });
  }, [user, open, reset]);

  const handleFormSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
    if (data.email) {
      const emailExists = users.some(
        (u) => u.email === data.email && (!user || u.id !== user.id)
      );
      if (emailExists) {
        setError("email", {
          type: "manual",
          message: "Этот email уже используется",
        });
        return;
      }
    }

    onSubmit(data);
    if (!isEditMode) {
      reset();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      className={styles.dialog}
    >
      <DialogTitle className={styles.dialogTitle}>
        {isEditMode ? "Редактировать пользователя" : "Создать пользователя"}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent className={styles.dialogContent}>
          <Box className={styles.formContainer}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  required={!isEditMode}
                  className={styles.textField}
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Имя"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  className={styles.textField}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={
                    isEditMode
                      ? "Новый пароль (оставьте пустым для сохранения текущего)"
                      : "Пароль"
                  }
                  type="password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  required={!isEditMode}
                  className={styles.textField}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            variant="outlined"
            color="secondary"
            className={styles.cancelButton}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading
              ? isEditMode
                ? "Обновление..."
                : "Сохранение..."
              : isEditMode
              ? "Обновить"
              : "Создать"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm;
