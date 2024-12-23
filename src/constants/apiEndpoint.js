const API_BASE_URL = 'http://127.0.0.1:8000/api';


const endpoints = {
    login: `${API_BASE_URL}/login`,
    logout: `${API_BASE_URL}/logout`,
    user: `${API_BASE_URL}/me`,
    dashboard: `${API_BASE_URL}/dashboard`,
    members: `${API_BASE_URL}/members`,
};

export default endpoints;