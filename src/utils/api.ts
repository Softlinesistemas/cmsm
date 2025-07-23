"use client";
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "/",
});

// Adiciona o token ao cabeçalho de autorização em todas as requisições
api.interceptors.request.use(
  (config) => {
    const sessionToken = Cookies.get("next-auth.session-token");
    if (sessionToken) {
      config.headers.Authorization = `Bearer ${sessionToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
