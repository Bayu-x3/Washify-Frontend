const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow py-4 px-6">
        <h1 className="text-xl font-bold text-gray-800">Washify Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Statistik Cards */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Transaksi Hari Ini</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">1</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Pendapatan Hari Ini</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">Rp 46,990</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Jumlah Member</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">3</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Jumlah Outlet</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">3</p>
          </div>
        </div>

        {/* Status Transaksi */}
        <section className="mt-6">
          <h2 className="text-lg font-bold text-gray-800">Status Transaksi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4">
            <div className="bg-blue-100 text-blue-800 rounded-lg p-4">
              <h3 className="text-sm font-medium">Baru</h3>
              <p className="text-2xl font-bold">1</p>
            </div>
            <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4">
              <h3 className="text-sm font-medium">Proses</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-green-100 text-green-800 rounded-lg p-4">
              <h3 className="text-sm font-medium">Selesai</h3>
              <p className="text-2xl font-bold">1</p>
            </div>
            <div className="bg-red-100 text-red-800 rounded-lg p-4">
              <h3 className="text-sm font-medium">Diambil</h3>
              <p className="text-2xl font-bold">1</p>
            </div>
          </div>
        </section>

        {/* Paket Paling Banyak */}
        <section className="mt-6">
          <h2 className="text-lg font-bold text-gray-800">Paket Paling Banyak</h2>
          <div className="bg-white shadow rounded-lg p-4 mt-4">
            <p className="text-sm font-medium text-gray-500">Nama Paket</p>
            <p className="text-lg font-bold text-gray-800">Cuci Kiloan</p>
            <p className="text-sm font-medium text-gray-500 mt-2">Total Qty</p>
            <p className="text-lg font-bold text-gray-800">5</p>
          </div>
        </section>

        {/* Top Member */}
        <section className="mt-6">
          <h2 className="text-lg font-bold text-gray-800">Top Member</h2>
          <div className="bg-white shadow rounded-lg p-4 mt-4">
            <p className="text-sm font-medium text-gray-500">Nama Member</p>
            <p className="text-lg font-bold text-gray-800">John Doe</p>
            <p className="text-sm font-medium text-gray-500 mt-2">Total Transaksi</p>
            <p className="text-lg font-bold text-gray-800">2</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow py-4 px-6 text-center">
        <p className="text-sm text-gray-500">© 2024 Washify. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
