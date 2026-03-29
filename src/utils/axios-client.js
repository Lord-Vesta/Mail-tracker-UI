import axios from "axios";
import { API_URL } from "./api.config";
import { toast } from "react-toastify";

// Create Axios instance
const axiosclient = axios.create({
  baseURL: API_URL,
});

axiosclient.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  },
);

axiosclient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.data?.statusCode;
    const url = error?.config?.url;

    if (status === 401 && !url.includes("/auth/login")) {
      console.error("Unauthorized! Please log in again.");
      toast.error("Session expired. Please log in again.");
      localStorage.clear();
      window.location.href = "/";
      window.reload();
      return Promise.reject(error);
    } else {
      //   console.error(error?.response?.data?.message, "errererererer");
      return Promise.reject(error);
    }
  },
);

export default axiosclient;
