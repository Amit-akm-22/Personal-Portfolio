import FadeIn from './FadeIn';
import ContactButton from './ContactButton';

const ABOUT_TEXT =
  'Second-year B.Tech Computer Science student passionate about software development, problem solving, and building impactful digital experiences. Skilled in Data Structures, Algorithms, Object-Oriented Programming, and C++, with hands-on experience in developing user-focused applications and exploring scalable system design. Enthusiastic about creating clean, efficient, and intuitive solutions while collaborating with teams to turn ideas into real-world projects.';

const iconUrl = (path: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${path}`;

const decorImages = [
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
    className: 'left-[5%] top-[13%] w-20 md:w-32',
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
    className: 'right-[6%] top-[12%] w-20 md:w-32',
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
    className: 'bottom-[7%] right-[8%] w-24 md:w-40',
  },
];

const highlights = ['B.Tech CSE', 'MERN stack', 'DSA & OOP', 'Product-minded UI'];

const skillGroups = [
  {
    label: 'Languages',
    items: [
      { name: 'C++', icon: iconUrl('cplusplus/cplusplus-original.svg') },
      { name: 'JavaScript', icon: iconUrl('javascript/javascript-original.svg') },
      { name: 'Python', icon: iconUrl('python/python-original.svg') },
      { name: 'HTML', icon: iconUrl('html5/html5-original.svg') },
      { name: 'CSS', icon: iconUrl('css3/css3-original.svg') },
    ],
  },
  {
    label: 'Databases',
    items: [
      { name: 'MongoDB', icon: iconUrl('mongodb/mongodb-original.svg') },
      { name: 'MySQL', icon: iconUrl('mysql/mysql-original.svg') },
      { name: 'SQL', icon: iconUrl('azuresqldatabase/azuresqldatabase-original.svg') },
    ],
  },
  {
    label: 'Frameworks & Libraries',
    items: [
      { name: 'React.js', icon: iconUrl('react/react-original.svg') },
      { name: 'Node.js', icon: iconUrl('nodejs/nodejs-original.svg') },
      { name: 'Express.js', icon: iconUrl('express/express-original.svg') },
      { name: 'Tailwind CSS', icon: iconUrl('tailwindcss/tailwindcss-original.svg') },
      { name: 'Bootstrap', icon: iconUrl('bootstrap/bootstrap-original.svg') },
      { name: 'Socket.IO', icon: iconUrl('socketio/socketio-original.svg') },
      { name: 'EJS', icon: iconUrl('embeddedc/embeddedc-original.svg') },
    ],
  },
  {
    label: 'Tools & Technologies',
    items: [
      { name: 'Git', icon: iconUrl('git/git-original.svg') },
      { name: 'GitHub', icon: iconUrl('github/github-original.svg') },
      { name: 'JWT', icon: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/jsonwebtokens.svg' },
      { name: 'Cloudinary', icon: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/cloudinary.svg' },
      { name: 'Postman', icon: iconUrl('postman/postman-original.svg') },
      { name: 'Nodemailer', icon: iconUrl('nodemon/nodemon-original.svg') },
      { name: 'Axios', icon: iconUrl('axios/axios-plain.svg') },
    ],
  },
];

const SkillCard = ({ name, icon }: { name: string; icon: string }) => {
  const monochromeIcon = name === 'JWT' || name === 'Cloudinary';

  return (
  <div className="group flex h-[104px] w-[100px] shrink-0 flex-col items-center justify-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-2 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.065] hover:shadow-[0_18px_42px_rgba(0,0,0,0.28)]">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <img
        src={icon}
        alt={name}
        className={`h-9 w-9 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] ${monochromeIcon ? 'invert opacity-85' : ''}`}
        loading="lazy"
        draggable={false}
      />
    </div>
    <span className="max-w-full text-center text-[11px] font-semibold leading-tight text-[#D7E2EA]/70 transition-colors group-hover:text-[#D7E2EA]">
      {name}
    </span>
  </div>
  );
};

const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative min-h-screen w-full overflow-hidden bg-[#0C0C0C] px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28"
    >
      {decorImages.map((image, index) => (
        <FadeIn
          key={image.src}
          delay={0.12 + index * 0.08}
          x={index === 1 ? 40 : -40}
          duration={0.9}
          className={`pointer-events-none absolute hidden opacity-30 saturate-75 lg:block ${image.className}`}
        >
          <img src={image.src} alt="" className="h-auto w-full" loading="lazy" draggable={false} />
        </FadeIn>
      ))}

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12">
        <FadeIn y={36}>
          <div className="mx-auto max-w-5xl text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#D7E2EA]/25">
              Profile
            </span>
            <h2
              className="hero-heading mt-5 font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 12vw, 150px)' }}
            >
              About me
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} y={28}>
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div className="border-l border-[#D7E2EA]/14 pl-5 sm:pl-7">
              <p
                className="max-w-3xl text-left font-medium leading-relaxed text-[#D7E2EA]/82"
                style={{ fontSize: 'clamp(1rem, 1.45vw, 1.18rem)' }}
              >
                {ABOUT_TEXT}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D7E2EA]/55">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.18} y={28}>
          <div className="mx-auto w-full max-w-6xl space-y-7">
            {skillGroups.map((group) => (
              <div
                key={group.label}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-4 sm:p-5"
              >
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#D7E2EA]/35">
                    {group.label}
                  </span>
                  <span className="h-px flex-1 bg-white/[0.07]" />
                </div>

                <div className="flex flex-wrap gap-3">
                  {group.items.map((item) => (
                    <SkillCard key={item.name} name={item.name} icon={item.icon} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.25} y={20} className="flex justify-center">
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};

export default AboutSection;
