import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import endpoints from "../../../constants/apiEndpoint";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditMembers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    jenis_kelamin: "",
    tlp: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState({ name: "", role: "" });

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

    try {
      const response = await fetchWithAuth(`${endpoints.members}/${id}`);
      setFormData(response.data || []);
    } catch (err) {
      console.error("Error fetching members data:", err);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchUser();
    checkAuthAndFetchData();
  }, [fetchUser, checkAuthAndFetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const token = localStorage.getItem("access_token");
  
    try {
      const response = await fetch(`${endpoints.members}/${id}?_method=PUT`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        toast.error("Gagal mengubah member, silahkan coba lagi");
        return;
      }
  
      toast.success("Data member berhasil diubah!");
    } catch (err) {
      console.error(err.message);
      toast.error("Terjadi kesalahan, silahkan coba lagi");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <ToastContainer />

      <div className="flex flex-1 flex-col">
        {/* Navbar */}
        <Navbar user={user} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Member</h1>

          <form
            className="bg-white shadow rounded-lg p-6 max-w-3xl mx-auto"
            onSubmit={handleSubmit}
          >
            <div className="sm:col-span-4">
              <label htmlFor="nama" className="block text-sm/6 font-medium text-gray-900">
                Nama
              </label>
              <div className="mt-2">
                <input
                 type="text"
                 id="nama"
                 name="nama"
                 value={formData.nama}
                 onChange={handleInputChange}
                 placeholder="Bayu-x3"
                 required
                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            < br />

            {/* Alamat */}
            <div className="col-span-full">
              <label htmlFor="alamat" className="block text-sm/6 font-medium text-gray-900">
                Alamat
              </label>
              <div className="mt-2">
                <textarea
                 id="alamat"
                 name="alamat"
                 value={formData.alamat}
                 onChange={handleInputChange}
                 required
                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                 defaultValue={''}
                 placeholder="Masukkan alamat"
                />
              </div>
            </div>

            < br />

            {/* Jenis Kelamin */}
            <div className="sm:col-span-3">
              <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">
                Gender
              </label>
              <div className="mt-2 grid grid-cols-1">
              <select
                id="jenis_kelamin"
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleInputChange}
                required
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value="">--Pilih Gender--</option> 
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
              </div>
            </div>

            < br />

            {/* Telepon */}
            <div className="sm:col-span-4">
              <label htmlFor="tlp" className="block text-sm/6 font-medium text-gray-900">
                Nomor Telepon
              </label>
              <div className="mt-2">
                <input
                 type="number"
                 id="tlp"
                 name="tlp"
                 value={formData.tlp}
                 onChange={handleInputChange}
                 required
                 placeholder="089828271613"
                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            < br />

            {/* Buttons */}
            <div className="mt-6 flex items-center justify-end gap-x-6">
        <a href="/dashboard/members" type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </a>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={isSubmitting}
        >
          Save
        </button>
      </div>
          </form>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default EditMembers;
