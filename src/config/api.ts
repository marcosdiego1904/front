// src/config/api.ts

// Correct URL for your Render backend deployment
const API_BASE_URL = "https://back-e1qy.onrender.com/api";

// For development/local testing
const DEV_API_URL = "http://localhost:5000/api";

// Use the appropriate URL based on environment
const isProduction = import.meta.env.PROD;
const API_URL = isProduction ? API_BASE_URL : DEV_API_URL;

export default API_URL;