import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FadeIn from './FadeIn';
import { BLOGS } from '../data/blogs';
import { getPortfolioContent } from '../lib/api';

const BlogSection = () => {
  const [blogs, setBlogs] = useState<typeof BLOGS>([]);

  useEffect(() => {
    getPortfolioContent().then((content) => setBlogs(content.blogs));
  }, []);

  return (
    <section
      id="blog"
      className="relative z-10 w-full min-h-screen bg-[#111111] px-4 sm:px-6 md:px-10 pt-16 sm:pt-20 md:pt-24 pb-40"
    >
      <FadeIn y={40}>
        <div className="mb-16 sm:mb-20 md:mb-28 flex flex-col items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#D7E2EA]/25 font-medium">
            Notes & Ideas
          </span>
          <h2
            className="hero-heading text-center font-black uppercase tracking-tight leading-none text-[#D7E2EA]"
            style={{ fontSize: 'clamp(3rem, 12vw, 120px)' }}
          >
            Blog
          </h2>
          <div className="flex items-center gap-4 mt-1">
            <div className="h-px w-12 bg-[#D7E2EA]/10" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D7E2EA]/20">
              {blogs.length} posts
            </span>
            <div className="h-px w-12 bg-[#D7E2EA]/10" />
          </div>
        </div>
      </FadeIn>

      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {blogs.map((blog, i) => (
            <FadeIn key={blog.id} delay={i * 0.1} y={30}>
              <article className="flex h-full min-h-[430px] flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1A1A1A] transition-transform duration-300 hover:-translate-y-2">
                <div
                  className="flex min-h-[190px] flex-col justify-between bg-[#0C0C0C] p-6"
                  style={{
                    background: `linear-gradient(135deg, ${blog.accent}24, #0C0C0C 52%, #181818)`,
                  }}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.3em] text-white/35">
                    <span>{blog.number}</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <div>
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                      {blog.category}
                    </p>
                    <h3 className="text-2xl font-black uppercase leading-tight tracking-tight text-white sm:text-3xl">
                      {blog.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                    {blog.date}
                  </div>

                  <p className="mb-6 flex-1 text-sm font-light leading-relaxed text-white/50">
                    {blog.excerpt}
                  </p>

                  <div className="mb-8 flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[10px] font-medium tracking-wide text-white/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/blog/${blog.id}`}
                    className="mt-auto flex items-center justify-center rounded-lg border border-white/20 bg-transparent px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
                  >
                    Read Blog &rarr;
                  </Link>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
