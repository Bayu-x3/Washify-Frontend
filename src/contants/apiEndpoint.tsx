const API_BASE_URL = 'http://127.0.0.1:8000/api';
const endpoints = {
    me: `${API_BASE_URL}/me`,
    login: `${API_BASE_URL}/login`,
    logout: `${API_BASE_URL}/logout`,
    refresh: `${API_BASE_URL}/refresh`,
    user: `${API_BASE_URL}/me`,
    dashboard: `${API_BASE_URL}/dashboard`,
    members: `${API_BASE_URL}/members`,
    outlets: `${API_BASE_URL}/outlets`,
    users: `${API_BASE_URL}/users`,
    pakets: `${API_BASE_URL}/pakets`,
    trx: `${API_BASE_URL}/transaksis`,
    details: `${API_BASE_URL}/details`,
};

export default endpoints;