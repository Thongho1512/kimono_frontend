import axios from 'axios';

// Create Axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5090',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies (RefreshToken)
});

// Request Interceptor: No longer need to manually attach Access Token if using HttpOnly Cookies
api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh Token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/refresh-token')) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token (Backend sets new cookies automatically)
                const refreshResponse = await api.post('/api/auth/refresh-token');

                if (refreshResponse.status === 200) {
                    // Retry original request (Browser will send new cookies automatically)
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed (token expired or invalid)
                if (typeof window !== 'undefined') {
                    // Redirect to admin login if we are in admin section
                    if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
                        const locale = window.location.pathname.split('/')[1] || 'vi';
                        window.location.href = `/${locale}/admin/login?error=unauthorized`;
                    }
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
