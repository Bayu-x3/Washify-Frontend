import PropTypes from 'prop-types';
import { FaUserCircle } from 'react-icons/fa';

function Navbar({ user }) {
    return (
        <header className="bg-white shadow py-4 px-6 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Washify Dashboard</h1>
            <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="flex items-center space-x-2">
                    <FaUserCircle className="text-2xl text-gray-600" />
                    <div>
                        <p className="text-sm font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

Navbar.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
    }).isRequired,
};

export default Navbar;
