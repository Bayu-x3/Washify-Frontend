import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import apiEndpoint from '../../../contants/apiEndpoint';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';

export function OverviewAnalyticsView() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    // Check if access token exists
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

  const showTopMemberChart = dashboardData.top_member.total_transaksi > 1;

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back {dashboardData.user.name} 👋
      </Typography>

      <Grid container spacing={3}>
        {/* Total Outlets */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Outlets"
            total={dashboardData.ringkasan_statistik.jumlah_outlet}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }} 
            percent={0}
          />
        </Grid>

        {/* Total Members */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Members"
            total={dashboardData.ringkasan_statistik.jumlah_member}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }} 
            percent={0}
          />
        </Grid>

        {/* Transactions */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Today Received"
            total={(dashboardData.ringkasan_statistik.pendapatan_hari_ini)}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }} 
            percent={0}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Today Transactions"
            percent={3.6}
            total={dashboardData.ringkasan_statistik.jumlah_transaksi_hari_ini}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        {/* Status Transaksi Chart */}
        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Status Transaksi"
            chart={{
              series: [
                { label: 'Baru', value: dashboardData.ringkasan_statistik.status_transaksi.baru },
                { label: 'Proses', value: dashboardData.ringkasan_statistik.status_transaksi.proses },
                { label: 'Selesai', value: dashboardData.ringkasan_statistik.status_transaksi.selesai },
                { label: 'Diambil', value: dashboardData.ringkasan_statistik.status_transaksi.diambil },
              ],
            }}
          />
        </Grid>

        {/* Paket Paling Banyak Dipesan */}
        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Paket Paling Banyak Dipesan"
            chart={{
              series: [
                { label: dashboardData.paket_paling_banyak.nama_paket, value: dashboardData.paket_paling_banyak.total_qty },
              ],
            }}
          />
        </Grid>

        {/* Top Member Chart */}
        {showTopMemberChart && (
          <Grid xs={12} md={6} lg={4}>
            <AnalyticsCurrentVisits
              title="Top Member"
              chart={{
                series: [
                  { label: dashboardData.top_member.nama_member, value: dashboardData.top_member.total_transaksi },
                ],
              }}
            />
          </Grid>
        )}
      </Grid>
    </DashboardContent>
  );
}
