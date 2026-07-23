import api from "./axios";

export async function registerUser(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}