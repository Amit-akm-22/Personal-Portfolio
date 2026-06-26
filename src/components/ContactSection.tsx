import { useEffect, useState, FormEvent } from 'react';
import { Mail, Phone, Send, Loader2 } from 'lucide-react';
import FadeIn from './FadeIn';
import { getPortfolioContent, ProfileData } from '../lib/api';

const ContactSection = () => {
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
    
    // Fallback: If you don't have a backend mailer, open mailto link
    // We will just simulate a sending state then open mail client
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

  return (
    <section id="contact" className="relative w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-16 sm:pt-20 md:pt-24 pb-16">
      <div className="mx-auto max-w-[1200px]">
        
        {/* Header Area */}
        <div className="mb-16 md:mb-24">
          <FadeIn y={20}>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-500 mb-4">
              Get in touch
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-black tracking-tight text-white leading-[1.1] mb-6 max-w-3xl">
              Let's Build Something<br className="hidden sm:block" /> Extraordinary
            </h2>
            <p className="text-sm sm:text-base text-white/50 leading-relaxed max-w-2xl font-medium">
              I'm always excited to hear about new challenges and creative ideas. Whether you have a specific
              project in mind or just want to explore a shared vision, feel free to drop me a message.
            </p>
          </FadeIn>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Side: Contact Channels */}
          <div className="lg:col-span-5 flex flex-col gap-8 lg:gap-12">
            <FadeIn delay={0.1} y={20}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                <h3 className="text-lg font-black uppercase tracking-widest text-white">
                  Contact Channels
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                {/* Email */}
                <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.location.href = `mailto:${profile?.email}`}>
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-white/[0.06] bg-[#14151A] text-white/60 transition-all duration-300 group-hover:bg-[#1A1C23] group-hover:text-blue-400 group-hover:border-blue-500/30">
                    <Mail size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Email Address</p>
                    <p className="text-base sm:text-lg font-bold text-white tracking-wide transition-colors group-hover:text-blue-100">
                      {profile?.email || 'Loading...'}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.location.href = `tel:${profile?.phone}`}>
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-white/[0.06] bg-[#14151A] text-white/60 transition-all duration-300 group-hover:bg-[#1A1C23] group-hover:text-blue-400 group-hover:border-blue-500/30">
                    <Phone size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Phone Number</p>
                    <p className="text-base sm:text-lg font-bold text-white tracking-wide transition-colors group-hover:text-blue-100">
                      {profile?.phone || 'Loading...'}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Side: Contact Form */}
          <div className="lg:col-span-7">
            <FadeIn delay={0.2} y={30}>
              <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/[0.04] bg-[#121318] p-6 sm:p-8 md:p-10 shadow-[0_24px_58px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col gap-6">
                  
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Your Name</span>
                    <input 
                      required
                      name="name"
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full rounded-xl border border-white/[0.06] bg-[#18191E] px-5 py-4 text-sm font-medium text-white placeholder:text-white/20 outline-none transition focus:border-blue-500/50 focus:bg-[#1A1C23]"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Your Email</span>
                    <input 
                      required
                      name="email"
                      type="email" 
                      placeholder="email@address.com" 
                      className="w-full rounded-xl border border-white/[0.06] bg-[#18191E] px-5 py-4 text-sm font-medium text-white placeholder:text-white/20 outline-none transition focus:border-blue-500/50 focus:bg-[#1A1C23]"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Your Message</span>
                    <textarea 
                      required
                      name="message"
                      rows={4}
                      placeholder="How can I help you?" 
                      className="w-full resize-y rounded-xl border border-white/[0.06] bg-[#18191E] px-5 py-4 text-sm font-medium leading-relaxed text-white placeholder:text-white/20 outline-none transition focus:border-blue-500/50 focus:bg-[#1A1C23]"
                    />
                  </label>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={sending}
                      className="group flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-gray-100 disabled:opacity-70"
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

        {/* Footer info */}
        <FadeIn delay={0.4} y={20}>
          <div className="mx-auto mt-20 sm:mt-24 md:mt-32 flex flex-col items-center gap-3 border-t border-white/[0.05] pt-8 text-center sm:flex-row sm:justify-between">
            <span className="font-bold uppercase tracking-widest text-white/30 text-[10px]">
              © {new Date().getFullYear()} Amit Manmode
            </span>
            <span className="font-bold uppercase tracking-widest text-white/30 text-[10px]">
              Designed & built in Pandhurna
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default ContactSection;
