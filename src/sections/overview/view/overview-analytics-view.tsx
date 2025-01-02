import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import apiEndpoint from '../../../contants/apiEndpoint';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';

interface DashboardData {
  chart_data: any;
  user: {
    nama: string;
    role: string;
  };
  statistics: {
    transactionsToday: number;
    percentTransactionsToday: number;
    revenueToday: {
      _sum: {
        biaya_tambahan: number;
        diskon: string;
        pajak: number;
      };
    };
    percentRevenueToday: number;
    totalMembers: number;
    percentMembers: number;
    totalOutlets: number;
    percentOutlets: number;
  };
  transactionStatus: {
    _count: number;
    status: string;
  }[];
  mostPopularPackage: {
    id: number;
    id_outlet: number;
    jenis: string;
    nama_paket: string;
    harga: number;
    created_at: string;
    updated_at: string;
  };
  topMember: {
    id: number;
    nama: string;
    alamat: string;
    jenis_kelamin: string;
    tlp: number;
    created_at: string;
    updated_at: string;
  };
  notifications: {
    pendingTransactions: number;
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
            setDashboardData(data.data); // Sesuaikan data dengan API
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

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back {dashboardData?.user?.nama} 👋
      </Typography>

      <Grid container spacing={3}>
  {/* Total Outlets */}
  <Grid xs={12} sm={6} md={3}>
    <AnalyticsWidgetSummary
      title="Total Outlets"
      total={dashboardData.statistics.totalOutlets}
      percent={dashboardData.statistics.percentOutlets}
      icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
      chart={{
        categories: dashboardData.chart_data?.categories || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        series: dashboardData.chart_data?.outlets || [],
      }}
    />
  </Grid>

  {/* Total Members */}
  <Grid xs={12} sm={6} md={3}>
    <AnalyticsWidgetSummary
      title="Total Members"
      total={dashboardData.statistics.totalMembers}
      percent={dashboardData.statistics.percentMembers}
      color="secondary"
      icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
      chart={{
        categories: dashboardData.chart_data?.categories || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        series: dashboardData.chart_data?.members || [],
      }}
    />
  </Grid>

  {/* Today Revenue */}
  <Grid xs={12} sm={6} md={3}>
    <AnalyticsWidgetSummary
      title="Today Revenue"
      total={dashboardData.statistics.revenueToday._sum.biaya_tambahan +
        parseFloat(dashboardData.statistics.revenueToday._sum.diskon) +
        dashboardData.statistics.revenueToday._sum.pajak}  // Total pendapatan
      percent={dashboardData.statistics.percentRevenueToday}
      color="warning"
      icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
      chart={{
        categories: dashboardData.chart_data?.categories || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        series: dashboardData.chart_data?.transactions || [],
      }}
    />
  </Grid>

  {/* Today Transactions */}
  <Grid xs={12} sm={6} md={3}>
    <AnalyticsWidgetSummary
      title="Today Transactions"
      total={dashboardData.statistics.transactionsToday}
      percent={dashboardData.statistics.percentTransactionsToday}
      color="error"
      icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
      chart={{
        categories: dashboardData.chart_data?.categories || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        series: dashboardData.chart_data?.todayTransactions || [],
      }}
    />
  </Grid>

  {/* Status Transaksi Chart */}
  <Grid xs={12} md={6} lg={4}>
    <AnalyticsCurrentVisits
      title="Transactions Status"
      chart={{
        series: [
          { 
            label: 'Baru', 
            value: dashboardData.transactionStatus.find(status => status.status === 'baru')?._count || 0 
          },
          { 
            label: 'Proses', 
            value: dashboardData.transactionStatus.find(status => status.status === 'proses')?._count || 0 
          },
          { 
            label: 'Selesai', 
            value: dashboardData.transactionStatus.find(status => status.status === 'selesai')?._count || 0 
          },
          { 
            label: 'Diambil', 
            value: dashboardData.transactionStatus.find(status => status.status === 'diambil')?._count || 0 
          },
        ],
      }}
    />
  </Grid>

  {/* Paket Paling Banyak Dipesan */}
  <Grid xs={12} md={6} lg={4}>
    <AnalyticsCurrentVisits
      title="Most Ordered"
      chart={{
        series: [
          {
            label: dashboardData.mostPopularPackage.nama_paket,
            value: dashboardData.mostPopularPackage.harga,
          },
        ],
      }}
    />
  </Grid>

  {/* Top Member Chart */}
  <Grid xs={12} md={6} lg={4}>
    <AnalyticsCurrentVisits
      title="Top Member"
      chart={{
        series: [
          {
            label: dashboardData.topMember.nama, // Menggunakan nama dari topMember
            value: 1, // Tidak ada properti 'total_transaksi', jadi hanya memberikan nilai 1 sebagai placeholder
          },
        ],
      }}
    />
  </Grid>
</Grid>


    </DashboardContent>
  );
}
