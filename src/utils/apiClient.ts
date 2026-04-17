import axios from "axios";
import { Endpoints } from "./endpoints";
export const apiClient = axios.create({
  baseURL: Endpoints.baseUrl
  ,
  timeout: 3000,
});
apiClient.defaults.withCredentials = true;
export const getRefreshTokenFromStorage = () => {
  return sessionStorage.getItem("refreshToken");
};
export const addRefreshTokenToStorage = (refreshToken: string) => {
  return sessionStorage.setItem("refreshToken", refreshToken);
};
export const getTokenFromStorage = () => {
  return sessionStorage.getItem("token");
};
export const addTokenToStorage = (token: string) => {
  return sessionStorage.setItem("token", token);
};
const refreshToken = async () => {
  try {
    console.log("######## REFRESH TOKEN");

    const resp = await apiClient.get("auth/refresh");
    console.log("############ REFRESH TOKEN RESPONSE", resp);

    return resp.data;
  } catch (e) {
    console.log("Error", e);
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    const token = getTokenFromStorage();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const resp = await refreshToken();

      // تأكد إن الـ resp موجود وفيه response
      const access_token = resp?.response?.token;

      if (access_token) {
        addTokenToStorage(access_token);
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
