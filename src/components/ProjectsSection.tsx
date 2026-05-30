import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FadeIn from './FadeIn';
import { PROJECTS } from '../data/projects';
import { getPortfolioContent } from '../lib/api';
import { normalizeTechTags } from '../lib/tech';

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 11.5L11.5 2.5M11.5 2.5H6.5M11.5 2.5V7.5" />
  </svg>
);

const ProjectsSection = () => {
  const [projects, setProjects] = useState<typeof PROJECTS>([]);

  useEffect(() => {
    getPortfolioContent().then((content) => setProjects(content.projects));
  }, []);

  return (
    <section
      id="projects"
      className="relative z-10 w-full min-h-screen bg-[#111111] px-4 sm:px-6 md:px-10 pt-16 sm:pt-20 md:pt-24 pb-40"
    >
      <FadeIn y={40}>
        <div className="mb-16 sm:mb-20 md:mb-28 flex flex-col items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#D7E2EA]/25 font-medium">
            Selected Work
          </span>
          <h2
            className="hero-heading text-center font-black uppercase tracking-tight leading-none text-[#D7E2EA]"
            style={{ fontSize: 'clamp(3rem, 12vw, 120px)' }}
          >
            Projects
          </h2>
          <div className="flex items-center gap-4 mt-1">
            <div className="h-px w-12 bg-[#D7E2EA]/10" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D7E2EA]/20">
              {projects.length} builds
            </span>
            <div className="h-px w-12 bg-[#D7E2EA]/10" />
          </div>
        </div>
      </FadeIn>

      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, i) => (
            <FadeIn key={project.id} delay={i * 0.1} y={30}>
              {(() => {
                const techTags = normalizeTechTags(project.tech);

                return (
              <div className="flex flex-col bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/[0.06] h-full transition-transform duration-300 hover:-translate-y-2 group">
                
                {/* Image Section */}
                <div className="relative w-full h-[240px] sm:h-[280px] bg-black overflow-hidden flex-shrink-0 border-b border-white/[0.06]">
                  <img
                    src={project.heroImage}
                    alt={project.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/800x600/161616/333?text=${project.name}`;
                    }}
                  />
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-6 sm:p-8">
                  <h3 className="mb-4 text-[1.65rem] font-semibold leading-[1.18] tracking-normal text-white sm:text-[2rem]">
                    {project.name}
                  </h3>
                  
                  <p className="text-white/50 text-sm leading-relaxed font-light mb-6 flex-1">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {techTags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[10px] text-white/60 tracking-wide font-medium"
                      >
                        {t}
                      </span>
                    ))}
                    {techTags.length > 3 && (
                      <span className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[10px] text-white/60 tracking-wide font-medium">
                        +{techTags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-4 mt-auto">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex justify-center items-center gap-2 bg-white text-black rounded-lg py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-white/90"
                    >
                      <ExternalLinkIcon /> Live
                    </a>
                    <Link
                      to={`/project/${project.id}`}
                      className="flex-1 flex justify-center items-center gap-2 bg-transparent border border-white/20 text-white rounded-lg py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-white/10"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>

              </div>
                );
              })()}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
