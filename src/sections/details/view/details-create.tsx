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

interface Transaksi {
  id: number;
  kode_invoice: string;
}

interface Paket {
  id: number;
  jenis: string;
}

export function DetailsCreate() {
  const navigate = useNavigate();
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [paket, setPaket] = useState<Paket[]>([]);
  const [qty, setQty] = useState('');
  const [keterangan, setKeterangan] = useState('');
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

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

        const [transaksiResponse, paketResponse] = await Promise.all([
          fetch(endpoints.trx, { headers }),
          fetch(endpoints.pakets, { headers }),
        ]);

        const transaksiData = await transaksiResponse.json();
        const paketData = await paketResponse.json();

        if (transaksiResponse.ok && transaksiData.success) setTransaksi(transaksiData.data);
        if (paketResponse.ok && paketData.success) setPaket(paketData.data);
      } catch (er) {
        console.error('Error fetching data:', er);
      }
    };

    fetchData();
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const token = localStorage.getItem('access_token');

    try {
      const selectedTransaksiId = transaksi.length > 0 ? transaksi[0].id : null;
      const selectedPaketId = paket.length > 0 ? paket[0].id : null;

      const payload = {
        id_transaksi: selectedTransaksiId,
        id_paket: selectedPaketId,
        qty: parseFloat(qty),
        keterangan,
      };

      const response = await fetch(endpoints.details, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setToastMessage('Transaction Details created successfully!');
        setToastSeverity('success');
      } else {
        setToastMessage(result.message || 'Failed to create Transaction Details.');
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
          <Link color="inherit" onClick={() => navigate('/details')}>
            Details Transaction
          </Link>
          <Typography color="textPrimary">Create Details Trx</Typography>
        </Breadcrumbs>

        <Typography variant="h4" sx={{ mt: 2 }}>
          Create Details Transactions
        </Typography>
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
            select
            label="Transaksi"
            name="id_transaksi"
            value={transaksi.length ? transaksi[0].id : ''}
            onChange={(e) => {
              const selectedTransaksi = transaksi.find((t) => t.id === Number(e.target.value));
              setTransaksi(selectedTransaksi ? [selectedTransaksi] : []);
            }}
            margin="normal"
          >
            {transaksi.map((transaksis) => (
              <MenuItem key={transaksis.id} value={transaksis.id}>
                {transaksis.kode_invoice}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Paket"
            name="id_paket"
            value={paket.length ? paket[0].id : ''}
            onChange={(e) => {
              const selectedPaket = paket.find((p) => p.id === Number(e.target.value));
              setPaket(selectedPaket ? [selectedPaket] : []);
            }}
            margin="normal"
          >
            {paket.map((pakets) => (
              <MenuItem key={pakets.id} value={pakets.id}>
                {pakets.jenis}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            fullWidth
            label="Qty"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            fullWidth
            label="Keterangan"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            sx={{ mb: 3 }}
            multiline
            rows={4}
            required
          />

          <Button type="submit" variant="contained" color="primary" disabled={isLoading} fullWidth>
            {isLoading ? 'Creating...' : 'Create Member'}
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

export default DetailsCreate;
