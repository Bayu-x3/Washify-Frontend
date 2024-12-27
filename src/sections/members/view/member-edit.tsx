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
  const [jenis_kelamin, setJenisKelamin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+62');

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
        const response = await fetch(`${endpoints.members}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        const result = await response.json();
        if (response.ok && result.success) {
          const { nama: fetchedNama, alamat: fetchedAlamat, tlp: fetchedTlp, jenis_kelamin: fetchedJenisKelamin } = result.data;
          setNama(fetchedNama);
          setAlamat(fetchedAlamat);
          setJenisKelamin(fetchedJenisKelamin);
          setTlp(fetchedTlp.replace(/^\+\d{1,3}/, ''));
        } else {
          console.error('Failed to fetch member:', result.message);
        }
      } catch (err) {
        console.error('Error fetching member:', err);
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
      const response = await fetch(`${endpoints.members}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama,
          alamat,
          tlp: `${countryCode}${tlp}`,
          jenis_kelamin,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setToastMessage('Member updated successfully!');
        setToastSeverity('success');
      } else {
        setToastMessage(result.message || 'Failed to update Member.');
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
          <Link color="inherit" onClick={() => navigate('/members')}>
            Members
          </Link>
          <Typography color="textPrimary">Edit Member</Typography>
        </Breadcrumbs>

        <Typography variant="h4" sx={{ mt: 2 }}>Edit Member</Typography>
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
            <MenuItem value="P">Perempuan</MenuItem>
            <MenuItem value="L">Laki Laki</MenuItem>
          </TextField>


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
            {isLoading ? 'Updating...' : 'Update Member'}
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
