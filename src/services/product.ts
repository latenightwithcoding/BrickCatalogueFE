import { create } from "domain";
import api from "../api/axios-config";
import { authService } from "./auth";
import { useNavigate } from "react-router-dom";

export interface ProductCardModel {
  id: string;
  name: string;
  products: {
    id: string;
    sku: string;
    images: string[];
  }[];
}

export interface Products {
  id: string;
  sku: string;
  images: string[];
}

export interface ProductDetailModel {
  id: string;
  name: string;
  description: string;
  sku: string;
  size: string;
  sizeUnit: string;
  category: {
    id: string;
    name: string;
  };
  images: string[];
  relatedProducts: Products[];
}

export interface ProductAdminDetailModel {
  id: string;
  name: string;
  description: string;
  sku: string;
  size: string;
  sizeUnit: string;
  category: {
    id: string;
    name: string;
    parent: {
      id: string;
      name: string;
    }
  };
  images: string[];
}

export interface ResponseProduct {
  items: ProductsDetailModel[];
  totalPages: number;
  page: number;
  totalItems: number;
}

export interface ProductsDetailModel {
  id: string;
  name: string;
  description: string;
  sku: string;
  size: string;
  sizeUnit: string;
  category: {
    id: string;
    name: string;
  };
  images: string[];
}

export interface RequestProduct {
  page: number;
  pageSize: number;
  keyword?: string | null;
}

export const productServices = {
  getProducts: async (categoryId: string): Promise<ProductCardModel | null> => {
    try {
      const response = await api.get(`/product?categoryId=${categoryId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log("Product data:", response.data.data);

        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  },
  getProduct: async (id: string): Promise<ProductDetailModel | null> => {
    try {
      const response = await api.get(`/product/${id}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log("Product data:", response.data.data);

        return response.data.data;
      }
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        (error as any).response !== null &&
        "status" in (error as any).response &&
        (error as any).response.status === 404
      ) {
        console.error("Product not found, redirecting to home page");
        window.location.href = "/*";
      }
      throw error;
    }
  },
  getProductsForAdmin: async (request: RequestProduct): Promise<ProductDetailModel | null> => {
    try {
      const response = await api.get(`/product/admin`, {
        params: {
          ...request
        },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Response status:", response.status);

      if (response.status === 200) {
        console.log("Product data for admin:", response.data.data);

        return response.data.data;
      } {
        return null;
      }
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error && (error as any).response.status === 401) {
        console.error("Unauthorized access - redirecting to login");
        authService.logout();
      }
      console.error("Error fetching product for admin by ID:", error);
      throw error;
    }
  },
  getProductForAdmin: async (id: string): Promise<ProductAdminDetailModel | null> => {
    try {
      const response = await api.get(`/product/admin/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        console.log("Product data:", response.data.data);

        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  },
  createProduct: async (product: FormData): Promise<ProductDetailModel | null> => {
    try {
      const response = await api.post(`/product`, product, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 201) {
        console.log("Product created successfully:", response.data.data);

        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },
  updateProduct: async (id: string, product: FormData): Promise<ProductDetailModel | null> => {
    try {
      const response = await api.put(`/product/${id}`, product, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        console.log("Product updated successfully:", response.data.data);

        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      const response = await api.delete(`/product/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200 || response.status === 204) {
        console.log("Product deleted successfully");
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },
};
