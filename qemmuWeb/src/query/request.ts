/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const request = axios.create({
  headers: {
    "content-type": "application/json;charset=UTF-8",
  },
  baseURL: import.meta.env.VITE_API_BASE_URL || "/",
  timeout: 5000,
});

request.interceptors.request.use((config: any) => {
  return config;
});

request.interceptors.response.use((response: any) => {
  if (response.data) return response.data;

  return response;
});

export const getItems = async (url: string) => {
  const response = await request.get(url);
  return response;
};

export const createItem = async (url: string, data: any) => {
  const response = await request.post(url, data);
  return response;
};

export const updateItem = async (url: string, data: any) => {
  const response = await request.put(url, data);
  return response;
};

export const deleteItem = async (url: string) => {
  const response = await request.delete(url);
  return response;
};
