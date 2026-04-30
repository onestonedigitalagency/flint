const API_URL = "http://localhost:8000/api";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export const api = {
  async post(endpoint, data, isForm = false) {
    const headers = {};
    let body;

    if (data instanceof FormData) {
      body = data;
      // Do NOT set Content-Type header, fetch will set it with boundary
    } else if (isForm) {
      body = new URLSearchParams();
      for (const key in data) {
        body.append(key, data[key]);
      }
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else {
      body = JSON.stringify(data);
      headers["Content-Type"] = "application/json";
    }

    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Something went wrong");
    }

    return response.json();
  },

  async get(endpoint) {
    const headers = {};
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, { headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Something went wrong");
    }

    return response.json();
  },

  async put(endpoint, data) {
    const headers = { "Content-Type": "application/json" };
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Something went wrong");
    }

    return response.json();
  },

  async delete(endpoint) {
    const headers = {};
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Something went wrong");
    }

    // 204 No Content — nothing to parse
    if (response.status === 204) return null;
    return response.json();
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
  },
};
