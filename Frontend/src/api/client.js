// Base URL comes from .env -> VITE_API_BASE_URL=http://localhost:8000/api
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const apiRequest = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export default apiRequest