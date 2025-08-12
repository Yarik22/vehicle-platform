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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type {
  Vehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
  User,
} from "../types";
import styles from "./VehicleForm.module.css";

const createVehicleSchema = z.object({
  make: z.string().min(1, "Марка обязательна"),
  model: z.string().min(1, "Модель обязательна"),
  year: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (!val || val.toString().trim() === "") return undefined;
      const num = Number(val);
      if (Number.isNaN(num)) return undefined;
      return num;
    })
    .refine(
      (val) =>
        val === undefined ||
        (val >= 1900 && val <= new Date().getFullYear() + 1),
      { message: "Год должен быть от 1900 до текущего года +1" }
    ),
  user_id: z.number().min(1, "Выберите пользователя"),
});

const updateVehicleSchema = createVehicleSchema.partial();

type CreateVehicleFormData = z.infer<typeof createVehicleSchema>;
type UpdateVehicleFormData = z.infer<typeof updateVehicleSchema>;

interface VehicleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVehicleRequest | UpdateVehicleRequest) => void;
  vehicle?: Vehicle;
  users: User[];
  isLoading?: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  open,
  onClose,
  onSubmit,
  vehicle,
  users,
  isLoading = false,
}) => {
  const isEditMode = !!vehicle;
  const schema = isEditMode ? updateVehicleSchema : createVehicleSchema;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateVehicleFormData | UpdateVehicleFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      make: vehicle?.make || "",
      model: vehicle?.model || "",
      year:
        vehicle?.year !== undefined && vehicle?.year !== null
          ? vehicle.year
          : 0,
      user_id: vehicle?.user_id || 0,
    },
  });

  useEffect(() => {
    reset({
      make: vehicle?.make || "",
      model: vehicle?.model || "",
      year:
        vehicle?.year !== undefined && vehicle?.year !== null
          ? vehicle.year
          : 0,
      user_id: vehicle?.user_id || 0,
    });
  }, [vehicle, open, reset]);

  const handleFormSubmit = (
    data: CreateVehicleFormData | UpdateVehicleFormData
  ) => {
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
        {isEditMode
          ? "Редактировать транспортное средство"
          : "Создать транспортное средство"}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent className={styles.dialogContent}>
          <Box className={styles.formContainer}>
            <Controller
              name="make"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Марка"
                  fullWidth
                  error={!!errors.make}
                  helperText={errors.make?.message}
                  required={!isEditMode}
                  className={styles.textField}
                />
              )}
            />
            <Controller
              name="model"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Модель"
                  fullWidth
                  error={!!errors.model}
                  helperText={errors.model?.message}
                  required={!isEditMode}
                  className={styles.textField}
                />
              )}
            />
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Год выпуска"
                  type="number"
                  fullWidth
                  error={!!errors.year}
                  helperText={errors.year?.message}
                  className={styles.textField}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              name="user_id"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.user_id}
                  className={styles.formControl}
                >
                  <InputLabel>Пользователь</InputLabel>
                  <Select
                    {...field}
                    label="Пользователь"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    required={!isEditMode}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.user_id && (
                    <Box
                      sx={{ color: "error.main", fontSize: "0.75rem", mt: 0.5 }}
                    >
                      {errors.user_id.message}
                    </Box>
                  )}
                </FormControl>
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
            {isLoading ? "Сохранение..." : isEditMode ? "Обновить" : "Создать"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VehicleForm;
