import { useEffect, useState } from 'react';
import FadeIn from './FadeIn';
import { EDUCATION } from '../data/education';
import { getPortfolioContent } from '../lib/api';
import { GraduationCap } from 'lucide-react';

const EducationSection = () => {
  const [education, setEducation] = useState<typeof EDUCATION>([]);

  useEffect(() => {
    getPortfolioContent().then((content) => setEducation(content.education));
  }, []);

  return (
    <section
      id="education"
      className="relative z-10 w-full bg-[#0C0C0C] px-4 sm:px-6 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <FadeIn y={40}>
        <div className="mb-16 sm:mb-20 md:mb-28 flex flex-col items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#D7E2EA]/25 font-medium">
            Academic Background
          </span>
          <h2
            className="hero-heading text-center font-black uppercase tracking-tight leading-none text-[#D7E2EA]"
            style={{ fontSize: 'clamp(3rem, 12vw, 120px)' }}
          >
            Education
          </h2>
          <div className="flex items-center gap-4 mt-1">
            <div className="h-px w-12 bg-[#D7E2EA]/10" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D7E2EA]/20">
              {education.length} {education.length === 1 ? 'institution' : 'institutions'}
            </span>
            <div className="h-px w-12 bg-[#D7E2EA]/10" />
          </div>
        </div>
      </FadeIn>

      <div className="mx-auto max-w-[900px]">
        <div className="flex flex-col gap-6 sm:gap-8">
          {education.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.15} y={30}>
              <article className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-white/[0.06] bg-[#121212] transition-transform duration-300 hover:-translate-y-1 hover:border-white/[0.15]">
                <div className="flex h-[180px] sm:h-auto sm:w-[220px] items-center justify-center border-b sm:border-b-0 sm:border-r border-white/[0.06] bg-[#0A0A0A] p-6 shrink-0">
                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt={`${item.college} logo`}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center rounded-xl p-5"
                      style={{
                        background: `linear-gradient(135deg, ${item.accent}15, #0A0A0A 60%, #151515)`,
                      }}
                    >
                      <GraduationCap size={48} className="text-white/20" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8 justify-center">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                      {item.year}
                    </span>
                    {item.score && (
                      <span
                        className="rounded-full border px-3 py-1 text-[10px] font-black tracking-widest"
                        style={{ color: item.accent, borderColor: `${item.accent}30`, backgroundColor: `${item.accent}10` }}
                      >
                        {item.score}
                      </span>
                    )}
                  </div>

                  <h3 className="mb-2 text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
                    {item.degree}
                  </h3>

                  <p className="mb-6 text-sm font-medium text-white/60">
                    {item.branch}
                  </p>

                  <div className="mt-auto">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
                      Institution
                    </p>
                    <p className="mt-1 text-base font-semibold text-white/90">
                      {item.college}
                    </p>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
          {education.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <GraduationCap size={48} className="mb-4 opacity-50" />
              <p>No education details added yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
