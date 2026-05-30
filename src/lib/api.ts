import { ACHIEVEMENTS } from '../data/achievements';
import { BLOGS } from '../data/blogs';
import { CERTIFICATES } from '../data/certificates';
import { EDUCATION } from '../data/education';
import { PROJECTS } from '../data/projects';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export interface PortfolioContent {
  projects: typeof PROJECTS;
  achievements: typeof ACHIEVEMENTS;
  certificates: typeof CERTIFICATES;
  blogs: typeof BLOGS;
  education: typeof EDUCATION;
}

export const fallbackContent: PortfolioContent = {
  projects: PROJECTS,
  achievements: ACHIEVEMENTS,
  certificates: CERTIFICATES,
  blogs: BLOGS,
  education: EDUCATION,
};

export async function getPortfolioContent(): Promise<PortfolioContent> {
  try {
    const response = await fetch(`${API_BASE}/api/content`);
    if (!response.ok) throw new Error('Content request failed');

    const content = await response.json();
    return {
      projects: Array.isArray(content.projects) ? content.projects : PROJECTS,
      achievements: Array.isArray(content.achievements) ? content.achievements : ACHIEVEMENTS,
      certificates: Array.isArray(content.certificates) ? content.certificates : CERTIFICATES,
      blogs: Array.isArray(content.blogs) ? content.blogs : BLOGS,
      education: Array.isArray(content.education) ? content.education : EDUCATION,
    };
  } catch {
    return fallbackContent;
  }
}

export async function createContent(type: 'projects' | 'achievements' | 'certificates' | 'blogs' | 'education', formData: FormData) {
  const response = await fetch(`${API_BASE}/api/${type}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Could not create ${type}`);
  }

  return response.json();
}

export async function updateContent(type: 'projects' | 'achievements' | 'certificates' | 'blogs' | 'education', id: string, formData: FormData) {
  const response = await fetch(`${API_BASE}/api/${type}/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Could not update ${type}`);
  }

  return response.json();
}

export async function deleteContent(type: 'projects' | 'achievements' | 'certificates' | 'blogs' | 'education', id: string) {
  const response = await fetch(`${API_BASE}/api/${type}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Could not delete ${type}`);
  }

  return response.json();
}

export async function reorderContent(type: 'projects' | 'achievements' | 'certificates' | 'blogs' | 'education', ids: string[]) {
  const response = await fetch(`${API_BASE}/api/${type}/reorder`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) {
    throw new Error(`Could not reorder ${type}`);
  }

  return response.json();
}
