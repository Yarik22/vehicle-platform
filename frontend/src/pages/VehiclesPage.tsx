import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { vehicleService } from "../api/vehicleService";
import { userService } from "../api/userService";
import VehicleForm from "../components/VehicleForm";
import type {
  Vehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
  User,
} from "../types";
import styles from "./VehiclesPage.module.css";

interface VehiclesPageProps {
  isGuest: boolean;
}

const VehiclesPage: React.FC<VehiclesPageProps> = ({ isGuest }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const storedUserJson = localStorage.getItem("user");
  const currentUser: User = storedUserJson ? JSON.parse(storedUserJson) : null;
  const currentUserEmail = currentUser?.email || "";
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "";

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleService.getVehicles();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Ошибка при загрузке автомобилей");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      const data = await userService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setUsersError("Ошибка при загрузке пользователей");
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchUsers();
  }, []);

  const handleCreateVehicle = async (vehicleData: CreateVehicleRequest) => {
    try {
      setSubmitting(true);
      await vehicleService.createVehicle(vehicleData);
      setFormOpen(false);
      fetchVehicles();
    } catch (err) {
      setError("Ошибка при создании автомобиля");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateVehicle = async (vehicleData: UpdateVehicleRequest) => {
    if (!editingVehicle) return;
    try {
      setSubmitting(true);
      await vehicleService.updateVehicle(editingVehicle.id, vehicleData);
      setFormOpen(false);
      setEditingVehicle(null);
      fetchVehicles();
    } catch (err) {
      setError("Ошибка при обновлении автомобиля");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;
    try {
      setSubmitting(true);
      await vehicleService.deleteVehicle(vehicleToDelete.id);
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
      fetchVehicles();
    } catch (err) {
      setError("Ошибка при удалении автомобиля");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || usersLoading) {
    return (
      <div className="loading-container">
        <CircularProgress size={60} />
        <Typography>Загрузка данных...</Typography>
      </div>
    );
  }

  const canEditOrDelete = (id: number): boolean => {
    if (!currentUser) return false;
    if (currentUserEmail === adminEmail) return true;
    if (isGuest) {
      return false;
    }
    return currentUser.id === id;
  };

  const canAddVehicle = (): boolean => {
    if (!currentUser) return false;
    if (currentUserEmail === adminEmail) return true;
    if (isGuest) {
      return false;
    }
    return false;
  };

  return (
    <div className="content-wrapper">
      <div className={styles.container}>
        <Box className={styles.header}>
          <Typography variant="h4" component="h1" className={styles.title}>
            Автомобили
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
            disabled={!canAddVehicle()}
          >
            Добавить автомобиль
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {usersError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {usersError}
          </Alert>
        )}

        <Paper className={styles.tableContainer}>
          <TableContainer>
            <Table className={styles.table}>
              <TableHead className={styles.tableHead}>
                <TableRow>
                  <TableCell className={styles.tableHeadCell}>ID</TableCell>
                  <TableCell className={styles.tableHeadCell}>Марка</TableCell>
                  <TableCell className={styles.tableHeadCell}>Модель</TableCell>
                  <TableCell className={styles.tableHeadCell}>Год</TableCell>
                  <TableCell className={styles.tableHeadCell}>
                    Действия
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(vehicles || []).map((vehicle) => {
                  const disabled = !canEditOrDelete(vehicle.user_id);
                  return (
                    <TableRow key={vehicle.id} className={styles.tableRow}>
                      <TableCell
                        className={`${styles.tableBodyCell} ${styles.idCell}`}
                      >
                        {vehicle.id}
                      </TableCell>
                      <TableCell className={styles.tableBodyCell}>
                        {vehicle.make}
                      </TableCell>
                      <TableCell className={styles.tableBodyCell}>
                        {vehicle.model}
                      </TableCell>
                      <TableCell className={styles.tableBodyCell}>
                        {vehicle.year}
                      </TableCell>
                      <TableCell
                        className={`${styles.tableBodyCell} ${styles.actionsCell}`}
                      >
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setEditingVehicle(vehicle);
                            setFormOpen(true);
                          }}
                          disabled={disabled}
                          className={`${styles.actionButton} ${styles.editButton}`}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setVehicleToDelete(vehicle);
                            setDeleteDialogOpen(true);
                          }}
                          disabled={disabled}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <VehicleForm
          users={users}
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingVehicle(null);
          }}
          onSubmit={
            editingVehicle
              ? (handleUpdateVehicle as any)
              : (handleCreateVehicle as any)
          }
          vehicle={editingVehicle || undefined}
          isLoading={submitting}
        />

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Подтверждение удаления</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить автомобиль {vehicleToDelete?.make}{" "}
              {vehicleToDelete?.model}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              disabled={submitting}
            >
              Отмена
            </Button>
            <Button
              onClick={handleDeleteVehicle}
              color="error"
              disabled={submitting}
            >
              {submitting ? "Удаление..." : "Удалить"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default VehiclesPage;
