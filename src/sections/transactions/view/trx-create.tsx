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

interface Members {
  id: number;
  nama: string;
}

interface Users {
  id: number;
  nama: string;
}

export function TrxCreate() {
  const navigate = useNavigate();
  const [kode_invoice, setKode] = useState('');
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [members, setMembers] = useState<Members[]>([]);
  const [selectedMembers, setSelectedMember] = useState('');
  const [users, setUsers] = useState<Users[]>([]);
  const [selectedUsers, setSelectedUsers] = useState('');
  const [tgl, setTgl] = useState('');
  const [batas_waktu, setBatasWaktu] = useState('');
  const [tgl_bayar, setTglBayar] = useState('');
  const [biaya_tambahan, setAddPrice] = useState('');
  const [diskon, setDiskon] = useState('');
  const [pajak, setPajak] = useState('');
  const [status, setStatus] = useState('');
  const [dibayar, setDibayar] = useState('');
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

    const fetchOutlets = async () => {
      try {
        const response = await fetch(endpoints.outlets, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok && result.success) {
          setOutlets(result.data);
        } else {
          console.error('Failed to fetch outlets:', result.message);
        }
      } catch (err) {
        console.error('Error fetching outlets:', err);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await fetch(endpoints.members, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok && result.success) {
          setMembers(result.data);
        } else {
          console.error('Failed to fetch members:', result.message);
        }
      } catch (err) {
        console.error('Error fetching members:', err);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(endpoints.users, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok && result.success) {
          setUsers(result.data);
        } else {
          console.error('Failed to fetch users:', result.message);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchOutlets();
    fetchMembers();
    fetchUsers();
  }, [navigate]);
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
  
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
      return;
    }
  
    const response = await fetch(endpoints.trx, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_outlet: selectedOutlet,
        kode_invoice,
        id_member: selectedMembers,
        tgl,
        batas_waktu,
        tgl_bayar,
        biaya_tambahan: parseFloat(biaya_tambahan),
        diskon: parseFloat(diskon),
        pajak: parseFloat(pajak),
        status,
        dibayar,
        id_user: selectedUsers,
      }),
    });
  
    const result = await response.json();
  
    if (response.ok && result.success) {
      setToastMessage('Transaction created successfully!');
      setToastSeverity('success');
    } else {
      setToastMessage(result.message || 'Failed to create transaction.');
      setToastSeverity('error');
    }
    
    setToastOpen(true);
    setToastOpen(false);
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
          <Link color="inherit" onClick={() => navigate('/trx')}>
            Transactions
          </Link>
          <Typography color="textPrimary">Create Transaction</Typography>
        </Breadcrumbs>

        <Typography variant="h4" sx={{ mt: 2 }}>Create Transaction</Typography>
      </Box>

      <Card sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
        <TextField
            select
            fullWidth
            label="Outlet"
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            sx={{ mb: 3 }}
            required
          >
            {outlets.map((outlet) => (
              <MenuItem key={outlet.id} value={outlet.id}>
                {outlet.nama}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Kode Invoice"
            value={kode_invoice}
            onChange={(e) => setKode(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            select
            fullWidth
            label="Member"
            value={selectedMembers}
            onChange={(e) => setSelectedMember(e.target.value)}
            sx={{ mb: 3 }}
            required
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                {member.nama}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type='date'
            fullWidth
            value={tgl}
            onChange={(e) => setTgl(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            type='date'
            fullWidth
            value={batas_waktu}
            onChange={(e) => setBatasWaktu(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            type='date'
            fullWidth
            value={tgl_bayar}
            onChange={(e) => setTglBayar(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            type='date'
            fullWidth
            value={tgl}
            onChange={(e) => setTgl(e.target.value)}
            sx={{ mb: 3 }}
            required
          />
          
          <TextField
            fullWidth
            label="Biaya Tambahan"
            value={biaya_tambahan}
            onChange={(e) => setAddPrice(e.target.value)}
            sx={{ mb: 3 }}
            required
          />
          
          <TextField
            fullWidth
            label="Diskon"
            value={diskon}
            onChange={(e) => setDiskon(e.target.value)}
            sx={{ mb: 3 }}
            required
          />
          
          <TextField
            fullWidth
            label="Pajak"
            value={pajak}
            onChange={(e) => setPajak(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            select
            fullWidth
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ mb: 3 }}
            required
          > 
            <MenuItem value="baru">Baru</MenuItem>
            <MenuItem value="proses">Proses</MenuItem>
            <MenuItem value="selesai">Selesai</MenuItem>
            <MenuItem value="diambil">Diambil</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            label="Dibayar"
            value={dibayar}
            onChange={(e) => setDibayar(e.target.value)}
            sx={{ mb: 3 }}
            required
          >
            <MenuItem value="dibayar">Dibayar</MenuItem>
            <MenuItem value="belum_dibayar">Belum dibayar</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            label="Users"
            value={selectedUsers}
            onChange={(e) => setSelectedUsers(e.target.value)}
            sx={{ mb: 3 }}
            required
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.nama}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Creating...' : 'Create Transaction'}
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

export default TrxCreate;
