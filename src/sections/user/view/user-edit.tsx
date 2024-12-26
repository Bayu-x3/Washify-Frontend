import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import endpoints from 'src/contants/apiEndpoint';
import { DashboardContent } from 'src/layouts/dashboard';

interface Outlet {
  id: number;
  nama: string;
  alamat?: string;
  tlp?: string;
}

export function UserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State untuk Snackbar (toast notifications)
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchOutlets = async () => {
      try {
        const response = await fetch(endpoints.outlets, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok && result.success) {
          setOutlets(result.data);
        } else {
          console.error('Failed to fetch outlets:', result.message);
        }
      } catch (err) {
        console.error('Error fetching outlets:', err);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch(`${endpoints.users}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok && result.success) {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const { nama, username, role, id_outlet } = result.data;
          setNama(nama);
          setUsername(username);
          setRole(role);
          setSelectedOutlet(id_outlet);
        } else {
          console.error('Failed to fetch user:', result.message);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchOutlets();
    fetchUser();
  }, [id, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
  
    const token = localStorage.getItem('access_token');
  
    const payload = password
      ? { nama, username, role, id_outlet: selectedOutlet, password }
      : { nama, username, role, id_outlet: selectedOutlet };
  
    try {
      const response = await fetch(`${endpoints.users}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok && result.success) {
        setToastMessage('User updated successfully!');
        setToastSeverity('success');
      } else {
        setToastMessage(result.message || 'Failed to update user.');
        setToastSeverity('error');
      }
    } catch (err) {
      setToastMessage('An error occurred. Please try again.');
      setToastSeverity('error');
    } finally {
      setToastOpen(true);
      setIsLoading(false);
    }
  };
  

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  return (
    <DashboardContent>
      <Box display="flex" flexDirection="column" mb={5}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Link>
          <Link color="inherit" onClick={() => navigate('/user')}>
            Users
          </Link>
          <Typography color="textPrimary">Edit User</Typography>
        </Breadcrumbs>

        <Typography variant="h4" sx={{ mt: 2 }}>Edit User</Typography>
      </Box>

      <Card sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            select
            fullWidth
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{ mb: 3 }}
            required
          >
            <MenuItem value="owner">Owner</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="kasir">Kasir</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            label="Outlet"
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            sx={{ mb: 3 }}
          >
            {outlets.map((outlet) => (
              <MenuItem key={outlet.id} value={outlet.id}>
                {outlet.nama}
              </MenuItem>
            ))}
          </TextField>
          <TextField
           fullWidth
           label="Password"
           type="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           sx={{ mb: 3 }}
           helperText="Kosongkan jika tidak ingin mengubah password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Updating...' : 'Update User'}
          </Button>
        </form>
      </Card>

      <Snackbar open={toastOpen} autoHideDuration={6000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}

export default UserEdit;
