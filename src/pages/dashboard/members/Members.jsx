import { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import endpoints from "../../../constants/apiEndpoint";
import { useNavigate } from "react-router-dom";

function Members() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [user, setUser] = useState({ name: "", role: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchWithAuth = async (url) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Error fetching data from ${url}`);
    return response.json();
  };

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    const lastInteraction = localStorage.getItem("last_interaction");

    if (!token || !lastInteraction || new Date().getTime() - parseInt(lastInteraction, 10) > 60 * 60 * 1000) {
      clearAuthData();
      navigate("/");
      return;
    }

    try {
      const response = await fetchWithAuth(endpoints.dashboard);
      setUser(response.data || {});
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  }, [navigate]);

  const clearAuthData = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("last_interaction");
  };

  const checkAuthAndFetchData = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    const lastInteraction = localStorage.getItem("last_interaction");

    if (!token || !lastInteraction || new Date().getTime() - parseInt(lastInteraction, 10) > 60 * 60 * 1000) {
      clearAuthData();
      navigate("/");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(endpoints.members);
      setMembers(response.data || []);
    } catch (err) {
      console.error("Error fetching members data:", err);
      setError("Gagal mengambil data member. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
    checkAuthAndFetchData();
  }, [fetchUser, checkAuthAndFetchData]);

  // Skeleton Loader component
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto"></div>
      </td>
    </tr>
  );

  const handleEdit = (id) => {
    navigate(`/dashboard/members/edit/${id}`);
  }

  const handleDelete = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${endpoints.members}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete Member');

      toast.success('Member deleted successfully');
      setMembers((member) => member.filter((member) => member.id !== id));
    } catch (error) {
      console.error('Error deleting Member:', error);
      toast.error('Failed to delete Members');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <ToastContainer />

      <div className="flex flex-1 flex-col">
        {/* Navbar */}
        <Navbar
          user={user}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Members</h1>
            <a href="/dashboard/members/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              + Add Member
            </a>
          </div>

          {/* Table Members */}
          <div className="mt-6 bg-white shadow rounded-lg overflow-x-auto">
            {isLoading ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Kelamin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telepon
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonRow key={index} />
                  ))}
                </tbody>
              </table>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : members.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Kelamin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telepon
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.tlp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button onClick={() => handleEdit(member.id)}  className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center">Tidak ada data member.</p>
            )}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Members;
