import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "@/types";

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

// Request interceptor - Attach token to requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("%cAPI REQUEST", "color:dodgerblue; font-weight:bold", {
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
      token: token,
      headers: config.headers,
    });
    return config;
  },
  (error: AxiosError) => {
    console.log("%cREQUEST ERROR", "color:red; font-weight:bold", error);
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("%cAPI RESPONSE", "color:green; font-weight:bold", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle different error status codes
    if (error.response) {
      const { status, data } = error.response;

      console.log("%cAPI ERROR", "color:red; font-weight:bold", {
        url: error?.config?.url,
        status: error?.response?.status,
        data: error?.response?.data,
      });

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.error("Session expired. Please login again.");
          localStorage.removeItem("auth_token");
          // Redirect to login
          if (window.location.pathname !== "/auth/login") {
            // window.location.href = '/auth/login';
          }
          break;
        case 403:
          // Forbidden - insufficient permissions
          console.error("Insufficient permissions.");
          break;
        case 404:
          console.error("Resource not found.");
          break;
        case 500:
          console.error("Internal server error.");
          break;
        default:
          console.error("An error occurred:", data?.message || error.message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("No response from server. Please check your connection.");
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  },
);
