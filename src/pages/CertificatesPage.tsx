import { Link } from 'react-router-dom';
import CertificatesSection from '../components/CertificatesSection';

const CertificatesPage = () => {
  return (
    <main className="relative min-h-screen w-full bg-black">
      <nav className="absolute left-0 top-0 z-50 w-full p-6 md:px-10">
        <Link
          to="/"
          className="text-xs font-medium uppercase tracking-[0.2em] text-white/80 transition hover:text-white sm:text-sm"
        >
          &larr; Back to Home
        </Link>
      </nav>

      <div>
        <CertificatesSection />
      </div>
    </main>
  );
};

export default CertificatesPage;
