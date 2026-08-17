import axios from "axios";

// Base URL of the FastAPI backend. Change this if the backend runs elsewhere.
const API_BASE_URL = "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Extracts a user-friendly error message from an Axios error, whether it
 * came from FastAPI's HTTPException (a plain string "detail") or from
 * Pydantic validation errors (a list of error objects under "detail").
 */
function extractErrorMessage(error) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    // Pydantic validation errors look like: { msg, loc, type }
    return detail.map((item) => item.msg).join(", ");
  }

  if (error?.message === "Network Error") {
    return "Could not reach the server. Is the backend running on http://localhost:8000?";
  }

  return "Something went wrong. Please try again.";
}

export async function fetchTasks() {
  try {
    const response = await apiClient.get("/tasks");
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function createTask(taskPayload) {
  try {
    const response = await apiClient.post("/tasks", taskPayload);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function updateTask(taskId, taskPayload) {
  try {
    const response = await apiClient.put(`/tasks/${taskId}`, taskPayload);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function completeTask(taskId) {
  try {
    const response = await apiClient.patch(`/tasks/${taskId}/complete`);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function deleteTask(taskId) {
  try {
    await apiClient.delete(`/tasks/${taskId}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
