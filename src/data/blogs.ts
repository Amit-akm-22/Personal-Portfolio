export interface BlogData {
  id: string;
  number: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  intro: string;
  sections: {
    heading: string;
    body: string;
  }[];
  tags: string[];
  accent: string;
}

export const BLOGS: BlogData[] = [
  {
    id: 'building-clean-react-interfaces',
    number: '01',
    title: 'Building Clean React Interfaces',
    category: 'Frontend',
    date: '2026',
    readTime: '4 min read',
    excerpt:
      'A practical look at creating React interfaces that feel simple, consistent, and easy to maintain.',
    intro:
      'Good frontend work is not only about making screens look beautiful. It is also about building interfaces that are predictable, readable, and comfortable for users to move through.',
    sections: [
      {
        heading: 'Start With Structure',
        body:
          'Before styling a screen, I like to understand the main user action and the information hierarchy. Once the structure is clear, spacing, type, and components become much easier to decide.',
      },
      {
        heading: 'Keep Components Focused',
        body:
          'Small components are easier to test, reuse, and change. A clean component should have one clear job and should receive data through simple props instead of depending on hidden behavior.',
      },
      {
        heading: 'Design For Real Content',
        body:
          'Interfaces should be tested with long names, empty states, and awkward values. This helps prevent broken layouts and makes the final product feel more polished.',
      },
    ],
    tags: ['React', 'Tailwind CSS', 'UI Design'],
    accent: '#7EB8F7',
  },
  {
    id: 'why-dsa-matters',
    number: '02',
    title: 'Why DSA Still Matters',
    category: 'Programming',
    date: '2026',
    readTime: '3 min read',
    excerpt:
      'How data structures and algorithms improve problem solving, even when building modern web applications.',
    intro:
      'DSA practice is not only useful for interviews. It trains you to break problems down, compare approaches, and think clearly about performance.',
    sections: [
      {
        heading: 'It Builds Problem Solving Muscle',
        body:
          'When you solve algorithmic problems, you learn how to move from a rough idea to a precise solution. That habit transfers directly into debugging and feature development.',
      },
      {
        heading: 'It Improves Technical Decisions',
        body:
          'Understanding arrays, maps, trees, queues, and complexity helps you choose the right structure for real product features instead of guessing.',
      },
      {
        heading: 'It Makes Code More Efficient',
        body:
          'Performance issues often come from small decisions repeated many times. DSA helps you notice those decisions early and write code that scales better.',
      },
    ],
    tags: ['C++', 'DSA', 'Problem Solving'],
    accent: '#4ADE80',
  },
  {
    id: 'shipping-projects-as-student',
    number: '03',
    title: 'Shipping Projects As A Student',
    category: 'Growth',
    date: '2026',
    readTime: '5 min read',
    excerpt:
      'Lessons from turning ideas into finished portfolio projects while learning full-stack development.',
    intro:
      'The fastest way to grow as a developer is to build real things. Finished projects reveal gaps that tutorials often hide.',
    sections: [
      {
        heading: 'Choose A Small Useful Idea',
        body:
          'A project does not need to be huge to be valuable. A focused idea with a clear workflow is easier to finish and easier to explain in a portfolio.',
      },
      {
        heading: 'Deploy Early',
        body:
          'Deployment teaches practical lessons about routing, assets, environment variables, performance, and real user behavior. It also makes the project feel real.',
      },
      {
        heading: 'Write What You Learned',
        body:
          'A project becomes stronger when you can explain the problem, the decisions you made, and what you would improve next.',
      },
    ],
    tags: ['Projects', 'Learning', 'Full Stack'],
    accent: '#A78BFA',
  },
];
