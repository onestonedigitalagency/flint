const API_URL = "http://localhost:8000/api";

export const api = {
  async post(endpoint, data, isForm = false) {
    const headers = {};
    let body;

    if (isForm) {
      body = new URLSearchParams();
      for (const key in data) {
        body.append(key, data[key]);
      }
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else {
      body = JSON.stringify(data);
      headers["Content-Type"] = "application/json";
    }

    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Something went wrong");
    }

    return response.json();
  },

  async get(endpoint) {
    const headers = {};
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Something went wrong");
    }

    return response.json();
  },

  logout() {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  },
};
