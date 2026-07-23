import api from "./axios";

export async function getMyShifts() {
    const response = await api.get("/shifts/my-shifts");
    return response.data;
}

export async function getAvailableShiftsForSwap() {
    const response = await api.get("/shifts/available-for-swap");
    return response.data;
}

export async function createShift(payload) {
  const response = await api.post("/shifts", payload);
  return response.data;
}

export async function getAllShifts() {
  const response = await api.get("/shifts");
  return response.data;
}

export async function updateShift({
  shiftId,
  payload,
}) {
  if (!shiftId) {
    throw new Error("Shift ID is required");
  }

  const response = await api.patch(
    `/shifts/${shiftId}`,
    payload
  );

  return response.data;
}

export async function deleteShift(shiftId) {
  const response = await api.delete(
    `/shifts/${shiftId}`
  );

  return response.data;
}