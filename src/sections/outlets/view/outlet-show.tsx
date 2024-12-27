/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import endpoints from 'src/contants/apiEndpoint';
import { DashboardContent } from 'src/layouts/dashboard';

export function OutletShow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [tlp, setTlp] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [countryCode, setCountryCode] = useState('+62'); // Default to Indonesia
  const [error] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchOutlet = async () => {
      try {
        const response = await fetch(`${endpoints.outlets}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok && result.success) {
          const { nama: fetchedNama, alamat: fetchedAlamat, tlp: fetchedTlp } = result.data;
          setNama(fetchedNama);
          setAlamat(fetchedAlamat);
          setTlp(fetchedTlp.replace(/^\+\d{1,3}/, ''));
        } else {
          console.error('Failed to fetch outlet:', result.message);
        }
      } catch (err) {
        console.error('Error fetching outlet:', err);
      }
    };

    fetchOutlet();
  }, [id, navigate]);

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
          <Link color="inherit" onClick={() => navigate('/outlets')}>
            Outlets
          </Link>
          <Typography color="textPrimary">Outlet Details</Typography>
        </Breadcrumbs>

        <Typography variant="h4" sx={{ mt: 2 }}>Outlet Details</Typography>
      </Box>

      <Card sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Outlet Name</Typography>
          <Typography>{nama || 'N/A'}</Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Outlet Address</Typography>
          <Typography>{alamat || 'N/A'}</Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Outlet Phone</Typography>
          <Typography>{`${countryCode} ${tlp}` || 'N/A'}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={() => navigate(`/outlets/edit-outlet/${id}`)}>
            Edit Outlet
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/outlets')}>
            Back to Outlets
          </Button>
        </Box>
      </Card>

      <Snackbar open={toastOpen} autoHideDuration={6000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}

export default OutletShow;
