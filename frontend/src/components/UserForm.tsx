import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types';
import styles from './UserForm.module.css';

// Схема валидации для создания пользователя
const createUserSchema = z.object({
  email: z.string().email('Введите корректный email'),
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа').optional(),
  phone: z.string().optional(),
});

// Схема валидации для обновления пользователя
const updateUserSchema = z.object({
  email: z.string().email('Введите корректный email').optional(),
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа').optional(),
  phone: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => void;
  user?: User;
  isLoading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  open,
  onClose,
  onSubmit,
  user,
  isLoading = false,
}) => {
  const isEditMode = !!user;
  const schema = isEditMode ? updateUserSchema : createUserSchema;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: user
      ? {
          email: user.email,
          name: user.name || '',
          phone: user.phone || '',
        }
      : {
          email: '',
          name: '',
          phone: '',
        },
  });

  const handleFormSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth className={styles.dialog}>
      <DialogTitle className={styles.dialogTitle}>
        {isEditMode ? 'Редактировать пользователя' : 'Создать пользователя'}
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
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Телефон"
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  className={styles.textField}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={handleClose} disabled={isLoading} variant="outlined" color="secondary" className={styles.cancelButton}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? 'Сохранение...' : isEditMode ? 'Обновить' : 'Создать'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm; 