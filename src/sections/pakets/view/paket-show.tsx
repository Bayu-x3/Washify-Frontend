import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import endpoints from 'src/contants/apiEndpoint';
import { DashboardContent } from 'src/layouts/dashboard';

interface Paket {
  nama_paket: string;
  jenis: string;
  harga: number;
  id_outlet: string;
}

// interface Outlet {
//   id: string;
//   nama: string;
// }

export function PaketShow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [paketData, setPaketData] = useState<Paket | null>(null);
  const [outletName, setOutletName] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`${endpoints.pakets}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const userResult = await userResponse.json();
        if (userResponse.ok && userResult.success) {
          setPaketData(userResult.data);

          // Fetch outlet name based on id_outlet
          if (userResult.data.id_outlet) {
            const outletResponse = await fetch(`${endpoints.outlets}/${userResult.data.id_outlet}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });

            const outletResult = await outletResponse.json();
            if (outletResponse.ok && outletResult.success) {
              setOutletName(outletResult.data.nama);
            } else {
              setOutletName('Unknown Outlet');
            }
          } else {
            setOutletName('No Outlet Assigned');
          }
        } else {
          setError(userResult.message || 'Failed to fetch user data.');
        }
      } catch (err) {
        setError('An error occurred while fetching user data.');
      }
    };

    fetchUserData();
  }, [id, navigate]);

  if (error) {
    return (
      <DashboardContent>
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
          <Typography color="error" variant="h5">
            {error}
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/pakets')}>
            Back to Paktes
          </Button>
        </Box>
      </DashboardContent>
    );
  }

  if (!paketData) {
    return (
      <DashboardContent>
        <Typography variant="h5" align="center" sx={{ mt: 5 }}>
          Loading paket data...
        </Typography>
      </DashboardContent>
    );
  }

  const { nama_paket, jenis, harga } = paketData;

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
          <Typography color="textPrimary">View Paket</Typography>
        </Breadcrumbs>

        <Typography variant="h4" sx={{ mt: 2 }}>
          Paket Details
        </Typography>
      </Box>

      <Card sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Name:
            </Typography>
            <Typography variant="body1">{nama_paket || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Jenis:
            </Typography>
            <Typography variant="body1">{jenis || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Harga:
            </Typography>
            <Typography variant="body1">{harga || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Outlet:
            </Typography>
            <Typography variant="body1">{outletName || 'Unknown'}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={() => navigate(`/pakets/edit-paket/${id}`)}>
            Edit Paket
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/pakets')}>
            Back to Pakets
          </Button>
        </Box>
      </Card>
    </DashboardContent>
  );
}

export default PaketShow;
