import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROJECTS } from '../data/projects';
import FadeIn from '../components/FadeIn';
import { getPortfolioContent } from '../lib/api';
import { normalizeTechTags } from '../lib/tech';

const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [projects, setProjects] = useState<typeof PROJECTS>([]);
  const [loading, setLoading] = useState(true);
  const project = projects.find((p) => p.id === id);

  const [activeImage, setActiveImage] = useState(0);
  const galleryImages = project
    ? Array.from(new Set([project.heroImage, ...(project.galleryImages || [])].filter(Boolean)))
    : [];
  const techTags = project ? normalizeTechTags(project.tech) : [];

  useEffect(() => {
    getPortfolioContent()
      .then((content) => setProjects(content.projects))
      .finally(() => setLoading(false));
  }, []);

  if (!project && loading) {
    return <div className="min-h-screen bg-[#0C0C0C] text-white flex items-center justify-center">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link to="/projects" className="text-white/60 hover:text-white underline">
            Return to Projects
          </Link>
        </div>
      </div>
    );
  }

  const goToPreviousImage = () => {
    setActiveImage((current) => (current === 0 ? galleryImages.length - 1 : current - 1));
  };

  const goToNextImage = () => {
    setActiveImage((current) => (current === galleryImages.length - 1 ? 0 : current + 1));
  };

  return (
    <main className="relative w-full min-h-screen bg-[#0C0C0C] text-white overflow-hidden pb-32">
      {/* Navigation */}
      <nav className="w-full px-6 md:px-10 py-8 z-50 relative flex items-center gap-8">
        <Link
          to="/projects"
          className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-white/60 transition hover:text-white flex items-center gap-2"
        >
          <span>←</span> Back to Projects
        </Link>
      </nav>

      <div className="mx-auto max-w-7xl px-6 md:px-10 mt-10 md:mt-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Image Gallery */}
          <div className="w-full lg:w-[55%] flex flex-col gap-4">
            <FadeIn y={20}>
              <div className="relative w-full aspect-video bg-[#111] rounded-2xl overflow-hidden border border-white/5">
                <img
                  src={galleryImages[activeImage] || project.heroImage}
                  alt={`${project.name} preview`}
                  className="w-full h-full object-contain bg-black"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/1200x800/111111/333?text=${project.name}`;
                  }}
                />

                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/75 backdrop-blur">
                  {activeImage + 1} / {galleryImages.length || 1}
                </div>

                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={goToPreviousImage}
                      className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-white transition hover:bg-white hover:text-black"
                      aria-label="Previous project image"
                    >
                      &larr;
                    </button>
                    <button
                      onClick={goToNextImage}
                      className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-white transition hover:bg-white hover:text-black"
                      aria-label="Next project image"
                    >
                      &rarr;
                    </button>
                  </>
                )}
              </div>
            </FadeIn>

            {galleryImages.length > 0 && (
              <FadeIn delay={0.2} y={20}>
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-16 shrink-0 rounded-lg overflow-hidden border transition-all ${
                      activeImage === idx ? 'border-white' : 'border-white/10 hover:border-white/40'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain bg-black"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/200x150/111111/333?text=Img${idx+1}`;
                      }}
                    />
                  </button>
                  ))}
                </div>
              </FadeIn>
            )}
          </div>

          {/* Right Column: Project Info */}
          <div className="w-full lg:w-[45%] flex flex-col justify-center">
            <FadeIn delay={0.3} y={20} className="flex flex-col gap-6">
              
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D7E2EA]/50 font-bold flex items-center gap-2 mb-4">
                  <span className="text-white text-sm">★</span> FEATURED PROJECT
                </span>
                <h1
                  className="mb-6 font-extrabold leading-[1.03] tracking-tight text-white"
                  style={{ fontSize: 'clamp(2.4rem, 4.6vw, 3.7rem)' }}
                >
                  {project.name}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {techTags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-transparent px-4 py-1.5 text-[11px] text-white/60 tracking-wider font-semibold uppercase"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-white/70 text-base md:text-lg leading-relaxed font-light mb-6">
                  {project.description}
                </p>
                
                <p className="text-white/70 text-base leading-relaxed font-light">
                  <span className="font-semibold text-white">🚀 Impact:</span> {project.impact}
                </p>
              </div>

              <div className="mt-10">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center gap-3 bg-[#1E3A8A] text-white rounded-lg py-4 px-8 text-sm font-bold uppercase tracking-wider transition-colors hover:bg-[#1E40AF]"
                >
                  ↗ Live Preview
                </a>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </main>
  );
};

export default ProjectDetailsPage;
