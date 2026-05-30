import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FadeIn from '../components/FadeIn';
import { ACHIEVEMENTS } from '../data/achievements';
import { getPortfolioContent } from '../lib/api';

const AchievementDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [achievements, setAchievements] = useState<typeof ACHIEVEMENTS>([]);
  const [loading, setLoading] = useState(true);
  const achievement = achievements.find((item) => item.id === id);

  useEffect(() => {
    getPortfolioContent()
      .then((content) => setAchievements(content.achievements))
      .finally(() => setLoading(false));
  }, []);

  if (!achievement && loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#0C0C0C] text-white">Loading...</main>;
  }

  if (!achievement) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0C0C0C] px-6 text-white">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Achievement Not Found</h1>
          <Link to="/achievements" className="text-white/60 underline transition hover:text-white">
            Return to Achievements
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0C0C0C] pb-32 text-white">
      <nav className="relative z-50 flex w-full items-center gap-8 px-6 py-8 md:px-10">
        <Link
          to="/achievements"
          className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/60 transition hover:text-white sm:text-sm"
        >
          <span aria-hidden="true">&larr;</span> Back to Achievements
        </Link>
      </nav>

      <div className="mx-auto mt-10 max-w-7xl px-6 md:mt-16 md:px-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
          <div className="w-full lg:w-[55%]">
            <FadeIn y={20}>
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-black p-4 sm:p-6">
                {achievement.image ? (
                  <img
                    src={achievement.image}
                    alt={`${achievement.title} image`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div
                    className="grid h-full w-full place-items-center rounded-xl text-center"
                    style={{
                      background: `linear-gradient(135deg, ${achievement.accent}24, #151515 48%, #0C0C0C)`,
                    }}
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">
                        Achievement Image
                      </p>
                      <p className="mt-3 text-sm text-white/45">Upload an image from the admin panel.</p>
                    </div>
                  </div>
                )}

                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/75 backdrop-blur">
                  {achievement.number}
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="flex w-full flex-col justify-center lg:w-[45%]">
            <FadeIn delay={0.3} y={20} className="flex flex-col gap-6">
              <div>
                <span className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D7E2EA]/50">
                  <span className="text-sm text-white">★</span> Achievement
                </span>

                <h1
                  className="mb-6 font-semibold leading-[1.08] tracking-normal text-white"
                  style={{ fontSize: 'clamp(2.35rem, 4.8vw, 4.4rem)' }}
                >
                  {achievement.title}
                </h1>

                <div className="mb-8 flex flex-wrap gap-2">
                  {[achievement.category, achievement.date, achievement.issuer].filter(Boolean).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-transparent px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="max-w-none">
                <p className="mb-6 text-base font-light leading-relaxed text-white/70 md:text-lg">
                  {achievement.details || achievement.summary}
                </p>

                {achievement.highlights.length > 0 && (
                  <div className="mt-8">
                    <h2 className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-white/45">
                      Highlights
                    </h2>
                    <ul className="space-y-4">
                      {achievement.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-4 text-sm leading-relaxed text-white/65">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {achievement.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {achievement.certificateUrl && (
                <div className="mt-8">
                  <a
                    href={achievement.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-[#1E3A8A] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#1E40AF]"
                  >
                    ↗ View Reference
                  </a>
                </div>
              )}
            </FadeIn>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AchievementDetailsPage;
