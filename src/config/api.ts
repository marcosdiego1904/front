// src/config/api.ts

// Updated with the new official domain
const API_BASE_URL = "https://api.lamptomyfeet.co/api";

// For development/local testing
const DEV_API_URL = "http://localhost:5000/api";

// Use the appropriate URL based on environment
const isProduction = import.meta.env.PROD;
const API_URL = isProduction ? API_BASE_URL : DEV_API_URL;

export default API_URL;