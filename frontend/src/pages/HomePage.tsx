import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { People, DirectionsCar, Link } from '@mui/icons-material';
import type { User, Vehicle } from '../types';
import { userService } from '../api/userService';
import { vehicleService } from '../api/vehicleService';
import styles from './HomePage.module.css';

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

const HomePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [usersData, vehiclesData] = await Promise.all([
          userService.getUsers(),
          vehicleService.getVehicles(),
        ]);
        setUsers(usersData);
        setVehicles(vehiclesData);
      } catch (err) {
        // setError('Ошибка при загрузке данных');
        setUsers(MOCK_USERS);
        setVehicles(MOCK_VEHICLES);
        console.warn('API недоступен, используются моковые данные для главной страницы');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserVehicles = (userId: number) => {
    return vehicles.filter(vehicle => vehicle.user_id === userId);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <CircularProgress size={60} thickness={4} />
          <Typography className="loading-text">
            Загрузка данных...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className={styles.container}>
        <Typography variant="h3" component="h1" className={styles.title}>
          Vehicle Service Platform
        </Typography>
        <Typography variant="h6" className={styles.subtitle}>
          Система управления пользователями и их транспортными средствами
        </Typography>

        {error && users.length === 0 && vehicles.length === 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} className={styles.statsGrid}>
          <Grid item xs={12} md={4}>
            <Card className={styles.statCard}>
              <CardContent className={styles.cardContent}>
                <Box className={styles.cardHeader}>
                  <People className={styles.cardIcon} sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" className={styles.cardTitle}>
                    Пользователи
                  </Typography>
                </Box>
                <Typography variant="h4" className={styles.statNumber} sx={{ color: 'primary.main' }}>
                  {users.length}
                </Typography>
                <Typography variant="body2" className={styles.statDescription}>
                  Зарегистрированных пользователей
                </Typography>
              </CardContent>
              <CardActions className={styles.cardActions}>
                <Button size="small" href="/users">
                  Управление пользователями
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className={styles.statCard}>
              <CardContent className={styles.cardContent}>
                <Box className={styles.cardHeader}>
                  <DirectionsCar className={styles.cardIcon} sx={{ color: 'secondary.main' }} />
                  <Typography variant="h6" className={styles.cardTitle}>
                    Транспортные средства
                  </Typography>
                </Box>
                <Typography variant="h4" className={styles.statNumber} sx={{ color: 'secondary.main' }}>
                  {vehicles.length}
                </Typography>
                <Typography variant="body2" className={styles.statDescription}>
                  Зарегистрированных ТС
                </Typography>
              </CardContent>
              <CardActions className={styles.cardActions}>
                <Button size="small" href="/vehicles">
                  Управление ТС
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className={styles.statCard}>
              <CardContent className={styles.cardContent}>
                <Box className={styles.cardHeader}>
                  <Link className={styles.cardIcon} sx={{ color: 'success.main' }} />
                  <Typography variant="h6" className={styles.cardTitle}>
                    Связи
                  </Typography>
                </Box>
                <Typography variant="h4" className={styles.statNumber} sx={{ color: 'success.main' }}>
                  {vehicles.filter(v => v.user_id).length}
                </Typography>
                <Typography variant="body2" className={styles.statDescription}>
                  ТС с привязкой к пользователям
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h5" className={styles.sectionTitle}>
          Пользователи и их транспортные средства
        </Typography>

        <Paper className={styles.tableContainer}>
          <TableContainer>
            <Table className={styles.table}>
              <TableHead className={styles.tableHead}>
                <TableRow>
                  <TableCell className={styles.tableHeadCell}>Пользователь</TableCell>
                  <TableCell className={styles.tableHeadCell}>Email</TableCell>
                  <TableCell className={styles.tableHeadCell}>Количество ТС</TableCell>
                  <TableCell className={styles.tableHeadCell}>Транспортные средства</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => {
                  const userVehicles = getUserVehicles(user.id);
                  return (
                    <TableRow key={user.id} className={styles.tableRow}>
                      <TableCell className={styles.tableBodyCell}>
                        <Typography variant="subtitle2" className={styles.userName}>
                          {user.name || 'Без имени'}
                        </Typography>
                      </TableCell>
                      <TableCell className={styles.tableBodyCell}>{user.email}</TableCell>
                      <TableCell className={styles.tableBodyCell}>
                        <Typography variant="body2" className={styles.vehicleCount}>
                          {userVehicles.length}
                        </Typography>
                      </TableCell>
                      <TableCell className={styles.tableBodyCell}>
                        {userVehicles.length > 0 ? (
                          <Box className={styles.vehicleList}>
                            {userVehicles.map((vehicle, index) => (
                              <Typography key={vehicle.id} variant="body2" className={styles.vehicleItem}>
                                {vehicle.make} {vehicle.model}
                                {vehicle.year && ` (${vehicle.year})`}
                                {index < userVehicles.length - 1 ? ', ' : ''}
                              </Typography>
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" className={styles.noVehicles}>
                            Нет ТС
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

export default HomePage; 