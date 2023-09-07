import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8022/api/v1",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.getItem("jwt");

    if (jwtToken) {
      config.headers["Authorization"] = `Bearer ${jwtToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
