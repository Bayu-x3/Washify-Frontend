import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import endpoints from 'src/contants/apiEndpoint';
import { DashboardContent } from 'src/layouts/dashboard';

interface User {
  nama: string;
  username: string;
  password: string;
  id_outlet: string;
  role: string;
}

// interface Outlet {
//   id: string;
//   nama: string;
// }

export function UserShow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<User | null>(null);
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
        const userResponse = await fetch(`${endpoints.users}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const userResult = await userResponse.json();
        if (userResponse.ok && userResult.success) {
          setUserData(userResult.data);

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
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/users')}>
            Back to Users
          </Button>
        </Box>
      </DashboardContent>
    );
  }

  if (!userData) {
    return (
      <DashboardContent>
        <Typography variant="h5" align="center" sx={{ mt: 5 }}>
          Loading user data...
        </Typography>
      </DashboardContent>
    );
  }

  const { nama, username, role } = userData;

  return (
    <DashboardContent>
      <Box display="flex" flexDirection="column" mb={5}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Link>
          <Link color="inherit" onClick={() => navigate('/users')}>
            Users
          </Link>
          <Typography color="textPrimary">View User</Typography>
        </Breadcrumbs>

        <Typography variant="h4" sx={{ mt: 2 }}>
          User Details
        </Typography>
      </Box>

      <Card sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Box display="flex" alignItems="center" gap={3} mb={4}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: role === 'admin' ? 'blue' : role === 'kasir' ? 'red' : 'green',
              fontSize: 32,
            }}
          >
            {nama.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            {nama}
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Name:
            </Typography>
            <Typography variant="body1">{nama || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Username:
            </Typography>
            <Typography variant="body1">{username || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Role:
            </Typography>
            <Typography variant="body1">{role || 'N/A'}</Typography>
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
          <Button variant="contained" color="primary" onClick={() => navigate(`/user/edit-user/${id}`)}>
            Edit User
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/user')}>
            Back to Users
          </Button>
        </Box>
      </Card>
    </DashboardContent>
  );
}

export default UserShow;
