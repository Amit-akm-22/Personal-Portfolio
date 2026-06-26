import { useEffect, useState, FormEvent } from 'react';
import { Mail, Phone, Send, Loader2 } from 'lucide-react';
import FadeIn from './FadeIn';
import { getPortfolioContent, ProfileData } from '../lib/api';

const ConnectSection = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    getPortfolioContent().then((content) => setProfile(content.profile));
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setStatus('');
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const message = formData.get('message');
    
    setTimeout(() => {
      setSending(false);
      setStatus('Opening mail client...');
      window.location.href = `mailto:${profile?.email || 'amit.akm.work@gmail.com'}?subject=Portfolio Contact from ${name}&body=${message}`;
      
      setTimeout(() => setStatus(''), 3000);
    }, 800);
  };

  if (!profile) return null;

  return (
    <section className="relative z-10 w-full min-h-screen bg-[#111111] px-4 sm:px-6 md:px-10 pt-16 sm:pt-20 md:pt-24 pb-20">
      <FadeIn y={40}>
        <div className="mb-16 sm:mb-20 md:mb-28 flex flex-col items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#D7E2EA]/25 font-medium">
            Connect
          </span>
          <h2
            className="hero-heading text-center font-black uppercase tracking-tight leading-none text-[#D7E2EA]"
            style={{ fontSize: 'clamp(3rem, 12vw, 120px)' }}
          >
            Digitally
          </h2>
          <div className="flex items-center gap-4 mt-1">
            <div className="h-px w-12 bg-[#D7E2EA]/10" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D7E2EA]/20">
              Profiles
            </span>
            <div className="h-px w-12 bg-[#D7E2EA]/10" />
          </div>
        </div>
      </FadeIn>

      <div className="mx-auto max-w-[1400px]">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 mb-32">
          {/* GitHub Card */}
          <FadeIn delay={0.1} y={30} className="w-full">
            <div className="flex flex-col bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/[0.06] h-full p-6 sm:p-8 md:p-10 transition-transform duration-300 hover:-translate-y-2 group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-2xl font-black tracking-widest text-[#D7E2EA] uppercase">GitHub</h3>
                  <p className="text-[11px] font-bold tracking-[0.2em] text-[#D7E2EA]/40 uppercase mt-1">Explore my code</p>
                </div>
                <a
                  href={profile.githubUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#D7E2EA] px-6 py-3 text-[11px] font-black uppercase tracking-widest text-[#111111] transition-transform hover:scale-105 inline-flex justify-center"
                >
                  Visit GitHub
                </a>
              </div>
              <div className="w-full overflow-hidden rounded-xl border border-white/[0.06] bg-black shadow-inner aspect-[4/3] sm:aspect-auto sm:h-[350px]">
                {profile.githubImage ? (
                  <img src={profile.githubImage} alt="GitHub Profile" className="w-full h-full object-cover object-top opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#D7E2EA]/20 text-sm font-bold tracking-widest uppercase">
                    No Image Set
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          {/* LinkedIn Card */}
          <FadeIn delay={0.2} y={30} className="w-full">
            <div className="flex flex-col bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/[0.06] h-full p-6 sm:p-8 md:p-10 transition-transform duration-300 hover:-translate-y-2 group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-2xl font-black tracking-widest text-[#D7E2EA] uppercase">LinkedIn</h3>
                  <p className="text-[11px] font-bold tracking-[0.2em] text-[#D7E2EA]/40 uppercase mt-1">Connect with me</p>
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
              <div className="w-full overflow-hidden rounded-xl border border-white/[0.06] bg-black shadow-inner aspect-[4/3] sm:aspect-auto sm:h-[350px]">
                {profile.linkedinImage ? (
                  <img src={profile.linkedinImage} alt="LinkedIn Profile" className="w-full h-full object-cover object-top opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#D7E2EA]/20 text-sm font-bold tracking-widest uppercase">
                    No Image Set
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Contact Form Area */}
        <div className="mb-16 sm:mb-20 md:mb-28 flex flex-col items-center gap-4 mt-32">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#D7E2EA]/25 font-medium">
            Send a Message
          </span>
          <h2
            className="hero-heading text-center font-black uppercase tracking-tight leading-none text-[#D7E2EA]"
            style={{ fontSize: 'clamp(3rem, 12vw, 120px)' }}
          >
            Get In Touch
          </h2>
          <div className="flex items-center gap-4 mt-1">
            <div className="h-px w-12 bg-[#D7E2EA]/10" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D7E2EA]/20">
              Let's Talk
            </span>
            <div className="h-px w-12 bg-[#D7E2EA]/10" />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start mb-20">
          <div className="lg:col-span-5 flex flex-col gap-8 lg:gap-12">
            <FadeIn delay={0.1} y={20}>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.location.href = `mailto:${profile?.email}`}>
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-white/[0.06] bg-[#1A1A1A] text-[#D7E2EA]/60 transition-all duration-300 group-hover:bg-[#222222] group-hover:text-[#7EB8F7] group-hover:border-[#7EB8F7]/30">
                    <Mail size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D7E2EA]/30 mb-1">Email Address</p>
                    <p className="text-base sm:text-lg font-bold text-[#D7E2EA] tracking-wide transition-colors group-hover:text-[#7EB8F7]">
                      {profile?.email || 'Loading...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.location.href = `tel:${profile?.phone}`}>
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-white/[0.06] bg-[#1A1A1A] text-[#D7E2EA]/60 transition-all duration-300 group-hover:bg-[#222222] group-hover:text-[#7EB8F7] group-hover:border-[#7EB8F7]/30">
                    <Phone size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D7E2EA]/30 mb-1">Phone Number</p>
                    <p className="text-base sm:text-lg font-bold text-[#D7E2EA] tracking-wide transition-colors group-hover:text-[#7EB8F7]">
                      {profile?.phone || 'Loading...'}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-7">
            <FadeIn delay={0.2} y={30}>
              <form onSubmit={handleSubmit} className="flex flex-col bg-[#1A1A1A] rounded-2xl border border-white/[0.06] p-6 sm:p-8 md:p-10 transition-transform duration-300 hover:-translate-y-2">
                <div className="flex flex-col gap-6">
                  
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D7E2EA]/40">Your Name</span>
                    <input 
                      required
                      name="name"
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full rounded-xl border border-white/[0.06] bg-black px-5 py-4 text-sm font-medium text-[#D7E2EA] placeholder:text-[#D7E2EA]/20 outline-none transition focus:border-[#7EB8F7]/50 focus:bg-[#111111]"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D7E2EA]/40">Your Email</span>
                    <input 
                      required
                      name="email"
                      type="email" 
                      placeholder="email@address.com" 
                      className="w-full rounded-xl border border-white/[0.06] bg-black px-5 py-4 text-sm font-medium text-[#D7E2EA] placeholder:text-[#D7E2EA]/20 outline-none transition focus:border-[#7EB8F7]/50 focus:bg-[#111111]"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D7E2EA]/40">Your Message</span>
                    <textarea 
                      required
                      name="message"
                      rows={4}
                      placeholder="How can I help you?" 
                      className="w-full resize-y rounded-xl border border-white/[0.06] bg-black px-5 py-4 text-sm font-medium leading-relaxed text-[#D7E2EA] placeholder:text-[#D7E2EA]/20 outline-none transition focus:border-[#7EB8F7]/50 focus:bg-[#111111]"
                    />
                  </label>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={sending}
                      className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#D7E2EA] px-6 py-4 text-xs font-black uppercase tracking-widest text-[#111111] transition-all hover:opacity-90 disabled:opacity-70"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="animate-spin" size={18} /> Sending...
                        </>
                      ) : status ? (
                        status
                      ) : (
                        <>
                          Send Message
                          <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
