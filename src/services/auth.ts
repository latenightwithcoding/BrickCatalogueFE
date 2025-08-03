import { log } from "console";
import api from "../api/axios-config";

export interface UserLoginResponse {
  id: string;
  username: string;
  name: string;
  createdAt: Date;
  token: string;
}

export const authService = {
  login: async (
    username: string,
    password: string,
  ): Promise<UserLoginResponse> => {
    try {
      const response = await api.post(
        `/auth/login`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.userData.token);
        localStorage.setItem("name", response.data.userData.name);

        return response.data.userData;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
  }
};
