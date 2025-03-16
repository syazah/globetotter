import axios from "axios";

const isProduction = import.meta.env.PROD;
const backendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  "https://globetotter-backend-production.up.railway.app";

if (isProduction) {
  axios.defaults.baseURL = backendUrl;
}

export default axios;
