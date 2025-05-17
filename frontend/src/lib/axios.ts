import axios from "axios";

// Check if we're in Vercel production environment
const isVercelProduction = () => {
	return !import.meta.env.DEV && window.location.hostname.includes('vercel.app');
};

// Use environment variable or default to relative path for production
const apiBaseUrl = import.meta.env.VITE_API_URL || "/api";

// Create axios instance with timeout and retry logic
export const axiosInstance = axios.create({
	baseURL: apiBaseUrl,
	timeout: 10000, // 10 seconds timeout
	headers: {
		'Content-Type': 'application/json',
	}
});

// Add request interceptor for API calls
axiosInstance.interceptors.request.use(
	(config) => {
		// Log the request in development
		if (import.meta.env.DEV) {
			console.log('API Request:', config.method?.toUpperCase(), config.url);
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		// Handle canceled requests
		if (axios.isCancel(error)) {
			console.log('Request canceled:', error.message);
		} else {
			// Log detailed error information
			console.error('API Error:', {
				message: error.message,
				status: error.response?.status,
				data: error.response?.data,
				url: error.config?.url,
				method: error.config?.method
			});

			// If the error is a timeout or network error, we can provide more info
			if (error.code === 'ECONNABORTED' || !error.response) {
				console.log('Network error or timeout. Please check your connection.');
			}
		}

		// Rethrow the error for the calling function to handle
		return Promise.reject(error);
	}
);
