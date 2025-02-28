import axios from "axios";
import API_BASE_URL from "../config/api";

// Configuración del cliente Axios con la URL base
const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getSubcategories = async (categoryId: number) => {
  try {
    const response = await api.get(`/subcategories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching subcategories for category ${categoryId}:`, error);
    return [];
  }
};

export const getVerses = async (subcategoryId: number) => {
  try {
    const response = await api.get(`/verses/${subcategoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo versículos:", error);
    return [];
  }
};

export default api;
