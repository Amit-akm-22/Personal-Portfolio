import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import FadeIn from './FadeIn';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Education', href: '#education' },
  { label: 'Achievements', href: '/achievements' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Contact', href: '#contact' },
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [showSoundHint, setShowSoundHint] = useState(true);
  const [needsPlaybackConsent, setNeedsPlaybackConsent] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-hide "Tap for sound" hint after 5 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowSoundHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const playUnmuted = async () => {
    const video = videoRef.current;
    if (!video) return false;

    video.muted = false;
    setMuted(false);

    try {
      await video.play();
      setShowSoundHint(false);
      setNeedsPlaybackConsent(false);
      return true;
    } catch {
      setShowSoundHint(true);
      setNeedsPlaybackConsent(true);
      return false;
    }
  };

  useEffect(() => {
    playUnmuted();
  }, []);

  // Pause video when scrolling past hero, resume when hero is visible again.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          playUnmuted();
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Pause video when tab is hidden, resume when visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (!video) return;

      if (document.hidden) {
        video.pause();
      } else {
        // Resume play if the hero section is still somewhat visible
        const sectionBottom = sectionRef.current?.getBoundingClientRect().bottom ?? 0;
        if (sectionBottom > 0) {
          playUnmuted();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Snap-scroll: one wheel tick / keypress while at top → jump to About
  useEffect(() => {
    let fired = false;

    const goToAbout = () => {
      if (fired) return;
      fired = true;
      const about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: 'auto', block: 'start' });
    };

    const onWheel = (e: WheelEvent) => {
      if (fired) return;
      if (e.deltaY <= 0) return;
      if (window.scrollY > 50) return;
      e.preventDefault();
      goToAbout();
    };

    const onKey = (e: KeyboardEvent) => {
      if (fired) return;
      if (window.scrollY > 50) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToAbout();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    setShowSoundHint(false);
    setNeedsPlaybackConsent(false);
    const sectionBottom = sectionRef.current?.getBoundingClientRect().bottom ?? 0;
    if (v.paused && sectionBottom > 0) {
      v.play().catch(() => undefined);
    }
  };

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/amit1.mp4" type="video/mp4" />
      </video>

      {/* Cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      {needsPlaybackConsent && (
        <button
          onClick={playUnmuted}
          className="absolute inset-0 z-20 grid place-items-center bg-black/20 text-white backdrop-blur-[1px] transition hover:bg-black/10"
          aria-label="Start video with sound"
        >
          <span className="rounded-full border border-white/20 bg-white/10 px-7 py-3 text-xs font-bold uppercase tracking-[0.24em] shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:bg-white/20">
            Enter
          </span>
        </button>
      )}

      {/* Content layer */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Top bar */}
        <FadeIn delay={0} y={-20} className="relative">
          <div className="relative flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-md transition hover:bg-white/20 md:hidden"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-hero-menu"
            >
              <span className="flex h-3.5 w-4 flex-col justify-between" aria-hidden="true">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
              </span>
              Menu
            </button>

            <ul className="hidden items-center gap-12 md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('#') ? (
                    <a
                      href={link.href}
                      className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-white/80 transition hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-white/80 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-md transition hover:scale-[1.03] hover:bg-white/20 sm:px-5 sm:py-2.5 sm:text-xs"
            >
              Email me
            </a>

            {mobileMenuOpen && (
              <div
                id="mobile-hero-menu"
                className="absolute left-6 right-6 top-[calc(100%+0.9rem)] z-30 overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-[0_24px_70px_rgba(0,0,0,0.45)] md:hidden"
              >
                <div className="grid divide-y divide-white/10">
                  {NAV_LINKS.map((link) =>
                    link.href.startsWith('#') ? (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white/78 transition hover:bg-white/10 hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white/78 transition hover:bg-white/10 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Middle-left: PORTFOLIO + Name + Subtitle */}
        <div className="flex flex-1 items-center">
          <div className="w-full max-w-7xl px-6 md:px-10">
            <FadeIn delay={0.3} y={20}>
              <p className="mb-4 text-[10px] sm:text-xs font-medium uppercase tracking-[0.35em] text-white/60">

              </p>
            </FadeIn>

            <FadeIn delay={0.5} y={40}>
              <h1
                className="font-black uppercase leading-[0.88] tracking-tight text-white"
                style={{ fontSize: 'clamp(3rem, 12vw, 10.5rem)' }}
              >
                Amit<br />Manmode
              </h1>
            </FadeIn>

            <FadeIn delay={0.85} y={20}>
              <p className="mt-5 md:mt-7 text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-[0.3em] text-white/75">
                Developer
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-end justify-between px-6 md:px-10 pb-7 sm:pb-10 md:pb-12">
          {/* Scroll indicator */}
          <FadeIn delay={1.1} y={20}>
            <a href="#about" aria-label="Scroll to next section" className="group flex flex-col items-center gap-3">
              <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.35em] text-white/70 transition group-hover:text-white">
                Scroll
              </span>
              <div className="relative h-12 w-px overflow-hidden bg-white/20">
                <span
                  className="absolute inset-x-0 top-0 h-1/2 w-full bg-white"
                  style={{ animation: 'scrollLine 1.8s ease-in-out infinite' }}
                />
              </div>
            </a>
          </FadeIn>

          {/* Mute toggle + Sound hint */}
          <FadeIn delay={1.1} y={20}>
            <div className="flex items-center gap-3">
              {showSoundHint && (
                <span
                  className="hidden sm:inline text-[10px] font-medium uppercase tracking-[0.25em] text-white/80"
                  style={{ animation: 'pulseFade 2s ease-in-out infinite' }}
                >
                  Tap for sound
                </span>
              )}
              <button
                onClick={toggleMute}
                aria-label={muted ? 'Unmute video' : 'Mute video'}
                className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 hover:scale-110"
              >
                {muted ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
            </div>
          </FadeIn>
        </div>
      </div>

      <style>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes pulseFade {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
