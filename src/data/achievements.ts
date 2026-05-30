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
  accent: string;
}

export const ACHIEVEMENTS: AchievementData[] = [
  {
    id: 'dsa-problem-solving',
    number: '01',
    title: 'Data Structures & Algorithms',
    issuer: 'Competitive Programming Practice',
    date: '2025',
    category: 'Problem Solving',
    summary: 'Built strong fundamentals by solving algorithmic problems across arrays, strings, recursion, trees, and dynamic programming.',
    details:
      'This achievement represents consistent practice in core computer science problem solving. The focus was on writing clean solutions, analyzing time complexity, and improving implementation speed in C++.',
    highlights: [
      'Practiced problems across beginner to intermediate DSA topics.',
      'Strengthened C++ implementation and debugging skills.',
      'Improved ability to identify patterns and optimize solutions.',
    ],
    skills: ['C++', 'DSA', 'Algorithms', 'Complexity Analysis'],
    accent: '#7EB8F7',
  },
  {
    id: 'full-stack-projects',
    number: '02',
    title: 'Full Stack Project Development',
    issuer: 'Personal Portfolio Projects',
    date: '2025',
    category: 'Development',
    summary: 'Designed and shipped complete web projects with frontend interfaces, backend APIs, authentication, and database integration.',
    details:
      'This achievement highlights hands-on experience building real applications from idea to deployment. Projects included productivity tools, legal research workflows, and AI-assisted resume feedback experiences.',
    highlights: [
      'Built responsive React interfaces with Tailwind CSS.',
      'Connected applications to backend services and databases.',
      'Deployed live projects for public access and testing.',
    ],
    skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'MySQL'],
    accent: '#4ADE80',
  },
  {
    id: 'ai-integration',
    number: '03',
    title: 'AI Integration Experience',
    issuer: 'ResumeIQ Project',
    date: '2025',
    category: 'GenAI',
    summary: 'Integrated AI-powered analysis into a user-facing product to generate resume scoring, feedback, and improvement suggestions.',
    details:
      'This achievement focuses on applying generative AI in a practical product workflow. The implementation connects user input with AI feedback and presents results in a clear, actionable interface.',
    highlights: [
      'Used AI APIs to analyze resume content.',
      'Converted model output into useful user feedback.',
      'Balanced product experience with technical implementation.',
    ],
    skills: ['Gemini API', 'Prompting', 'React.js', 'Product Thinking'],
    accent: '#A78BFA',
  },
];
