import { CreateDomainPayload } from "../types/domain";
import axiosInstance from "./axiosInstance"

export const getAllDomain = async (certificationId: number, language: string) => {
    const res = await axiosInstance.get(`/domains`, {
        params: { 
            certificationId,
            language 
        }
    });
    return res.data;
}

export const createDomain = async(createDomainPayload: CreateDomainPayload) => {
    const res = await axiosInstance.post("/domains", createDomainPayload);
    console.log(res.data);
    return res.data;
}

export const deleteDomain = async(domainId: number) => {
    const res = await axiosInstance.delete(`/domains/${domainId}`);
    return res.data;
}