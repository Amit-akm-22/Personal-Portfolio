import AboutSection from '../components/AboutSection';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <main className="relative w-full min-h-screen bg-black">
      {/* Simple navigation to go back home */}
      <nav className="absolute top-0 left-0 w-full p-6 md:px-10 z-50">
        <Link to="/" className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-white/80 transition hover:text-white">
          ← Back to Home
        </Link>
      </nav>
      
      <div>
        <AboutSection />
      </div>
    </main>
  );
};

export default AboutPage;
