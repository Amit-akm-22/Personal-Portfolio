import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FadeIn from '../components/FadeIn';
import { BLOGS } from '../data/blogs';
import { getPortfolioContent } from '../lib/api';

const BlogDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [blogs, setBlogs] = useState<typeof BLOGS>([]);
  const [loading, setLoading] = useState(true);
  const blog = blogs.find((item) => item.id === id);

  useEffect(() => {
    getPortfolioContent()
      .then((content) => setBlogs(content.blogs))
      .finally(() => setLoading(false));
  }, []);

  if (!blog && loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#0C0C0C] text-white">Loading...</main>;
  }

  if (!blog) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0C0C0C] px-6 text-white">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Blog Not Found</h1>
          <Link to="/blog" className="text-white/60 underline transition hover:text-white">
            Return to Blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0C0C0C] pb-32 text-white">
      <nav className="relative z-50 flex w-full items-center gap-8 px-6 py-8 md:px-10">
        <Link
          to="/blog"
          className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/60 transition hover:text-white sm:text-sm"
        >
          <span aria-hidden="true">&larr;</span> Back to Blog
        </Link>
      </nav>

      <article className="mx-auto mt-8 max-w-4xl px-6 md:mt-16 md:px-10">
        <FadeIn y={20}>
          <header
            className="mb-12 rounded-2xl border border-white/[0.06] bg-[#151515] p-7 sm:p-10"
            style={{
              background: `linear-gradient(135deg, ${blog.accent}24, #151515 48%, #0C0C0C)`,
            }}
          >
            <div className="mb-10 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
              <span>{blog.category}</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>{blog.date}</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>{blog.readTime}</span>
            </div>

            <h1
              className="font-black uppercase leading-none tracking-tight text-white"
              style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)' }}
            >
              {blog.title}
            </h1>

            <p className="mt-8 max-w-3xl text-base font-light leading-relaxed text-white/70 md:text-lg">
              {blog.intro}
            </p>
          </header>
        </FadeIn>

        <FadeIn delay={0.15} y={20}>
          <div className="mb-12 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </FadeIn>

        <div className="space-y-12">
          {blog.sections.map((section, index) => (
            <FadeIn key={section.heading} delay={0.1 + index * 0.08} y={20}>
              <section>
                <h2 className="mb-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {section.heading}
                </h2>
                <p className="text-base font-light leading-8 text-white/65 md:text-lg">
                  {section.body}
                </p>
              </section>
            </FadeIn>
          ))}
        </div>
      </article>
    </main>
  );
};

export default BlogDetailsPage;
