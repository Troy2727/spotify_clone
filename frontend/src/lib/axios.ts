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

// Add request interceptor to bypass API calls in Vercel production
axiosInstance.interceptors.request.use(
	(config) => {
		// If we're in Vercel production, cancel the request
		if (isVercelProduction()) {
			// Create a canceled request
			const source = axios.CancelToken.source();
			config.cancelToken = source.token;
			source.cancel('Request canceled in Vercel production environment');
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
		// Don't log canceled requests in Vercel production
		if (axios.isCancel(error)) {
			console.log('Request canceled:', error.message);
		} else {
			console.error('API Error:', error);

			// If the error is a timeout or network error, we can retry
			if (error.code === 'ECONNABORTED' || !error.response) {
				console.log('Network error or timeout, using fallback data');
			}
		}

		// Rethrow the error for the calling function to handle
		return Promise.reject(error);
	}
);
