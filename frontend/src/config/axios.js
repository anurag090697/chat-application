import axios from 'axios';
import Cookies from 'js-cookie';

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: 'https://chat-application-backend-hrvk.onrender.com', // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token automatically
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
