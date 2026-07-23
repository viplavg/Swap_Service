import api from "./axios";

export async function createSwapRequest(payload) {
    const response = await api.post("/swaps", payload);
    return response.data;
}

export async function getMySwapRequests() {
  const response = await api.get("/swaps/my-requests");
  return response.data;
}

export async function getPendingSwapRequests() {
  const response = await api.get("/swaps/pending");
  return response.data;
}   

export async function approveSwapRequest(requestId) {
  const response = await api.patch(`/swaps/${requestId}/approve`);
  return response.data;
}

export async function rejectSwapRequest(requestId) {
  const response = await api.patch(`/swaps/${requestId}/reject`);
  return response.data;
}