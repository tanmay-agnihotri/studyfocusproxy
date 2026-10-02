// Where the two backends live. Set these in a .env file (see .env.example).
export const PROXY_API = import.meta.env.VITE_PROXY_API_URL || "http://127.0.0.1:8889";
export const TUTOR_API = import.meta.env.VITE_TUTOR_API_URL || "http://127.0.0.1:8000";
