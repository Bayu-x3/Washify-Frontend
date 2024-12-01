    import { useEffect, useState, useCallback } from "react";
    import { useNavigate } from "react-router-dom";
    import endpoints from "../../constants/apiEndpoint";
    import { Bar } from 'react-chartjs-2';
    import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


    import Sidebar from '../../components/Sidebar'
    import Navbar from "../../components/Navbar";
    import Footer from "../../components/Footer";

    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    function Dashboard() {
    const navigate = useNavigate();

    const [ringkasanStatistik, setRingkasanStatistik] = useState({});
    const [topPaket, setTopPaket] = useState({});
    const [topMember, setTopMember] = useState({});
    const [notifikasi, setNotifikasi] = useState({});
    const [user, setUser] = useState({ name: '', role: '' });

    const clearAuthData = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('last_interaction');
    };

    const fetchWithAuth = async (url) => {
        const token = localStorage.getItem('access_token');
        const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error(`Error fetching data from ${url}`);
        return response.json();
    };

    const checkAuthAndFetchData = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        const lastInteraction = localStorage.getItem('last_interaction');

        if (!token || !lastInteraction || (new Date().getTime() - parseInt(lastInteraction, 10)) > 60 * 60 * 1000) {
        clearAuthData();
        navigate('/');
        return;
        }

        try {
        const response = await fetchWithAuth(endpoints.dashboard);
        const data = response.data;
        if (data) {
            setRingkasanStatistik(data.ringkasan_statistik);
            setTopPaket(data.paket_paling_banyak);
            setTopMember(data.top_member);
            setNotifikasi(data.notifikasi);
            setUser(data.user);
        }
        } catch (error) {
        console.error('Error fetching dashboard data:', error);
        }
    }, [navigate]);

    console.log(notifikasi);

    useEffect(() => {
        checkAuthAndFetchData();
    }, [checkAuthAndFetchData]);

    useEffect(() => {
        const updateLastInteraction = () => {
        localStorage.setItem('last_interaction', new Date().getTime().toString());
        };
        window.addEventListener('click', updateLastInteraction);
        window.addEventListener('keydown', updateLastInteraction);

        return () => {
        window.removeEventListener('click', updateLastInteraction);
        window.removeEventListener('keydown', updateLastInteraction);
        };
    }, []);

    // Chart Data
    const chartData = {
        labels: ['Transaksi Baru', 'Proses', 'Selesai', 'Diambil'],
        datasets: [
        {
            label: 'Status Transaksi',
            data: [
            ringkasanStatistik.status_transaksi?.baru || 0,
            ringkasanStatistik.status_transaksi?.proses || 0,
            ringkasanStatistik.status_transaksi?.selesai || 0,
            ringkasanStatistik.status_transaksi?.diambil || 0,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
        ],
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        <div className="flex-1">
        <Navbar user={user} />

            {/* Main Content */}
            <main className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Statistik Cards */}
                <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Transaksi Hari Ini</h3>
                <p className="text-2xl font-bold text-gray-800 mt-2">{ringkasanStatistik.jumlah_transaksi_hari_ini || 0}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Pendapatan Hari Ini</h3>
                <p className="text-2xl font-bold text-gray-800 mt-2">Rp {ringkasanStatistik.pendapatan_hari_ini?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Jumlah Member</h3>
                <p className="text-2xl font-bold text-gray-800 mt-2">{ringkasanStatistik.jumlah_member || 0}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Jumlah Outlet</h3>
                <p className="text-2xl font-bold text-gray-800 mt-2">{ringkasanStatistik.jumlah_outlet || 0}</p>
                </div>
            </div>

            {/* Chart */}
            <section className="mt-6">
                <h2 className="text-lg font-bold text-gray-800">Status Transaksi</h2>
                <div className="bg-white shadow rounded-lg p-4 mt-4">
                <Bar data={chartData} />
                </div>
            </section>

            {/* Paket Paling Banyak */}
            <section className="mt-6">
                <h2 className="text-lg font-bold text-gray-800">Paket Paling Banyak</h2>
                <div className="bg-white shadow rounded-lg p-4 mt-4">
                <p className="text-sm font-medium text-gray-500">Nama Paket</p>
                <p className="text-lg font-bold text-gray-800">{topPaket.nama_paket || "N/A"}</p>
                <p className="text-sm font-medium text-gray-500 mt-2">Total Qty</p>
                <p className="text-lg font-bold text-gray-800">{topPaket.total_qty || 0}</p>
                </div>
            </section>

            {/* Top Member */}
            <section className="mt-6">
                <h2 className="text-lg font-bold text-gray-800">Top Member</h2>
                <div className="bg-white shadow rounded-lg p-4 mt-4">
                <p className="text-sm font-medium text-gray-500">Nama Member</p>
                <p className="text-lg font-bold text-gray-800">{topMember.nama_member || "N/A"}</p>
                <p className="text-sm font-medium text-gray-500 mt-2">Total Transaksi</p>
                <p className="text-lg font-bold text-gray-800">{topMember.total_transaksi || 0}</p>
                </div>
            </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
        </div>
    );
    }

    export default Dashboard;
