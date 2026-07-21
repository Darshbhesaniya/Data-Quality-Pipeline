import apiRequest from "./client";

export const getExecutions = () => apiRequest("/executions");
