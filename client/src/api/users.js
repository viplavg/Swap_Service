import api from "./axios";

export async function getEmployees() {
  const response = await api.get("/users/employees");
  return response.data;
}