import { Link } from 'react-router-dom';
import BlogSection from '../components/BlogSection';

const BlogPage = () => {
  return (
    <main className="relative w-full min-h-screen bg-black">
      <nav className="absolute top-0 left-0 w-full p-6 md:px-10 z-50">
        <Link
          to="/"
          className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-white/80 transition hover:text-white"
        >
          &larr; Back to Home
        </Link>
      </nav>

      <div>
        <BlogSection />
      </div>
    </main>
  );
};

export default BlogPage;
