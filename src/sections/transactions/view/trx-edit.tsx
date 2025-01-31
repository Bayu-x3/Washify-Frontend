import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
import Autocomplete from '@mui/material/Autocomplete';

import endpoints from 'src/contants/apiEndpoint';
import { DashboardContent } from 'src/layouts/dashboard';

interface Member {
  id: number;
  nama: string;
}

interface Me {
  id: number;
}

interface Paket {
  id: number;
  nama_paket: string;
  harga: number;
}

export function TrxEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [me, setMe] = useState<Me | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [pakets, setPakets] = useState<Paket[]>([]);
  const [formValues, setFormValues] = useState<{
    kode_invoice: string;
    id_outlet: string;
    id_member: string | number;
    tgl: string;
    batas_waktu: string;
    tgl_bayar: string;
    biaya_tambahan: string;
    diskon: string;
    pajak: string;
    status: string;
    dibayar: string;
  }>({
    kode_invoice: '',
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
  const [details, setDetails] = useState([{ id_paket: '', qty: '', keterangan: '' }]);
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

        const [memberResponse, meResponse, transactionResponse, paketResponse] = await Promise.all([
          fetch(endpoints.members, { headers }),
          fetch(endpoints.me, { headers }),
          fetch(`${endpoints.trx}/${id}`, { headers }),
          fetch(endpoints.pakets, { headers }), // Fetch data paket
        ]);

        const memberData = await memberResponse.json();
        const meData = await meResponse.json();
        const transactionData = await transactionResponse.json();
        const paketData = await paketResponse.json();

        console.log('Member Data:', memberData); // Periksa respons dari API members

        if (memberResponse.ok && memberData.success) setMembers(memberData.data);
        if (meResponse.ok && meData.success) setMe(meData.data);
        if (transactionResponse.ok && transactionData.success) {
          const formattedData = {
            ...transactionData.data,
            tgl: transactionData.data.tgl.split(' ')[0],
            batas_waktu: transactionData.data.batas_waktu.split(' ')[0],
            tgl_bayar: transactionData.data.tgl_bayar
              ? transactionData.data.tgl_bayar.split(' ')[0]
              : '',
          };

          setFormValues(formattedData);
          setDetails(transactionData.data.details || [{ id_paket: '', qty: '', keterangan: '' }]);
        }

        if (paketResponse.ok && paketData.success) {
          setPakets(paketData.data); // Set data paket ke state
        } else {
          console.error('Failed to fetch pakets.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [navigate, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailsChange = (index: number, field: string, value: string) => {
    setDetails((prevDetails) =>
      prevDetails.map((detail, i) => (i === index ? { ...detail, [field]: value } : detail))
    );
  };

  const addDetail = () => {
    setDetails((prevDetails) => [...prevDetails, { id_paket: '', qty: '', keterangan: '' }]);
  };

  const removeDetail = (index: number) => {
    setDetails((prevDetails) => prevDetails.filter((_, i) => i !== index));
  };

  const selectedMember = members.find((member) => member.id === Number(formValues.id_member));

  const calculateTotal = () => {
    let total = 0;

    // Hitung total harga dari detail transaksi
    details.forEach((detail) => {
      const paket = pakets.find((p) => p.id === Number(detail.id_paket));
      if (paket) {
        total += paket.harga * Number(detail.qty);
      }
    });

    // Tambahkan biaya tambahan
    total += Number(formValues.biaya_tambahan) || 0;

    // Kurangi diskon
    total -= Number(formValues.diskon) || 0;

    // Tambahkan pajak
    total += Number(formValues.pajak) || 0;

    return total;
  };

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
      const response = await fetch(`${endpoints.trx}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formValues,
          biaya_tambahan: parseFloat(formValues.biaya_tambahan),
          diskon: parseFloat(formValues.diskon),
          pajak: parseFloat(formValues.pajak),
          id_user: me.id,
          details,
        }),
      });

      const result = await response.json();
      setToast({
        open: true,
        message: response.ok
          ? 'Transaction updated successfully!'
          : result.message || 'Failed to update transaction.',
        severity: response.ok ? 'success' : 'error',
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
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
          <Typography color="textPrimary">Edit Transaction</Typography>
        </Breadcrumbs>

        {/* Form */}
        <Card sx={{ p: 4, mt: 2 }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h5" mb={2}>
              Edit Transaction
            </Typography>

            <TextField
              fullWidth
              label="Kode Invoice"
              name="kode_invoice"
              value={formValues.kode_invoice}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Autocomplete
  fullWidth
  options={members}
  getOptionLabel={(option) => option.nama}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Member"
      margin="normal"
      name="id_member"
      onChange={handleChange}
    />
  )}
  renderOption={(props, option) => (
    <li {...props} style={{ color: 'red' }}>
      {option.nama}
    </li>
  )}
  onChange={(event, newValue) => {
    setFormValues((prev) => ({
      ...prev,
      id_member: newValue ? newValue.id : '',
    }));
  }}
  value={selectedMember || null} // Set value ke selectedMember
  isOptionEqualToValue={(option, value) => option.id === value.id}
/>

            {details.map((detail, index) => (
              <Box key={index} display="flex" gap={2} alignItems="center" mb={2}>
                <Autocomplete
                  fullWidth
                  options={pakets}
                  getOptionLabel={(option) => `${option.nama_paket} (Rp ${option.harga})`}
                  renderInput={(params) => (
                    <TextField {...params} label="Pilih Paket" margin="normal" />
                  )}
                  value={pakets.find((paket) => paket.id === Number(detail.id_paket)) || null}
                  onChange={(event, newValue) => {
                    handleDetailsChange(index, 'id_paket', newValue ? newValue.id.toString() : '');
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                <TextField
                  fullWidth
                  label="Quantity"
                  name="qty"
                  value={detail.qty}
                  onChange={(e) => handleDetailsChange(index, 'qty', e.target.value)}
                  type="number"
                />
                <TextField
                  fullWidth
                  label="Keterangan"
                  name="keterangan"
                  value={detail.keterangan}
                  onChange={(e) => handleDetailsChange(index, 'keterangan', e.target.value)}
                />
                <Button onClick={() => removeDetail(index)}>Remove</Button>
              </Box>
            ))}
            <Button onClick={addDetail}>Add Detail</Button>

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

            {/* Tampilkan Total Harga */}
            <Box mt={2}>
              <Typography variant="h6" gutterBottom>
                Total Harga: Rp {calculateTotal().toLocaleString()}
              </Typography>
            </Box>

            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? 'Updating...' : 'Update Transaction'}
              </Button>
            </Box>
          </form>
        </Card>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
