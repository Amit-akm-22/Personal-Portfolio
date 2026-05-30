import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FadeIn from './FadeIn';
import { CERTIFICATES } from '../data/certificates';
import { getPortfolioContent } from '../lib/api';

const CertificatesSection = () => {
  const [certificates, setCertificates] = useState<typeof CERTIFICATES>([]);

  useEffect(() => {
    getPortfolioContent().then((content) => setCertificates(content.certificates));
  }, []);

  return (
    <section
      id="certificates"
      className="relative z-10 min-h-screen w-full bg-[#0C0C0C] px-4 pb-40 pt-16 sm:px-6 sm:pt-20 md:px-10 md:pt-24"
    >
      <FadeIn y={40}>
        <div className="mb-16 flex flex-col items-center gap-4 sm:mb-20 md:mb-28">
          <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#D7E2EA]/25">
            Credentials
          </span>
          <h2
            className="hero-heading text-center font-black uppercase leading-none tracking-tight text-[#D7E2EA]"
            style={{ fontSize: 'clamp(3rem, 12vw, 120px)' }}
          >
            Certificates
          </h2>
          <div className="mt-1 flex items-center gap-4">
            <div className="h-px w-12 bg-[#D7E2EA]/10" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D7E2EA]/20">
              {certificates.length} certificates
            </span>
            <div className="h-px w-12 bg-[#D7E2EA]/10" />
          </div>
        </div>
      </FadeIn>

      <div className="mx-auto max-w-[1400px]">
        {certificates.length === 0 ? (
          <FadeIn y={20}>
            <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-8 text-center text-sm text-white/45">
              Certificates added from the admin panel will appear here.
            </div>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
            {certificates.map((certificate, i) => (
              <FadeIn key={certificate.id} delay={i * 0.1} y={30}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1A1A1A] transition-transform duration-300 hover:-translate-y-2">
                  <div className="flex h-[260px] items-center justify-center border-b border-white/[0.06] bg-[#080808] p-4">
                    {certificate.image ? (
                      <img
                        src={certificate.image}
                        alt={`${certificate.title} certificate`}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full flex-col justify-between rounded-xl p-5"
                        style={{
                          background: `linear-gradient(135deg, ${certificate.accent}22, #0C0C0C 52%, #181818)`,
                        }}
                      >
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/35">
                          {certificate.number}
                        </span>
                        <span className="text-sm font-bold uppercase tracking-[0.25em] text-white/35">
                          Certificate Image
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <div className="mb-4 flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                      <span>{certificate.number}</span>
                      <span>{certificate.date}</span>
                    </div>

                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                      {certificate.category}
                    </p>

                    <h3 className="mb-5 text-[1.65rem] font-semibold leading-[1.18] tracking-normal text-white sm:text-[2rem]">
                      {certificate.title}
                    </h3>

                    <div className="mb-5 flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                      <span>{certificate.issuer}</span>
                    </div>

                    <p className="mb-6 flex-1 text-sm font-light leading-relaxed text-white/50">
                      {certificate.summary}
                    </p>

                    <div className="mb-8 flex flex-wrap gap-2">
                      {certificate.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[10px] font-medium tracking-wide text-white/60"
                        >
                          {skill}
                        </span>
                      ))}
                      {certificate.skills.length > 3 && (
                        <span className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[10px] font-medium tracking-wide text-white/60">
                          +{certificate.skills.length - 3}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/certificate/${certificate.id}`}
                      className="mt-auto flex items-center justify-center rounded-lg border border-white/20 bg-transparent px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificatesSection;
