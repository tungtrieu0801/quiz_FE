import { create } from "zustand";
import { CertificationResponse } from "../types/certification";
import { getAllCertifications } from "../api/certification";

interface CertificationState {
    certifications: CertificationResponse[];
    loading: boolean;
    error: string | null;
    fetchCertifications: () => Promise<void>;
}

export const useCertificationStore = create<CertificationState>((set) => ({
    certifications: [],
    loading: false,
    error: null,

    fetchCertifications: async () => {
        set({ loading: true, error: null });
        try {
            const data = await getAllCertifications();
            set({ certifications: data});
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },
}));