import axiosInstance from "./axiosInstance";

export const sendErrorLog = (data: any) => axiosInstance.post("/log-error", data);