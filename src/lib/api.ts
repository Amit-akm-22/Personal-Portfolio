import { ACHIEVEMENTS } from '../data/achievements';
import { BLOGS } from '../data/blogs';
import { CERTIFICATES } from '../data/certificates';
import { EDUCATION } from '../data/education';
import { PROJECTS } from '../data/projects';

export const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? 'http://localhost:4000' : '');
const ADMIN_TOKEN_KEY = 'portfolio_admin_token';

export interface ProfileData {
  githubUrl: string;
  githubImage: string;
  linkedinUrl: string;
  linkedinImage: string;
  email: string;
  phone: string;
}

export interface PortfolioContent {
  projects: typeof PROJECTS;
  achievements: typeof ACHIEVEMENTS;
  certificates: typeof CERTIFICATES;
  blogs: typeof BLOGS;
  education: typeof EDUCATION;
  profile: ProfileData;
}

export const fallbackContent: PortfolioContent = {
  projects: PROJECTS,
  achievements: ACHIEVEMENTS,
  certificates: CERTIFICATES,
  blogs: BLOGS,
  education: EDUCATION,
  profile: {
    githubUrl: 'https://github.com/Amit-akm-22',
    githubImage: '',
    linkedinUrl: 'https://www.linkedin.com/in/amit-manmode-5b1a23328',
    linkedinImage: '',
    email: 'amit.akm.work@gmail.com',
    phone: '+91 83057-21431'
  }
};

export const getAdminToken = () => {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(ADMIN_TOKEN_KEY) || '';
};

export const clearAdminToken = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export class AuthError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthError';
  }
}

const authHeaders = (): Record<string, string> => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function loginAdmin(username: string, password: string) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid username or password');
  }

  const data = await response.json();
  if (!data.token) throw new Error('Login did not return a token');
  window.localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
  return data.token;
}

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
      profile: content.profile || fallbackContent.profile,
    };
  } catch {
    return fallbackContent;
  }
}

export async function createContent(type: 'projects' | 'achievements' | 'certificates' | 'blogs' | 'education', formData: FormData) {
  const response = await fetch(`${API_BASE}/api/${type}`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });

  if (response.status === 401) {
    throw new AuthError();
  }

  if (!response.ok) {
    throw new Error(`Could not create ${type}`);
  }

  return response.json();
}

export async function updateContent(type: 'projects' | 'achievements' | 'certificates' | 'blogs' | 'education', id: string, formData: FormData) {
  const response = await fetch(`${API_BASE}/api/${type}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: formData,
  });

  if (response.status === 401) {
    throw new AuthError();
  }

  if (!response.ok) {
    throw new Error(`Could not update ${type}`);
  }

  return response.json();
}

export async function deleteContent(type: 'projects' | 'achievements' | 'certificates' | 'blogs' | 'education', id: string) {
  const response = await fetch(`${API_BASE}/api/${type}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (response.status === 401) {
    throw new AuthError();
  }

  if (!response.ok) {
    throw new Error(`Could not delete ${type}`);
  }

  return response.json();
}

export async function reorderContent(type: 'projects' | 'achievements' | 'certificates' | 'blogs' | 'education', ids: string[]) {
  const response = await fetch(`${API_BASE}/api/${type}/reorder`, {
    method: 'PATCH',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });

  if (response.status === 401) throw new AuthError();
  if (!response.ok) throw new Error(`Could not reorder ${type}`);
  return response.json();
}

export async function updateProfile(formData: FormData) {
  const response = await fetch(`${API_BASE}/api/profile`, {
    method: 'PUT',
    headers: authHeaders(),
    body: formData,
  });

  if (response.status === 401) throw new AuthError();
  if (!response.ok) throw new Error('Could not update profile');
  return response.json();
}
