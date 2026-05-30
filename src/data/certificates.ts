import certificatesData from '../../server/data/certificates.json';

export interface CertificateData {
  id: string;
  number: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  summary: string;
  details: string;
  highlights: string[];
  skills: string[];
  certificateUrl?: string;
  image?: string;
  accent: string;
}

export const CERTIFICATES = certificatesData as CertificateData[];
