import cors from 'cors';
import express from 'express';
import fs from 'fs/promises';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(rootDir, 'public', 'uploads');

const app = express();
const port = process.env.PORT || 4000;

const files = {
  projects: path.join(dataDir, 'projects.json'),
  achievements: path.join(dataDir, 'achievements.json'),
  certificates: path.join(dataDir, 'certificates.json'),
  blogs: path.join(dataDir, 'blogs.json'),
  education: path.join(dataDir, 'education.json'),
};

await fs.mkdir(dataDir, { recursive: true });
await fs.mkdir(uploadsDir, { recursive: true });

async function ensureJson(file) {
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, '[]', 'utf8');
  }
}

await Promise.all(Object.values(files).map(ensureJson));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '-');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

const readItems = async (type) => JSON.parse(await fs.readFile(files[type], 'utf8'));
const writeItems = async (type, items) => {
  await fs.writeFile(files[type], JSON.stringify(items, null, 2), 'utf8');
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const splitList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const splitTechList = (value) => {
  const text = String(value || '').trim();
  if (!text) return [];
  if (text.includes(',')) return splitList(text);

  const compoundTech = new Set(['Tailwind CSS']);
  const words = text.split(/\s+/).filter(Boolean);
  const items = [];

  for (let index = 0; index < words.length; index += 1) {
    const pair = `${words[index]} ${words[index + 1] || ''}`.trim();

    if (compoundTech.has(pair)) {
      items.push(pair);
      index += 1;
    } else {
      items.push(words[index]);
    }
  }

  return items;
};

const uploadPath = (file) => (file ? `/uploads/${file.filename}` : '');
const uploadedPaths = (files = []) => files.map(uploadPath).filter(Boolean);

const renumber = (items) =>
  items.map((item, index) => ({
    ...item,
    number: String(index + 1).padStart(2, '0'),
  }));

const buildProject = (body, files = {}, existing = {}, count = 0) => {
  const heroImage = uploadPath(files?.heroImage?.[0]);
  const galleryImages = uploadedPaths(files?.galleryImages);
  const name = body.name || existing.name || 'Untitled Project';
  const nextHero = heroImage || existing.heroImage || galleryImages[0] || '';
  const nextGallery = galleryImages.length ? galleryImages : existing.galleryImages || (nextHero ? [nextHero] : []);

  return {
    ...existing,
    id: existing.id || slugify(body.id || name),
    number: existing.number || String(count + 1).padStart(2, '0'),
    category: body.category || existing.category || 'Project',
    name,
    description: body.description || existing.description || '',
    impact: body.impact || existing.impact || '',
    liveUrl: body.liveUrl || existing.liveUrl || '#',
    githubUrl: body.githubUrl || existing.githubUrl || '#',
    tech: splitTechList(body.tech).length ? splitTechList(body.tech) : existing.tech || [],
    heroImage: nextHero,
    galleryImages: nextGallery,
    col1Image2: nextGallery[1] || nextHero || '',
    col2Image: nextGallery[2] || nextGallery[0] || nextHero || '',
    accent: body.accent || existing.accent || '#7EB8F7',
    year: body.year || existing.year || new Date().getFullYear().toString(),
  };
};

const buildAchievement = (body, file, existing = {}, count = 0) => {
  const title = body.title || existing.title || 'Untitled Achievement';

  return {
    ...existing,
    id: existing.id || slugify(body.id || title),
    number: existing.number || String(count + 1).padStart(2, '0'),
    title,
    issuer: body.issuer || existing.issuer || '',
    date: body.date || existing.date || new Date().getFullYear().toString(),
    category: body.category || existing.category || 'Achievement',
    summary: body.summary || existing.summary || '',
    details: body.details || existing.details || '',
    highlights: splitList(body.highlights).length ? splitList(body.highlights) : existing.highlights || [],
    skills: splitList(body.skills).length ? splitList(body.skills) : existing.skills || [],
    certificateUrl: body.certificateUrl || existing.certificateUrl || '',
    image: uploadPath(file) || existing.image || '',
    accent: body.accent || existing.accent || '#4ADE80',
  };
};

const buildCertificate = (body, file, existing = {}, count = 0) => {
  const title = body.title || existing.title || 'Untitled Certificate';

  return {
    ...existing,
    id: existing.id || slugify(body.id || title),
    number: existing.number || String(count + 1).padStart(2, '0'),
    title,
    issuer: body.issuer || existing.issuer || '',
    date: body.date || existing.date || new Date().getFullYear().toString(),
    category: body.category || existing.category || 'Certificate',
    summary: body.summary || existing.summary || '',
    details: body.details || existing.details || '',
    highlights: splitList(body.highlights).length ? splitList(body.highlights) : existing.highlights || [],
    skills: splitList(body.skills).length ? splitList(body.skills) : existing.skills || [],
    certificateUrl: body.certificateUrl || existing.certificateUrl || '',
    image: uploadPath(file) || existing.image || '',
    accent: body.accent || existing.accent || '#38BDF8',
  };
};

const buildEducation = (body, file, existing = {}, count = 0) => {
  const college = body.college || existing.college || 'Untitled College';

  return {
    ...existing,
    id: existing.id || slugify(body.id || college),
    number: existing.number || String(count + 1).padStart(2, '0'),
    college,
    degree: body.degree || existing.degree || '',
    branch: body.branch || existing.branch || '',
    year: body.year || existing.year || new Date().getFullYear().toString(),
    score: body.score || existing.score || '',
    logo: uploadPath(file) || existing.logo || '',
    accent: body.accent || existing.accent || '#F59E0B',
  };
};

const buildBlog = (body, file, existing = {}, count = 0) => {
  const title = body.title || existing.title || 'Untitled Blog';
  const sectionHeadings = splitList(body.sectionHeadings);
  const sectionBodies = String(body.sectionBodies || '')
    .split('\n---\n')
    .map((item) => item.trim())
    .filter(Boolean);
  const sections = sectionHeadings.length
    ? sectionHeadings.map((heading, index) => ({
        heading,
        body: sectionBodies[index] || '',
      }))
    : existing.sections || [];

  return {
    ...existing,
    id: existing.id || slugify(body.id || title),
    number: existing.number || String(count + 1).padStart(2, '0'),
    title,
    category: body.category || existing.category || 'Blog',
    date: body.date || existing.date || new Date().getFullYear().toString(),
    readTime: body.readTime || existing.readTime || '3 min read',
    excerpt: body.excerpt || existing.excerpt || '',
    intro: body.intro || existing.intro || '',
    coverImage: uploadPath(file) || existing.coverImage || '',
    sections,
    tags: splitList(body.tags).length ? splitList(body.tags) : existing.tags || [],
    accent: body.accent || existing.accent || '#A78BFA',
  };
};

app.get('/api/content', async (_req, res) => {
  const [projects, achievements, certificates, blogs, education] = await Promise.all([
    readItems('projects'),
    readItems('achievements'),
    readItems('certificates'),
    readItems('blogs'),
    readItems('education'),
  ]);

  res.json({ projects, achievements, certificates, blogs, education });
});

app.get('/api/:type', async (req, res) => {
  const { type } = req.params;
  if (!files[type]) return res.status(404).json({ message: 'Unknown content type' });
  res.json(await readItems(type));
});

app.post(
  '/api/projects',
  upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 8 },
  ]),
  async (req, res) => {
    const items = await readItems('projects');
    const project = buildProject(req.body, req.files, {}, items.length);

    items.unshift(project);
    await writeItems('projects', renumber(items));
    res.status(201).json(project);
  }
);

