const configuredBackendUrl = import.meta.env.VITE_API_URL;

export const backendUrl = (
  configuredBackendUrl ||
  (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin)
).replace(/\/+$/, "");
