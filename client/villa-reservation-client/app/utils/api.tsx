import { useEffect } from "react";
import axios from "axios";
import useRefreshToken from "./refresh";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const axiosInstance = axios.create({
    baseURL: process.env.SERVER_URL,
    withCredentials: true,
  });
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        console.log("refresh");
        const originalRequest = error.config;

        const isTokenExpired =
          error.response.status === 403 && !originalRequest._retry;

        if (isTokenExpired) {
          try {
            await refresh();
            console.log("refreshed");
            return axios(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [axiosInstance, refresh]);
  return axiosInstance;
};

export default useAxiosPrivate;
