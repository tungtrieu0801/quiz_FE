import { CertificationPayload } from "../types/certification";
import axiosInstance from "./axiosInstance";

export const getAllCertifications = async () => {
    const res = await axiosInstance.get("/certifications");
    console.log("Calling dataa");
    console.log(res.data);
    return res.data;
}

export const createCertification = async (data: CertificationPayload) => {
    const res = await axiosInstance.post("/certifications", data);
    return res.data;
}

export const getDetailCertification = async (id: number, language: string) => {
    const res = await axiosInstance.get(`/certifications/${id}`, {
        params: { language }
    });
    return res.data;
}

export const deleteCertification = async (id: string) => {
    const res = await axiosInstance.delete(`certifications/${id}`, {
        params: {id}
    });
    return res.data;
}