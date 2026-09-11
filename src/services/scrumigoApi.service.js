import axios from "axios";

const scrumigoApiService = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
});

scrumigoApiService.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("authToken");

  if (authToken) {
    config.headers.authorization = `Bearer ${authToken}`;
  }

  return config;
});

export default scrumigoApiService;
