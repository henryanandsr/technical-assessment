import { useEffect } from "react";
import axios from "axios";
import useRefreshToken from "./refresh";

const useAxiosPrivate = () => {
  console.log("axios private");
  const refresh = useRefreshToken();
  console.log("satu");
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
        const originalRequest = error.config;
        console.log("error");
        console.log("error response status", error.response.status);
        console.log("original request", originalRequest);
        if (error.response.status === 403) {
          originalRequest._retry = true;
          const access_token = await refresh();
          console.log("access_token", access_token);
          return axios(originalRequest);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [refresh]);
  return axiosInstance;
};

export default useAxiosPrivate;
