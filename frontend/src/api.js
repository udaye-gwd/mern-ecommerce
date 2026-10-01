import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return user?.token
    ? { headers: { Authorization: `Bearer ${user.token}` } }
    : {};
};

export default api;
