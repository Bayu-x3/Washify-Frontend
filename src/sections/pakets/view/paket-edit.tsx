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

export function PaketEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [nama_paket, setNamaPaket] = useState('');
  const [jenis, setJenis] = useState('');
  const [harga, setHarga] = useState('');
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

    const fetchPakets = async () => {
      try {
        const response = await fetch(`${endpoints.pakets}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok && result.success) {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const { nama_paket, jenis, harga, id_outlet } = result.data;
          setNamaPaket(nama_paket);
          setJenis(jenis);
          setHarga(harga);
          setSelectedOutlet(id_outlet);
        } else {
          console.error('Failed to fetch user:', result.message);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchOutlets();
    fetchPakets();
  }, [id, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
  
    const token = localStorage.getItem('access_token');
  
    const payload = { nama_paket, jenis, harga, id_outlet: selectedOutlet }
  
    try {
      const response = await fetch(`${endpoints.pakets}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok && result.success) {
        setToastMessage('Paket updated successfully!');
        setToastSeverity('success');
      } else {
        setToastMessage(result.message || 'Failed to update paket.');
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
          <Link color="inherit" onClick={() => navigate('/pakets')}>
            Pakets
          </Link>
          <Typography color="textPrimary">Edit Paket</Typography>
        </Breadcrumbs>

        <Typography variant="h4" sx={{ mt: 2 }}>Edit Paket</Typography>
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
            value={nama_paket}
            onChange={(e) => setNamaPaket(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            select
            fullWidth
            label="Jenis"
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
          >
            {outlets.map((outlet) => (
              <MenuItem key={outlet.id} value={outlet.id}>
                {outlet.nama}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Harga"
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
            {isLoading ? 'Updating...' : 'Update Paket'}
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

export default PaketEdit;
