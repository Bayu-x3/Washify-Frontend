import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import FormControl from '@mui/material/FormControl';

import endpoints from 'src/contants/apiEndpoint';
import { DashboardContent } from 'src/layouts/dashboard';

export function MemberEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [tlp, setTlp] = useState('');
  const [countryCode, setCountryCode] = useState('+62'); // Default to Indonesia
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
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`${endpoints.outlets}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama,
          alamat,
          tlp: `${countryCode}${tlp}`,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setToastMessage('Outlet updated successfully!');
        setToastSeverity('success');
      } else {
        setToastMessage(result.message || 'Failed to update Outlet.');
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

  const countries = [
    { code: '+62', flag: '🇮🇩' },
    { code: '+1', flag: '🇺🇸' },
    { code: '+44', flag: '🇬🇧' },
    { code: '+91', flag: '🇮🇳' },
    { code: '+81', flag: '🇯🇵' },
  ];

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
          <Typography color="textPrimary">Edit Outlet</Typography>
        </Breadcrumbs>

        <Typography variant="h4" sx={{ mt: 2 }}>Edit Outlet</Typography>
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
            required
          />

          <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="country-code-label">Country</InputLabel>
              <Select
                labelId="country-code-label"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                label="Country"
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.flag} ({country.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="number"
              fullWidth
              label="Phone"
              value={tlp}
              onChange={(e) => setTlp(e.target.value)}
              required
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Updating...' : 'Update Outlet'}
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

export default MemberEdit;
