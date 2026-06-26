import { useEffect, useState } from 'react';
import FadeIn from './FadeIn';
import { getPortfolioContent, ProfileData } from '../lib/api';

const ConnectSection = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    getPortfolioContent().then((content) => setProfile(content.profile));
  }, []);

  if (!profile) return null;

  return (
    <section className="relative w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-24 sm:pt-28 md:pt-32 pb-10">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn y={20}>
          <div className="flex items-center gap-4 mb-16">
            <div className="w-1.5 h-10 bg-blue-600 rounded-full" />
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-white">
              Connect Digitally
            </h2>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-10">
          {/* GitHub Card */}
          <FadeIn delay={0.1} y={30} className="w-full">
            <div className="rounded-3xl border border-white/[0.04] bg-[#121318] p-6 sm:p-8 md:p-10 shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-2xl font-black tracking-widest text-white uppercase">GitHub</h3>
                  <p className="text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase mt-1">Explore my code</p>
                </div>
                <a
                  href={profile.githubUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-6 py-3 text-[11px] font-black uppercase tracking-widest text-black transition-transform hover:scale-105 inline-flex justify-center"
                >
                  Visit GitHub
                </a>
              </div>
              <div className="w-full overflow-hidden rounded-2xl border border-white/[0.04] bg-[#1A1C23] shadow-inner aspect-[4/3] sm:aspect-auto sm:h-[350px]">
                {profile.githubImage ? (
                  <img src={profile.githubImage} alt="GitHub Profile" className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-sm font-bold tracking-widest uppercase">
                    No Image Set
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          {/* LinkedIn Card */}
          <FadeIn delay={0.2} y={30} className="w-full">
            <div className="rounded-3xl border border-white/[0.04] bg-[#121318] p-6 sm:p-8 md:p-10 shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-2xl font-black tracking-widest text-white uppercase">LinkedIn</h3>
                  <p className="text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase mt-1">Connect with me</p>
                </div>
                <a
                  href={profile.linkedinUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#0A66C2] px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-transform hover:scale-105 inline-flex justify-center shadow-[0_10px_20px_rgba(10,102,194,0.3)]"
                >
                  Visit LinkedIn
                </a>
              </div>
              <div className="w-full overflow-hidden rounded-2xl border border-white/[0.04] bg-[#1A1C23] shadow-inner aspect-[4/3] sm:aspect-auto sm:h-[350px]">
                {profile.linkedinImage ? (
                  <img src={profile.linkedinImage} alt="LinkedIn Profile" className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-sm font-bold tracking-widest uppercase">
                    No Image Set
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
