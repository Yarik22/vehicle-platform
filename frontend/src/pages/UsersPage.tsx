import React, { useState, useEffect } from "react";
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
import type { User, CreateUserRequest, UpdateUserRequest } from "../types";
import { userService } from "../api/userService";
import UserForm from "../components/UserForm";
import styles from "./UsersPage.module.css";

interface UsersPageProps {
  isGuest: boolean;
}

const UsersPage: React.FC<UsersPageProps> = ({ isGuest }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const storedUserJson = localStorage.getItem("user");
  const currentUser: User = storedUserJson ? JSON.parse(storedUserJson) : null;
  const currentUserEmail = currentUser?.email || "";
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && Array.isArray((data as any).users)) {
        setUsers((data as any).users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      setError("Ошибка при загрузке пользователей");
      setUsers([]);
      console.error("API недоступен:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (userData: CreateUserRequest) => {
    try {
      setSubmitting(true);
      await userService.createUser(userData);
      setFormOpen(false);
      fetchUsers();
    } catch (err) {
      setError("Ошибка при создании пользователя");
      console.error("Error creating user:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async (userData: UpdateUserRequest) => {
    if (!editingUser) return;
    try {
      setSubmitting(true);
      await userService.updateUser(editingUser.id, userData);
      setFormOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError("Ошибка при обновлении пользователя");
      console.error("Error updating user:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setSubmitting(true);
      await userService.deleteUser(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      setError("Ошибка при удалении пользователя");
      console.error("Error deleting user:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingUser(null);
  };

  const canEditOrDelete = (userEmail: string): boolean => {
    if (!currentUser) return false;
    if (currentUserEmail === adminEmail) return true;
    if (isGuest) {
      return false;
    }
    return currentUser.email === userEmail;
  };

  const canAddUser = (): boolean => {
    if (!currentUser) return false;
    if (currentUserEmail === adminEmail) return true;
    if (isGuest) {
      return false;
    }
    return false;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <CircularProgress size={60} thickness={4} />
          <Typography className="loading-text">
            Загрузка пользователей...
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
            Пользователи
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
            className={styles.addButton}
            disabled={!canAddUser()}
          >
            Добавить пользователя
          </Button>
        </Box>

        {error && users.length === 0 && (
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
                  <TableCell className={styles.tableHeadCell}>Email</TableCell>
                  <TableCell className={styles.tableHeadCell}>Имя</TableCell>
                  <TableCell className={styles.tableHeadCell}>
                    Действия
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(users || []).map((user) => {
                  const disabled = !canEditOrDelete(user.email);
                  return (
                    <TableRow key={user.id} className={styles.tableRow}>
                      <TableCell
                        className={`${styles.tableBodyCell} ${styles.idCell}`}
                      >
                        {user.id}
                      </TableCell>
                      <TableCell
                        className={`${styles.tableBodyCell} ${styles.emailCell}`}
                      >
                        {user.email}
                      </TableCell>
                      <TableCell
                        className={`${styles.tableBodyCell} ${styles.nameCell}`}
                      >
                        {user.name || "-"}
                      </TableCell>
                      <TableCell
                        className={`${styles.tableBodyCell} ${styles.actionsCell}`}
                      >
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(user)}
                          size="small"
                          disabled={disabled}
                          className={`${styles.actionButton} ${styles.editButton}`}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(user)}
                          size="small"
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

        <UserForm
          open={formOpen}
          onClose={handleFormClose}
          onSubmit={
            editingUser ? (handleUpdateUser as any) : (handleCreateUser as any)
          }
          users={users}
          user={editingUser || undefined}
          isLoading={submitting}
        />

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Подтверждение удаления</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить пользователя "
              {userToDelete?.name || userToDelete?.email}"?
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
              onClick={handleDeleteUser}
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

export default UsersPage;
