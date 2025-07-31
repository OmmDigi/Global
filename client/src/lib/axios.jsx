import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: typeof window != "undefined" ? localStorage.getItem("token") : "",
    // OR if it's not a Bearer token, use the appropriate format:
    // 'x-api-key': process.env.NEXT_PUBLIC_API_AUTH_KEY,
  },
  withCredentials: true,

});


export default axiosInstance;


