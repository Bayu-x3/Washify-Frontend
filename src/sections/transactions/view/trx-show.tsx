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
  id: number;
  id_outlet: number;
  kode_invoice: string;
  id_member: number;
  tgl: string;
  batas_waktu: string;
  tgl_bayar: string;
  biaya_tambahan: number;
  diskon: number;
  pajak: number;
  status: string;
  dibayar: string;
  details: {
    id_paket: number;
    qty: number;
    keterangan: string;
  }[];
}

interface Member {
  id: number;
  nama: string;
  alamat: string;
  jenis_kelamin: string;
  tlp: string;
}

interface Outlet {
  id: number;
  nama: string;
  alamat: string;
  tlp: string;
}

interface User {
  id: number;
  nama: string;
  username: string;
}

interface Paket {
  id: number;
  nama_paket: string;
  harga: number;
}

export function TrxShow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [outlet, setOutlet] = useState<Outlet | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [pakets, setPakets] = useState<Paket[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch transaction data
        const transactionResponse = await fetch(`${endpoints.trx}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const transactionResult = await transactionResponse.json();
        if (!transactionResponse.ok || !transactionResult.success) {
          setError(transactionResult.message || 'Failed to fetch Transaction data.');
          return;
        }

        const transaction = transactionResult.data;
        setTransactionData(transaction);

        // Fetch member data
        const memberResponse = await fetch(`${endpoints.members}/${transaction.id_member}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const memberResult = await memberResponse.json();
        if (memberResponse.ok && memberResult.success) {
          setMember(memberResult.data);
        }

        // Fetch outlet data
        const outletResponse = await fetch(`${endpoints.outlets}/${transaction.id_outlet}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const outletResult = await outletResponse.json();
        if (outletResponse.ok && outletResult.success) {
          setOutlet(outletResult.data);
        }

        // Fetch user data
        const userResponse = await fetch(`${endpoints.users}/${transaction.id_user}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const userResult = await userResponse.json();
        if (userResponse.ok && userResult.success) {
          setUser(userResult.data);
        }

        // Fetch paket data
        const paketResponse = await fetch(endpoints.pakets, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const paketResult = await paketResponse.json();
        if (paketResponse.ok && paketResult.success) {
          setPakets(paketResult.data);
        }
      } catch (err) {
        setError('An error occurred while fetching data.');
      }
    };

    fetchData();
  }, [id, navigate]);

  // Fungsi untuk menghitung total harga
  const calculateTotal = () => {
    if (!transactionData || !pakets.length) return 0;

    let total = 0;

    // Hitung total harga dari detail transaksi
    transactionData.details.forEach((detail) => {
      const paket = pakets.find((p) => p.id === detail.id_paket);
      if (paket) {
        total += paket.harga * detail.qty;
      }
    });

    // Tambahkan biaya tambahan
    total += transactionData.biaya_tambahan || 0;

    // Kurangi diskon
    total -= transactionData.diskon || 0;

    // Tambahkan pajak
    total += transactionData.pajak || 0;

    return total;
  };

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

  if (!transactionData || !member || !outlet || !user || !pakets.length) {
    return (
      <DashboardContent>
        <Typography variant="h5" align="center" sx={{ mt: 5 }}>
          Loading transactions data...
        </Typography>
      </DashboardContent>
    );
  }

  const { kode_invoice, biaya_tambahan, status, diskon, pajak, dibayar, details } = transactionData;

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
          {/* Informasi Umum Transaksi */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Code:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {kode_invoice || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Additional Price:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Rp {biaya_tambahan.toLocaleString() || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Status:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {status || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Outlet:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {outlet?.nama || 'Unknown'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Member:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {member?.nama || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Cashier:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {user?.nama || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Discount:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Rp {diskon.toLocaleString() || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Tax:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Rp {pajak.toLocaleString() || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Paid Status:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {dibayar || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />

        {/* Tampilkan Detail Transaksi */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Transaction Details
        </Typography>
        {details.map((detail, index) => {
          const paket = pakets.find((p) => p.id === detail.id_paket);
          return (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle1" color="textSecondary">
                Paket {index + 1}:
              </Typography>
              <Typography variant="body1">
                <strong>Nama Paket:</strong> {paket?.nama_paket || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Harga:</strong> Rp {paket?.harga.toLocaleString() || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Quantity:</strong> {detail.qty}
              </Typography>
              <Typography variant="body1">
                <strong>Keterangan:</strong> {detail.keterangan}
              </Typography>
            </Box>
          );
        })}

        <Divider sx={{ my: 3 }} />

        {/* Tampilkan Total Harga */}
        <Box mt={2} sx={{ textAlign: 'right' }}>
          <Typography variant="h6" gutterBottom>
            <strong>Total Harga:</strong> Rp {calculateTotal().toLocaleString()}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={4}>
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