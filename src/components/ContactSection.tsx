import { Mail, MessageCircle, Linkedin, Github } from 'lucide-react';
import FadeIn from './FadeIn';

interface ContactMethod {
  icon: typeof Mail;
  label: string;
  href: string;
  accent: string;
}

const CONTACT_METHODS: ContactMethod[] = [
  {
    icon: Mail,
    label: 'Email',
    href: 'mailto:amit.akm.work@gmail.com',
    accent: '#7EB8F7',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    href: 'https://wa.me/6264677098',
    accent: '#4ADE80',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/amit-manmode',
    accent: '#60A5FA',
  },
  {
    icon: Github,
    label: 'GitHub',
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

      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-5 sm:gap-7">
        {CONTACT_METHODS.map((method, i) => {
          const Icon = method.icon;
          const isExternal = method.href.startsWith('http');

          return (
            <FadeIn key={method.label} delay={i * 0.1} y={30}>
              <a
              href={method.href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
                aria-label={method.label}
                title={method.label}
                className="group relative grid h-20 w-20 place-items-center rounded-[1.35rem] border border-white/10 bg-[#18191E] shadow-[0_18px_38px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-16px_24px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-2 hover:rotate-[-2deg] hover:border-white/25 hover:bg-[#202126] hover:shadow-[0_28px_56px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.22)] sm:h-24 sm:w-24"
                style={{ color: method.accent }}
              >
                <span
                  className="pointer-events-none absolute inset-x-3 top-0 h-px opacity-75"
                  style={{ background: `linear-gradient(90deg, transparent, ${method.accent}, transparent)` }}
                />
                <span className="absolute inset-2 rounded-[1rem] border border-white/[0.06] bg-white/[0.025] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
                <Icon
                  className="relative drop-shadow-[0_10px_14px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:scale-110"
                  size={34}
                  strokeWidth={1.75}
                />
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
