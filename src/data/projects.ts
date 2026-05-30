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
  col1Image2: string; // Kept for legacy component if needed
  col2Image: string; // Kept for legacy component if needed
  accent: string; // Kept if we still use accents for tags/badges
  year: string;
}

export const PROJECTS: ProjectData[] = [
  {
    id: 'forge',
    number: '01',
    category: 'Full Stack',
    name: 'Forge',
    description: 'A high-performance productivity platform designed for focused builders and teams.',
    impact: 'Improved efficiency, reduced manual errors, and enabled real-time collaboration across remote teams.',
    liveUrl: 'https://forge-pink-seven.vercel.app/',
    githubUrl: 'https://github.com/yourusername/forge',
    tech: ['React.js', 'Node.js', 'MongoDB', 'Socket.IO'],
    accent: '#C8A96E',
    year: '2024',
    heroImage: '/Forge.png',
    galleryImages: ['/Forge.png', '/Forge1.png', '/Forge2.png'],
    col1Image2: '/Forge1.png',
    col2Image: '/Forge2.png',
  },
  {
    id: 'lawlab',
    number: '02',
    category: 'Full Stack',
    name: 'LawLab',
    description: 'Intelligent legal research platform — document analysis and case management at scale.',
    impact: 'Streamlined case management and legal research, reducing document review time by up to 30%.',
    liveUrl: 'https://lawlab-self.vercel.app',
    githubUrl: 'https://github.com/yourusername/lawlab',
    tech: ['React.js', 'Express.js', 'MySQL', 'JWT'],
    accent: '#7EB8F7',
    year: '2024',
    heroImage: '/lawlab.png',
    galleryImages: ['/lawlab.png', '/lawlab1.png', '/lawlab2.png'],
    col1Image2: '/lawlab1.png',
    col2Image: '/lawlab2.png',
  },
  {
    id: 'resumeiq',
    number: '03',
    category: 'GenAI · Full Stack',
    name: 'ResumeIQ',
    description: 'AI-powered resume scoring engine with deep feedback to help candidates land interviews.',
    impact: 'Assisted over 500 candidates in optimizing their resumes, resulting in a 40% higher interview callback rate.',
    liveUrl: 'https://resumeiq-harsh.vercel.app/',
    githubUrl: 'https://github.com/yourusername/resumeiq',
    tech: ['React.js', 'Gemini API', 'Node.js', 'Tailwind CSS'],
    accent: '#A78BFA',
    year: '2025',
    heroImage: '/resumeiq-hero.png',
    galleryImages: ['/resumeiq-hero.png', '/resumeiq-feedback.png', '/resumeiq-score.png'],
    col1Image2: '/resumeiq-feedback.png',
    col2Image: '/resumeiq-score.png',
  },
  {
    id: 'notch',
    number: '04',
    category: 'Design · Frontend',
    name: 'Notch',
    description: 'A precision-crafted SaaS landing page balancing aesthetic minimalism with conversion design.',
    impact: 'Demonstrated modern design principles, achieving a perfect 100 on Lighthouse performance and accessibility scores.',
    liveUrl: 'https://notch-zeta.vercel.app/',
    githubUrl: 'https://github.com/yourusername/notch',
    tech: ['React.js', 'Tailwind CSS', 'Framer Motion'],
    accent: '#4ADE80',
    year: '2025',
    heroImage: '/notch-hero.png',
    galleryImages: ['/notch-hero.png', '/notch-pricing.png', '/notch-mockup.png'],
    col1Image2: '/notch-pricing.png',
    col2Image: '/notch-mockup.png',
  },
];
