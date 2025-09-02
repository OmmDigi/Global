// src/api/fetcher.ts

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // use vite env
  headers: {
    "Content-Type": "application/json",
    Authorization:
      typeof window !== "undefined" && localStorage.getItem("token")
        ? localStorage.getItem("token")
        : "",
  },
});

// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// GET - For SWR

export const uploadUrl = import.meta.env.VITE_UPLOAD_API_BASE_URL;

export const getFetcher = async (url: string) => {
  const response = await API.get(url);
  return response.data;
};

// POST
export const postFetcher = async (url: string, data: any) => {
  const response = await API.post(url, data);
  return response.data;
};

// PUT
export const putFetcher = async (url: string, data: object) => {
  const response = await API.put(url, data);
  return response.data;
};
// PATCH
export const patchFetcher = async (url: string, data: object) => {
  const response = await API.patch(url, data);
  return response.data;
};

// DELETE
export const deleteFetcher = async (url: string) => {
  const response = await API.delete(url);
  return response.data;
};

//  const permission = localStorage.getItem("permissions", permissions)
// console.log("sadasdasdsadasd",permission);
