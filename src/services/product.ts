import api from "../api/axios-config";

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
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  },
  getProductsForAdmin: async (id: string): Promise<ProductDetailModel | null> => {
    try {
      const response = await api.get(`/product/admin/${id}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log("Product data for admin:", response.data.data);

        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching product for admin by ID:", error);
      throw error;
    }
  }
};
