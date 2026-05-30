import projectsData from '../../server/data/projects.json';

export interface ProjectData {
  id: string;
  number: string;
  category: string;
  name: string;
  description: string;
  impact: string;
  liveUrl: string;
  githubUrl: string;
  tech: string[];
  heroImage: string;
  galleryImages: string[];
  col1Image2: string;
  col2Image: string;
  accent: string;
  year: string;
}

export const PROJECTS = projectsData as ProjectData[];
