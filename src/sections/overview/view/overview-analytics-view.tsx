import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// import CloudDownloadIcon from '@mui/icons-material/CloudDownload'; // Import icon download

import { DashboardContent } from 'src/layouts/dashboard';

import apiEndpoint from '../../../contants/apiEndpoint';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';

interface DashboardData {
  user: {
    name: string;
    role: string;
  };
  ringkasan_statistik: {
    jumlah_transaksi_hari_ini: number;
    pendapatan_hari_ini: number;
    jumlah_member: number;
    jumlah_outlet: number;
    percent_today_transactions: number;
    percent_today_revenue: number;
    percent_member: number;
    percent_outlet: number;
    status_transaksi: {
      baru: number;
      proses: number;
      selesai: number;
      diambil: number;
    };
  };
  paket_paling_banyak: {
    nama_paket: string | null;
    total_qty: number;
  };
  top_member: {
    nama_member: string | null;
    total_transaksi: number;
  };
  notifikasi: {
    transaksi_belum_dibayar: number;
  };
}

export function OverviewAnalyticsView() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
    } else {
      const fetchDashboardData = async () => {
        try {
          const response = await fetch(apiEndpoint.dashboard, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setDashboardData(data.data);
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };
      fetchDashboardData();
    }
  }, [navigate]);

  if (!dashboardData) {
    return (
      <DashboardContent maxWidth="xl">
        <Typography variant="h4">Loading...</Typography>
      </DashboardContent>
    );
  }

  const { ringkasan_statistik, paket_paling_banyak, top_member, notifikasi, user } = dashboardData;

  const handleDownloadPDF = async() => {
    const token = localStorage.getItem('access_token');
    if(!token) {
      console.error('No token found')
      return;
    }

    try {
      const response = await fetch(apiEndpoint.dashboardReports, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if(!response.ok) {
        throw new Error(response.statusText);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Data_Report.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch ( error) {
        console.error('Error', error);
    }
  }

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back {user?.name} 👋
      </Typography>

      <Button
      variant="contained"
      color="primary"
      onClick={handleDownloadPDF}
      sx={{ mb: 3 }}
    >
      Download Report PDF
    </Button>

      <Grid container spacing={3}>
        {/* Total Outlets */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Pending Trx"
            total={notifikasi.transaksi_belum_dibayar}
            percent={ringkasan_statistik.percent_outlet}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
          />
        </Grid>

        {/* Total Members */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Members"
            total={ringkasan_statistik.jumlah_member}
            percent={ringkasan_statistik.percent_member}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
          />
        </Grid>

        {/* Total Transactions Today */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Transactions Today"
            total={ringkasan_statistik.jumlah_transaksi_hari_ini}
            percent={ringkasan_statistik.percent_today_transactions}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
          />
        </Grid>

        {/* Revenue Today */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Revenue Today"
            total={ringkasan_statistik.pendapatan_hari_ini}
            percent={ringkasan_statistik.percent_today_revenue}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {/* Status Transaksi */}
        <Grid xs={12} md={6}>
          <AnalyticsCurrentVisits
            title="Transaction Status"
            chart={{
              series: [
                { label: 'New', value: ringkasan_statistik.status_transaksi.baru },
                { label: 'In Process', value: ringkasan_statistik.status_transaksi.proses },
                { label: 'Completed', value: ringkasan_statistik.status_transaksi.selesai },
                { label: 'Taken', value: ringkasan_statistik.status_transaksi.diambil },
              ],
              colors: ['#00AB55', '#FFC107', '#1890FF', '#FF4842'],
            }}
          />
        </Grid>

        <Grid xs={12} md={6}>
          <AnalyticsCurrentVisits
            title="Most Popular Package"
            chart={{
              series: [
                {
                  label: paket_paling_banyak.nama_paket || 'N/A',
                  value: paket_paling_banyak.total_qty || 0,
                },
              ],
              colors: ['#00AB55'],
            }}
          />
        </Grid>
        {/* Top Member */}
        <Grid xs={12} md={6}>
          <AnalyticsCurrentVisits
            title="Top Member"
            chart={{
              series: [
                { label: top_member.nama_member || 'N/A', value: top_member.total_transaksi || 0 },
              ],
              colors: ['#FFC107'],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
