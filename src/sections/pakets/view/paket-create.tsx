import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

export function PaketCreate() {
  const [nama_paket, setNamaPaket] = useState('');
  const [jenis, setJenis] = useState('');
  const [harga, setHarga] = useState('');
  const navigate = useNavigate();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState('');
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

    fetchOutlets();
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(endpoints.pakets, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nama_paket, jenis, id_outlet: selectedOutlet, harga }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setToastMessage('Paket created successfully!');
        setToastSeverity('success');
      } else {
        setToastMessage(result.message || 'Failed to create paket.');
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
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Link>
          <Link color="inherit" onClick={() => navigate('/pakets')}>
            Pakets
          </Link>
          <Typography color="textPrimary">Create Paket</Typography>
        </Breadcrumbs>

        <Typography variant="h4" sx={{ mt: 2 }}>Create Paket</Typography>
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
            label="Paket Name"
            value={nama_paket}
            onChange={(e) => setNamaPaket(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            select
            fullWidth
            label="Paket Type"
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
            sx={{ mb: 3 }}
            required
          >
            <MenuItem value="kiloan">Kiloan</MenuItem>
            <MenuItem value="selimut">Selimut</MenuItem>
            <MenuItem value="bed_cover">Bed Cover</MenuItem>
            <MenuItem value="kaos">Kaos</MenuItem>
            <MenuItem value="lain">Another</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            label="Outlet"
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            sx={{ mb: 3 }}
            required
          >
            {outlets.map((outlet) => (
              <MenuItem key={outlet.id} value={outlet.id}>
                {outlet.nama}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type='number'
            label="Price"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Creating...' : 'Create Paket'}
          </Button>
        </form>
      </Card>

      {/* Snackbar for Toast */}
      <Snackbar open={toastOpen} autoHideDuration={6000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}

export default PaketCreate;
