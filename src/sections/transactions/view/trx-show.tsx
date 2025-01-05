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

interface TransactionData {
    kode_invoice: string;
    biaya_tambahan: string;
    status: string;
    diskon: string;
    pajak: number;
    dibayar: string;
    members: {
      nama: string;
      alamat: string;
      jenis_kelamin: string;
      tlp: string;
    };
    outlets: {
      nama: string;
      alamat: string;
      tlp: string;
    };
    users: {
      nama: string;
      username: string;
    };
  }
  
  export function TrxShow() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
  
    const [userData, setUserData] = useState<TransactionData | null>(null);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/');
        return;
      }
  
      const fetchUserData = async () => {
        try {
          const userResponse = await fetch(`${endpoints.trx}/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
  
          const userResult = await userResponse.json();
          if (!userResponse.ok || !userResult.success) {
            setError(userResult.message || 'Failed to fetch Transaction data.');
            return;
          }
  
          setUserData(userResult.data);
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
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/trx')}>
              Back to Transactions
            </Button>
          </Box>
        </DashboardContent>
      );
    }
  
    if (!userData) {
      return (
        <DashboardContent>
          <Typography variant="h5" align="center" sx={{ mt: 5 }}>
            Loading transactions data...
          </Typography>
        </DashboardContent>
      );
    }
  
    const { kode_invoice, biaya_tambahan, status, members, outlets, users, diskon, pajak, dibayar } = userData;
  
    return (
      <DashboardContent>
        <Box display="flex" flexDirection="column" mb={5}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Link>
            <Link color="inherit" onClick={() => navigate('/trx')}>
              Transactions
            </Link>
            <Typography color="textPrimary">View Transaction</Typography>
          </Breadcrumbs>
  
          <Typography variant="h4" sx={{ mt: 2 }}>
            Transaction Details
          </Typography>
        </Box>
  
        <Card sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Code:
              </Typography>
              <Typography variant="body1">{kode_invoice || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Additional Price:
              </Typography>
              <Typography variant="body1">{biaya_tambahan || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Status:
              </Typography>
              <Typography variant="body1">{status || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Outlet:
              </Typography>
              <Typography variant="body1">{outlets.nama || 'Unknown'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Member:
              </Typography>
              <Typography variant="body1">{members.nama || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Cashier:
              </Typography>
              <Typography variant="body1">{users.nama || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Discount:
              </Typography>
              <Typography variant="body1">{diskon || 'N/A'}%</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Tax:
              </Typography>
              <Typography variant="body1">{pajak || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Paid Status:
              </Typography>
              <Typography variant="body1">{dibayar || 'N/A'}</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
  
          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={() => navigate(`/trx/edit-trx/${id}`)}>
              Edit Transaction
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/trx')}>
              Back to Transactions
            </Button>
          </Box>
        </Card>
      </DashboardContent>
    );
  }
  
  export default TrxShow;
  