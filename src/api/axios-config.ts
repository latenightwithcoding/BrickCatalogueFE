import axios from "axios";

import { API_URL } from "./api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "multipart/form-data",
  },
  withCredentials: true,
});

export default api;
