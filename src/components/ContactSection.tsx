import { Mail, MessageCircle, Linkedin, Github, ArrowUpRight } from 'lucide-react';
import FadeIn from './FadeIn';

interface ContactMethod {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
  accent: string;
}

const CONTACT_METHODS: ContactMethod[] = [
  {
    icon: Mail,
    label: 'Email',
    value: 'amit.akm.work@gmail.com',
    href: 'mailto:amit.akm.work@gmail.com',
    accent: '#7EB8F7',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+91 6264677098',
    href: 'https://wa.me/6264677098',
    accent: '#4ADE80',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'in/harsh-goyal-7900b2256',
    href: 'https://www.linkedin.com/in/amit-manmode',
    accent: '#60A5FA',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: '@harshgoyal27',
    href: 'https://github.com/Amit-akm-22',
    accent: '#D7E2EA',
  },
];

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="relative w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20"
    >
      <FadeIn y={40}>
        <h2
          className="hero-heading text-center font-black uppercase tracking-tight leading-none mb-4"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Get in touch
        </h2>
      </FadeIn>

      <FadeIn delay={0.15} y={20}>
        <p
          className="text-center font-light uppercase tracking-widest text-[#D7E2EA]/60 mb-12 sm:mb-16 md:mb-20"
          style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)' }}
        >
          Pick whichever channel suits you
        </p>
      </FadeIn>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {CONTACT_METHODS.map((method, i) => {
          const Icon = method.icon;
          const isExternal = method.href.startsWith('http');

          return (
            <FadeIn key={method.label} delay={i * 0.1} y={30}>
              <a
                href={method.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="group relative flex h-full min-h-[260px] flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-[#D7E2EA]/20 bg-[#141418] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 hover:-translate-y-2 hover:border-[#D7E2EA]/55 hover:bg-[#191A20] hover:shadow-[0_28px_80px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-7 md:p-8"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${method.accent}, transparent)`,
                  }}
                />

                <div className="relative flex items-start justify-between">
                  <div
                    className="relative grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-[#202126] shadow-[0_16px_28px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-10px_20px_rgba(0,0,0,0.22)] transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-[-2deg] group-hover:scale-105"
                    style={{ color: method.accent }}
                  >
                    <div className="absolute inset-1 rounded-[14px] border border-white/5 bg-white/[0.03]" />
                    <Icon
                      className="relative drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)]"
                      size={27}
                      strokeWidth={1.8}
                    />
                  </div>

                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[#D7E2EA]/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-white/20 group-hover:text-[#D7E2EA]">
                    <ArrowUpRight
                      className="transition-transform duration-300 group-hover:rotate-12"
                      size={20}
                      strokeWidth={1.7}
                    />
                  </span>
                </div>

                <div className="relative flex flex-col gap-2 sm:gap-3">
                  <span
                    className="font-medium uppercase tracking-widest text-[#D7E2EA]/45"
                    style={{ fontSize: 'clamp(0.7rem, 1.1vw, 0.9rem)' }}
                  >
                    {method.label}
                  </span>
                  <span
                    className="break-words font-bold leading-snug text-[#D7E2EA]"
                    style={{ fontSize: 'clamp(1rem, 1.8vw, 1.4rem)' }}
                  >
                    {method.value}
                  </span>
                </div>
              </a>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.4} y={20}>
        <div className="mx-auto mt-20 flex max-w-5xl flex-col items-center gap-3 border-t border-[#D7E2EA]/10 pt-8 text-center sm:mt-24 sm:flex-row sm:justify-between md:mt-28">
          <span
            className="font-light uppercase tracking-widest text-[#D7E2EA]/50"
            style={{ fontSize: 'clamp(0.7rem, 1.1vw, 0.9rem)' }}
          >
            © 2026 Amit Manmode
          </span>
          <span
            className="font-light uppercase tracking-widest text-[#D7E2EA]/50"
            style={{ fontSize: 'clamp(0.7rem, 1.1vw, 0.9rem)' }}
          >
            Designed & built in Pandhurna
          </span>
        </div>
      </FadeIn>
    </section>
  );
};

export default ContactSection;
