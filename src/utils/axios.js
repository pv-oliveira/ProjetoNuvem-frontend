import axios from "axios";

const api = axios.create({
  baseURL: "https://projeto-nuvem-backend.vercel.app/"
});

export default api;