import api from "../api/axios-config";

export interface Category {
  id: string;
  name: string;
  child: subCategory[];
}
[];

export interface subCategory {
  id: string;
  name: string;
}

export const categoryServices = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get(`/category/all`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        // localStorage.setItem("token", response.data.response.accessToken);
        console.log("Category data:", response.data);

        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },
};
