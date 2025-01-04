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

export function MemberCreate() {
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [tlp, setTlp] = useState('');
  const [jenis_kelamin, setJenisKelamin] = useState('');
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
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(endpoints.members, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nama, alamat, tlp, jenis_kelamin }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setToastMessage('Member created successfully!');
        setToastSeverity('success');
      } else {
        setToastMessage(result.message || 'Failed to create member.');
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
          <Link color="inherit" onClick={() => navigate('/members')}>
            Members
          </Link>
          <Typography color="textPrimary">Create Member</Typography>
        </Breadcrumbs>

        <Typography variant="h4" sx={{ mt: 2 }}>Create Member</Typography>
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
            label="Address"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            sx={{ mb: 3 }}
            multiline
            rows={4}
            required
          />

          <TextField
            select
            fullWidth
            label="Gender"
            value={jenis_kelamin}
            onChange={(e) => setJenisKelamin(e.target.value)}
            sx={{ mb: 3 }}
            required
          >
            <MenuItem value="perempuan">Perempuan</MenuItem>
            <MenuItem value="laki_laki">Laki Laki</MenuItem>
          </TextField>

            <TextField
              type="number"
              fullWidth
              label="Phone Number"
              value={tlp}
              onChange={(e) => setTlp(e.target.value)}
              sx={{ mb: 3}}
              required
            />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
          >
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

export default MemberCreate;
