import  apiRequest  from "./client";

export const getProfile = () => apiRequest("/settings/profile");

export const saveSettings = (data) =>
  apiRequest("/settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
