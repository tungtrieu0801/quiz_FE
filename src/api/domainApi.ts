import axiosInstance from "./axiosInstance"

export const getAllDomain = async (certificationId: number) => {
    const res = await axiosInstance.get(`/domains/${certificationId}`);
    return res.data;
}