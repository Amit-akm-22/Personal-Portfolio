import educationData from '../../server/data/education.json';

export interface EducationData {
  id: string;
  number: string;
  college: string;
  degree: string;
  branch: string;
  year: string;
  score: string;
  logo?: string;
  accent: string;
}

export const EDUCATION = educationData as EducationData[];
