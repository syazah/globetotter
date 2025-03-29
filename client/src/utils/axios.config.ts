import axios from "axios";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  "https://globetotter-backend-production.up.railway.app";

axios.defaults.baseURL = backendUrl;

export default axios;
