import achievementsData from '../../server/data/achievements.json';

export interface AchievementData {
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
  galleryImages?: string[];
  accent: string;
}

export const ACHIEVEMENTS = achievementsData as AchievementData[];
