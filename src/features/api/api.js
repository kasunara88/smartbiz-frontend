const API_BASE_URL = "http://localhost:8080/api/v1/smartbiz";

const api = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Login failed. Please check your credentials."
          );
        } else {
          // Handle non-JSON error responses
          const textResponse = await response.text();
          throw new Error(
            `Server error: ${response.status} - ${
              textResponse || "An unknown error occurred."
            }`
          );
        }
      }

      const data = await response.json();
      if (!data.token) {
        throw new Error(
          "Login successful, but no token was received from the server."
        );
      }
      return { success: true, token: data.token };
    } catch (error) {
      console.error("API Login Error:", error);
      return { success: false, error: error.message };
    }
  },
  register: async (firstName, lastName, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Registration failed");
        } else {
          const textResponse = await response.text();
          throw new Error(`Server error: ${response.status} - ${textResponse}`);
        }
      }

      const textData = await response.text();
      const data = textData ? JSON.parse(textData) : {};
      return { success: true, data };
    } catch (error) {
      console.error("API Register Error:", error);
      return { success: false, message: error.message };
    }
  },
};

export default api;
