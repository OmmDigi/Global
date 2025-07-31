// lib/fetcher.ts
import axios from "./axios";

export const fetcher = (url) => axios.get(url).then(res => res.data);

export const postData = async (url, data) => {
  const res = await axios.post(url, data);
  return res.data;
};

export const putData = async (url, data) => {
  const res = await axios.put(url, data);
  return res.data;
};

export const deleteData = async (url) => {
  const res = await axios.delete(url);
  return res.data;
};




