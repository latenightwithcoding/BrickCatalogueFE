import api from "../api/axios-config";

export interface UserLoginResponse {
    id: string;
    username: string;
    name: string;
    createdAt: Date;
    token: string;
}

export const loginServices = {
    getAll: async (): Promise<UserLoginResponse> => {
        try {
            const response = await api.get(`/category/all`, {
                withCredentials: true,
            });
            if (response.status === 200) {
                localStorage.setItem("token", response.data.response.accessToken);
                return response.data.userData;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    },
}