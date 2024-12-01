import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaMoneyBillWave, FaBoxOpen, FaSignOutAlt } from 'react-icons/fa';


function Sidebar() {
const navigate = useNavigate();

const clearAuthData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('last_interaction');
};

// Logout Function
const handleLogout = () => {
    clearAuthData();
    navigate('/');
};

return (
    <div className="flex min-h-screen bg-gray-100">
    {/* Sidebar */}
    <aside className="w-64 bg-blue-800 text-white p-6 hidden lg:block">
        <h2 className="text-2xl font-bold mb-8">Washify</h2>
        <ul>
        <a href="/dashboard" className="mb-6 flex items-center">
            <FaTachometerAlt className="mr-3" /> Dashboard
        </a>
        <a href="/dashboard/members" className="mb-6 flex items-center">
            <FaUsers className="mr-3" /> Members
        </a>
        <li className="mb-6 flex items-center">
            <FaMoneyBillWave className="mr-3" /> Pendapatan
        </li>
        <li className="mb-6 flex items-center">
            <FaBoxOpen className="mr-3" /> Paket
        </li>
        <a className="mb-6 flex items-center">
            <FaSignOutAlt className="mr-3" onClick={handleLogout}/> 
            Logout
        </a>
        </ul>
    </aside>
    </div>
);
}

export default Sidebar;