app.post('/api/achievements', upload.single('image'), async (req, res) => {
  const items = await readItems('achievements');
  const achievement = buildAchievement(req.body, req.file, {}, items.length);

  items.unshift(achievement);
  await writeItems('achievements', renumber(items));
  res.status(201).json(achievement);
});

app.post('/api/certificates', upload.single('image'), async (req, res) => {
  const items = await readItems('certificates');
  const certificate = buildCertificate(req.body, req.file, {}, items.length);

  items.unshift(certificate);
  await writeItems('certificates', renumber(items));
  res.status(201).json(certificate);
});

app.post('/api/blogs', upload.single('coverImage'), async (req, res) => {
  const items = await readItems('blogs');
  const blog = buildBlog(req.body, req.file, {}, items.length);

  items.unshift(blog);
  await writeItems('blogs', renumber(items));
  res.status(201).json(blog);
});

app.post('/api/education', upload.single('logo'), async (req, res) => {
  const items = await readItems('education');
  const education = buildEducation(req.body, req.file, {}, items.length);

  items.unshift(education);
  await writeItems('education', renumber(items));
  res.status(201).json(education);
});

app.put(
  '/api/projects/:id',
  upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 8 },
  ]),
  async (req, res) => {
    const items = await readItems('projects');
    const index = items.findIndex((item) => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Project not found' });

    items[index] = buildProject(req.body, req.files, items[index], index);
    await writeItems('projects', renumber(items));
    res.json(items[index]);
  }
);

app.put('/api/achievements/:id', upload.single('image'), async (req, res) => {
  const items = await readItems('achievements');
  const index = items.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Achievement not found' });

  items[index] = buildAchievement(req.body, req.file, items[index], index);
  await writeItems('achievements', renumber(items));
  res.json(items[index]);
});

app.put('/api/certificates/:id', upload.single('image'), async (req, res) => {
  const items = await readItems('certificates');
  const index = items.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Certificate not found' });

  items[index] = buildCertificate(req.body, req.file, items[index], index);
  await writeItems('certificates', renumber(items));
  res.json(items[index]);
});

app.put('/api/blogs/:id', upload.single('coverImage'), async (req, res) => {
  const items = await readItems('blogs');
  const index = items.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Blog not found' });

  items[index] = buildBlog(req.body, req.file, items[index], index);
  await writeItems('blogs', renumber(items));
  res.json(items[index]);
});

app.put('/api/education/:id', upload.single('logo'), async (req, res) => {
  const items = await readItems('education');
  const index = items.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Education not found' });

  items[index] = buildEducation(req.body, req.file, items[index], index);
  await writeItems('education', renumber(items));
  res.json(items[index]);
});

app.patch('/api/:type/reorder', async (req, res) => {
  const { type } = req.params;
  if (!files[type]) return res.status(404).json({ message: 'Unknown content type' });

  const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
  const items = await readItems(type);
  const itemsById = new Map(items.map((item) => [item.id, item]));
  const uniqueIds = new Set(ids);
  const hasEveryItem = ids.length === items.length && uniqueIds.size === items.length && ids.every((id) => itemsById.has(id));

  if (!hasEveryItem) {
    return res.status(400).json({ message: 'Reorder list must include every item id exactly once' });
  }

  const nextItems = ids.map((id) => itemsById.get(id));
  await writeItems(type, renumber(nextItems));
  res.json(renumber(nextItems));
});

app.delete('/api/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  if (!files[type]) return res.status(404).json({ message: 'Unknown content type' });

  const items = await readItems(type);
  const nextItems = items.filter((item) => item.id !== id);
  if (nextItems.length === items.length) return res.status(404).json({ message: 'Item not found' });

  await writeItems(type, renumber(nextItems));
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Admin API running on http://localhost:${port}`);
});
