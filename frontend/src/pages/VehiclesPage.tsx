import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import type { Vehicle, CreateVehicleRequest, UpdateVehicleRequest, User } from '../types';
import { vehicleService } from '../api/vehicleService';
import { userService } from '../api/userService';
import VehicleForm from '../components/VehicleForm';
import styles from './VehiclesPage.module.css';

const MOCK_USERS: User[] = [
  { id: 1, email: 'john@example.com', name: 'Джон', phone: '+79990001122' },
  { id: 2, email: 'jane@example.com', name: 'Джейн', phone: '+79990002233' },
  { id: 3, email: 'ivan@example.com', name: 'Иван', phone: '+79990003344' },
];

const MOCK_VEHICLES: Vehicle[] = [
  { id: 1, make: 'Toyota', model: 'Camry', year: 2018, user_id: 1 },
  { id: 2, make: 'Lada', model: 'Vesta', year: 2020, user_id: 3 },
  { id: 3, make: 'Ford', model: 'Focus', year: 2015, user_id: 2 },
  { id: 4, make: 'Unknown', model: 'Unknown', year: undefined, user_id: 2 },
];

const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (err) {
      // setError('Ошибка при загрузке транспортных средств');
      setVehicles(MOCK_VEHICLES);
      console.warn('API недоступен, используются моковые данные ТС');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setUsers(MOCK_USERS);
      console.warn('API недоступен, используются моковые данные пользователей');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchVehicles(), fetchUsers()]);
    };
    loadData();
  }, []);

  const handleCreateVehicle = async (vehicleData: CreateVehicleRequest) => {
    try {
      setSubmitting(true);
      await vehicleService.createVehicle(vehicleData);
      setFormOpen(false);
      fetchVehicles();
    } catch (err) {
      setError('Ошибка при создании транспортного средства');
      console.error('Error creating vehicle:', err);
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
      setError('Ошибка при обновлении транспортного средства');
      console.error('Error updating vehicle:', err);
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
      setError('Ошибка при удалении транспортного средства');
      console.error('Error deleting vehicle:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormOpen(true);
  };

  const handleDelete = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingVehicle(null);
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? (user.name || user.email) : `ID: ${userId}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <CircularProgress size={60} thickness={4} />
          <Typography className="loading-text">
            Загрузка транспортных средств...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className={styles.container}>
        <Box className={styles.header}>
          <Typography variant="h4" component="h1" className={styles.title}>
            Транспортные средства
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
            className={styles.addButton}
          >
            Добавить транспортное средство
          </Button>
        </Box>

        {error && vehicles.length === 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
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
                  <TableCell className={styles.tableHeadCell}>Пользователь</TableCell>
                  <TableCell className={styles.tableHeadCell}>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id} className={styles.tableRow}>
                    <TableCell className={`${styles.tableBodyCell} ${styles.idCell}`}>{vehicle.id}</TableCell>
                    <TableCell className={`${styles.tableBodyCell} ${styles.makeCell}`}>{vehicle.make}</TableCell>
                    <TableCell className={`${styles.tableBodyCell} ${styles.modelCell}`}>{vehicle.model}</TableCell>
                    <TableCell className={`${styles.tableBodyCell} ${styles.yearCell}`}>{vehicle.year || '-'}</TableCell>
                    <TableCell className={`${styles.tableBodyCell} ${styles.userCell}`}>{getUserName(vehicle.user_id)}</TableCell>
                    <TableCell className={`${styles.tableBodyCell} ${styles.actionsCell}`}>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(vehicle)}
                        size="small"
                        className={`${styles.actionButton} ${styles.editButton}`}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(vehicle)}
                        size="small"
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <VehicleForm
          open={formOpen}
          onClose={handleFormClose}
          onSubmit={editingVehicle ? (handleUpdateVehicle as any) : (handleCreateVehicle as any)}
          vehicle={editingVehicle || undefined}
          users={users}
          isLoading={submitting}
        />

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Подтверждение удаления</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить транспортное средство "{vehicleToDelete?.make} {vehicleToDelete?.model}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={submitting}>
              Отмена
            </Button>
            <Button onClick={handleDeleteVehicle} color="error" disabled={submitting}>
              {submitting ? 'Удаление...' : 'Удалить'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default VehiclesPage; 