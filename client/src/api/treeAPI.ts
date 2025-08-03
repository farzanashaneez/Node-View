import axiosInstance from "./axiosInstance";

export const getRoots = () => axiosInstance.get("/roots");
export const createNode = (data: any) => axiosInstance.post("/", data);
export const updateNode = (id: string, data: any) => axiosInstance.put(`/${id}`, data);
export const deleteNode = (id: string) => axiosInstance.delete(`/${id}`);
export const getAllNodes = () => axiosInstance.get("/flat-nodes");
export const getChildrenByParentId = (parentId: string) => axiosInstance.get(`/children/${parentId}`);
