// Import necessary components and hooks
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

interface Outlet {
  id: number;
  nama: string;
  alamat?: string;
  tlp?: string;
}

interface Member {
  id: number;
  nama: string;
}

interface Me {
  id: number;
}

export function TrxCreate() {
  const navigate = useNavigate();
  const [me, setMe] = useState<Me | null>(null);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [formValues, setFormValues] = useState({
    id_outlet: '',
    id_member: '',
    tgl: '',
    batas_waktu: '',
    tgl_bayar: '',
    biaya_tambahan: '',
    diskon: '',
    pajak: '',
    status: '',
    dibayar: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
      return;
    }
  
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  
        const [outletResponse, memberResponse, meResponse] = await Promise.all([
          fetch(endpoints.outlets, { headers }),
          fetch(endpoints.members, { headers }),
          fetch(endpoints.me, { headers }),
        ]);
  
        const outletData = await outletResponse.json();
        const memberData = await memberResponse.json();
        const meData = await meResponse.json();
  
        if (outletResponse.ok && outletData.success) setOutlets(outletData.data);
        if (memberResponse.ok && memberData.success) setMembers(memberData.data);
        if (meResponse.ok && meData.success) setMe(meData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Pastikan `id_user` diambil dari data "me" saat handleSubmit
const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setIsLoading(true);

  const token = localStorage.getItem('access_token');
  if (!token) {
    navigate('/');
    return;
  }

  if (!me) {
    setToast({ open: true, message: 'Failed to get user information.', severity: 'error' });
    setIsLoading(false);
    return;
  }

  try {
    const response = await fetch(endpoints.trx, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        ...formValues,
        biaya_tambahan: parseFloat(formValues.biaya_tambahan),
        diskon: parseFloat(formValues.diskon),
        pajak: parseFloat(formValues.pajak),
        id_user: me.id,
      }),
    });

    const result = await response.json();
    setToast({
      open: true,
      message: response.ok ? 'Transaction created successfully!' : result.message || 'Failed to create transaction.',
      severity: response.ok ? 'success' : 'error',
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    setToast({ open: true, message: 'An error occurred.', severity: 'error' });
  } finally {
    setIsLoading(false);
  }
};

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
          <Typography color="textPrimary">Create Transaction</Typography>
        </Breadcrumbs>

        {/* Form */}
        <Card sx={{ p: 4, mt: 2 }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h5" mb={2}>
              Create Transaction
            </Typography>

            <TextField
              fullWidth
              select
              label="Outlet"
              name="id_outlet"
              value={formValues.id_outlet}
              onChange={handleChange}
              margin="normal"
            >
              {outlets.map((outlet) => (
                <MenuItem key={outlet.id} value={outlet.id}>
                  {outlet.nama}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Member"
              name="id_member"
              value={formValues.id_member}
              onChange={handleChange}
              margin="normal"
            >
              {members.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.nama}
                </MenuItem>
              ))}
            </TextField>

            {['tgl', 'batas_waktu', 'tgl_bayar'].map((field) => (
               <TextField
               fullWidth
               type="date"
               name={field}
               value={formValues[field as keyof typeof formValues]}
               onChange={handleChange}
               margin="normal"
               label={field.replace('_', ' ').toUpperCase()}
               InputLabelProps={{ shrink: true }}
             />
           ))}
           
           {['biaya_tambahan', 'diskon', 'pajak'].map((field) => (
            <TextField
            fullWidth
            type="number"
            name={field}
            value={formValues[field as keyof typeof formValues]}
            onChange={handleChange}
            margin="normal"
            label={field.replace('_', ' ').toUpperCase()}
          />
        ))}
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={formValues.status}
              onChange={handleChange}
              margin="normal"
            >
              {['baru', 'proses', 'selesai', 'diambil'].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Paid"
              name="dibayar"
              value={formValues.dibayar}
              onChange={handleChange}
              margin="normal"
            >
              {['dibayar', 'belum_dibayar'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <Box mt={2}>
            <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Creating...' : 'Create Transaction'}
          </Button>
            </Box>
          </form>
        </Card>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar open={toast.open} autoHideDuration={6000} onClose={() => setToast((prev) => ({ ...prev, open: false }))}>
        <Alert severity={toast.severity} onClose={() => setToast((prev) => ({ ...prev, open: false }))}>
          {toast.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
