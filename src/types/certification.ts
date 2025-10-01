export interface CertificationTranslation {
    languageCode: string;
    name: string;
    description: string;
}

export interface CertificationPayload {
    code: string;
    vendor: string;
    translations: CertificationTranslation[];
}

export interface CertificationResponse extends CertificationPayload {
    id: number;
    createdAt: string;
}