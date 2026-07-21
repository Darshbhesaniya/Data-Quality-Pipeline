import apiRequest  from "./client";

export const getAlerts = () => apiRequest("/alerts");
