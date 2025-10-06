export interface CreateDomainPayload {
    code: string;
    orderNumber: number;
    certificationId: number;
    translations: DomainTranslation[];
}

export interface DomainTranslation {
    languageCode: string;
    name: string;
    description: string;
}
