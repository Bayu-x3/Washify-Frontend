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

export function MemberShow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState<{
    nama: string;
    alamat: string;
    tlp: string;
    jenis_kelamin: string;
    countryCode: string;
  } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchMember = async () => {
      try {
        const response = await fetch(`${endpoints.members}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok && result.success) {
          setMemberData(result.data);
        } else {
          setError(result.message || 'Failed to fetch member data.');
        }
      } catch (err) {
        setError('An error occurred while fetching member data.');
      }
    };

    fetchMember();
  }, [id, navigate]);

  if (error) {
    return (
      <DashboardContent>
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
          <Typography color="error" variant="h5">
            {error}
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/members')}>
            Back to Members
          </Button>
        </Box>
      </DashboardContent>
    );
  }

  if (!memberData) {
    return (
      <DashboardContent>
        <Typography variant="h5" align="center" sx={{ mt: 5 }}>
          Loading member data...
        </Typography>
      </DashboardContent>
    );
  }

  const { nama, alamat, tlp, jenis_kelamin, countryCode } = memberData;

  return (
    <DashboardContent>
      <Box display="flex" flexDirection="column" mb={5}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Link>
          <Link color="inherit" onClick={() => navigate('/members')}>
            Members
          </Link>
          <Typography color="textPrimary">View Member</Typography>
        </Breadcrumbs>

        <Typography variant="h4" sx={{ mt: 2 }}>
          Member Details
        </Typography>
      </Box>

      <Card sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Box display="flex" alignItems="center" gap={3} mb={4}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: jenis_kelamin === 'P' ? 'pink' : 'blue',
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
              Address:
            </Typography>
            <Typography variant="body1">{alamat}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Phone:
            </Typography>
            <Typography variant="body1">
              {countryCode} {tlp}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Gender:
            </Typography>
            <Typography variant="body1">
              {jenis_kelamin === 'P' ? 'Perempuan' : 'Laki-Laki'}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={() => navigate(`/members/edit-member/${id}`)}>
            Edit Member
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/members')}>
            Back to Members
          </Button>
        </Box>
      </Card>
    </DashboardContent>
  );
}

export default MemberShow;
