// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Utilise la variable d'env pour Render
  withCredentials: true, // si tu gères les cookies (sinon à retirer)
});

export default api;
