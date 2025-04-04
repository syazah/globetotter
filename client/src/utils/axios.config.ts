import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

axios.defaults.baseURL = backendUrl;

export default axios;
