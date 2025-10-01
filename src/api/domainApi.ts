import axiosInstance from "./axiosInstance"

export const getAllDomain = async (certificationId: number, language: string) => {
    const res = await axiosInstance.get(`/domains/${certificationId}`, {
        params: { language }
    });
    return res.data;
}