import axios from "axios";
import API_BASE_URL from "../config/api";

// Configuración del cliente Axios con la URL base
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Categories and verses endpoints
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

// User memorized verses endpoints
export const saveMemorizedVerse = async (
  verseData: {
    verseId: number;
    verseReference: string;
    verseText: string;
    contextText?: string;
  },
  token: string
) => {
  try {
    const response = await api.post("/user/memorized-verses", verseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving memorized verse:", error);
    throw error;
  }
};

export const getMemorizedVerses = async (token: string) => {
  try {
    const response = await api.get("/user/memorized-verses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching memorized verses:", error);
    throw error;
  }
};

// Function to get verse by ID
export const getVerseById = async (verseId: number) => {
  try {
    const response = await api.get(`/verse/${verseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching verse with ID ${verseId}:`, error);
    return null;
  }
};

export default api;