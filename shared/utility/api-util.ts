import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
  headers: {
    "x-api-key": "a8d6ge7d-5tsa-8d9c-m3b2-30e21c0e9564",
  },
});

export default apiClient;
