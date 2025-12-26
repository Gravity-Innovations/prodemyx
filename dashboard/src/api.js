// src/api.js
export const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' 
  ? "https://prodemyx.com/api" 
  : "http://localhost:5000/api");

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(BASE_URL + endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    },
    ...options
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Server error:", text);
    throw new Error("API request failed: " + res.status);
  }

  try {
    return await res.json();
  } catch (e) {
    // Handle cases where the response is not JSON
    // This can happen on 204 No Content or other non-JSON responses
    return { success: true, message: "Request successful, no content." };
  }
}
