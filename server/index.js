import 'dotenv/config';
import cors from 'cors';
import crypto from 'crypto';
import express from 'express';
import fs from 'fs/promises';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// ─── Paths ────────────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');

// ─── Cloudinary Config ────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate Cloudinary config at startup
const cloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (!cloudinaryConfigured) {
  console.warn(
    '⚠️  Cloudinary env vars not set. Image uploads will not work.'
  );
}

// ─── Express Setup ────────────────────────────────────────────────────────────
const app = express();
const port = process.env.PORT || 4000;
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
const adminSessions = new Set();

// ─── Data Files ───────────────────────────────────────────────────────────────
const dataFiles = {
  projects: path.join(dataDir, 'projects.json'),
  achievements: path.join(dataDir, 'achievements.json'),
  certificates: path.join(dataDir, 'certificates.json'),
  blogs: path.join(dataDir, 'blogs.json'),
  education: path.join(dataDir, 'education.json'),
  sessions: path.join(dataDir, 'sessions.json'),
  profile: path.join(dataDir, 'profile.json'),
};

await fs.mkdir(dataDir, { recursive: true });

async function ensureJson(file) {
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, '[]', 'utf8');
  }
}

await Promise.all(Object.values(dataFiles).map(ensureJson));

// ─── Session Persistence ──────────────────────────────────────────────────────
async function loadSessions() {
  try {
    const data = await fs.readFile(dataFiles.sessions, 'utf8');
    const saved = JSON.parse(data);
    saved.forEach((token) => adminSessions.add(token));
  } catch {}

  try {
    await fs.access(dataFiles.profile);
  } catch {
    await fs.writeFile(
      dataFiles.profile,
      JSON.stringify({
        githubUrl: 'https://github.com/Amit-akm-22',
        githubImage: '',
        linkedinUrl: 'https://www.linkedin.com/in/amit-manmode-5b1a23328',
        linkedinImage: '',
        email: 'amit.akm.work@gmail.com',
        phone: '+91 83057-21431'
      }, null, 2),
      'utf8'
    );
  }
}

async function saveSessions() {
  await fs.writeFile(
    dataFiles.sessions,
    JSON.stringify([...adminSessions], null, 2),
    'utf8'
  );
}

await loadSessions();

// ─── Cloudinary Multer Storage ────────────────────────────────────────────────
// Images go to Cloudinary → portfolio_uploads folder
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    if (!cloudinaryConfigured) {
      throw new Error('Cloudinary environment variables are missing on Render. Please add them in the Render Dashboard.');
    }
    return {
      folder: 'portfolio_uploads',
      public_id: `${Date.now()}-${file.originalname
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-zA-Z0-9]/g, '-')}`,
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    };
  },
});

const upload = multer({ storage: cloudinaryStorage });

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://amitmanmode.me',
      'https://www.amitmanmode.me',
    ],
  })
);
app.use(express.json());

// ─── Auth Helpers ─────────────────────────────────────────────────────────────
const createToken = () => crypto.randomBytes(32).toString('hex');
const getBearerToken = (req) => {
  const authHeader = req.get('authorization') || '';
  const [scheme, token] = authHeader.split(' ');
  return scheme?.toLowerCase() === 'bearer' ? token : '';
};

const requireAdmin = (req, res, next) => {
  const token = getBearerToken(req);
  if (!token || !adminSessions.has(token)) {
    return res.status(401).json({ message: 'Admin authentication required' });
  }
  return next();
};

// ─── DB Helpers ───────────────────────────────────────────────────────────────
const readItems = async (type) =>
  JSON.parse(await fs.readFile(dataFiles[type], 'utf8'));

const writeItems = async (type, items) =>
  fs.writeFile(dataFiles[type], JSON.stringify(items, null, 2), 'utf8');

const readProfile = async () =>
  JSON.parse(await fs.readFile(dataFiles.profile, 'utf8'));

const writeProfile = async (profile) =>
  fs.writeFile(dataFiles.profile, JSON.stringify(profile, null, 2), 'utf8');

// ─── String Utilities ─────────────────────────────────────────────────────────
const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const splitList = (value) =>
  String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const splitTechList = (value) => {
  const text = String(value || '').trim();
  if (!text) return [];
  if (text.includes(',')) return splitList(text);

  const compound = new Set(['Tailwind CSS']);
  const words = text.split(/\s+/).filter(Boolean);
  const items = [];
  for (let i = 0; i < words.length; i += 1) {
    const pair = `${words[i]} ${words[i + 1] || ''}`.trim();
    if (compound.has(pair)) {
      items.push(pair);
      i += 1;
    } else {
      items.push(words[i]);
    }
  }
  return items;
};

// ─── Cloudinary URL helper ────────────────────────────────────────────────────
// multer-storage-cloudinary stores the Cloudinary URL in file.path
const uploadUrl = (file) => (file ? file.path : '');
const uploadedUrls = (fileList = []) => fileList.map(uploadUrl).filter(Boolean);

const renumber = (items) =>
  items.map((item, i) => ({
    ...item,
    number: String(i + 1).padStart(2, '0'),
  }));

// ─── Builders ─────────────────────────────────────────────────────────────────
const buildProject = (body, files = {}, existing = {}, count = 0) => {
  const heroImage = uploadUrl(files?.heroImage?.[0]);
  const galleryImages = uploadedUrls(files?.galleryImages);
  const name = body.name || existing.name || 'Untitled Project';
  const nextHero = heroImage || existing.heroImage || galleryImages[0] || '';
  const nextGallery =
    galleryImages.length
      ? galleryImages
      : existing.galleryImages || (nextHero ? [nextHero] : []);

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
    tech: splitTechList(body.tech).length
      ? splitTechList(body.tech)
      : existing.tech || [],
    heroImage: nextHero,
    galleryImages: nextGallery,
    col1Image2: nextGallery[1] || nextHero || '',
    col2Image: nextGallery[2] || nextGallery[0] || nextHero || '',
    accent: body.accent || existing.accent || '#7EB8F7',
    year:
      body.year || existing.year || new Date().getFullYear().toString(),
  };
};

const buildAchievement = (body, files = {}, existing = {}, count = 0) => {
  const image = uploadUrl(files?.image?.[0]);
  const galleryImages = uploadedUrls(files?.galleryImages);
  const title = body.title || existing.title || 'Untitled Achievement';
  const nextImage = image || existing.image || galleryImages[0] || '';
  const nextGallery =
    galleryImages.length
      ? galleryImages
      : existing.galleryImages || (nextImage ? [nextImage] : []);

  return {
    ...existing,
    id: existing.id || slugify(body.id || title),
    number: existing.number || String(count + 1).padStart(2, '0'),
    title,
    issuer: body.issuer || existing.issuer || '',
    date:
      body.date || existing.date || new Date().getFullYear().toString(),
    category: body.category || existing.category || 'Achievement',
    summary: body.summary || existing.summary || '',
    details: body.details || existing.details || '',
    highlights: splitList(body.highlights).length
      ? splitList(body.highlights)
      : existing.highlights || [],
    skills: splitList(body.skills).length
      ? splitList(body.skills)
      : existing.skills || [],
    certificateUrl: body.certificateUrl || existing.certificateUrl || '',
    image: nextImage,
    galleryImages: nextGallery,
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
    date:
      body.date || existing.date || new Date().getFullYear().toString(),
    category: body.category || existing.category || 'Certificate',
    summary: body.summary || existing.summary || '',
    details: body.details || existing.details || '',
    highlights: splitList(body.highlights).length
      ? splitList(body.highlights)
      : existing.highlights || [],
    skills: splitList(body.skills).length
      ? splitList(body.skills)
      : existing.skills || [],
    certificateUrl: body.certificateUrl || existing.certificateUrl || '',
    image: uploadUrl(file) || existing.image || '',
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
    year:
      body.year || existing.year || new Date().getFullYear().toString(),
    score: body.score || existing.score || '',
    logo: uploadUrl(file) || existing.logo || '',
    accent: body.accent || existing.accent || '#F59E0B',
  };
};

const buildBlog = (body, file, existing = {}, count = 0) => {
  const title = body.title || existing.title || 'Untitled Blog';
  const sectionHeadings = splitList(body.sectionHeadings);
  const sectionBodies = String(body.sectionBodies || '')
    .split('\n---\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const sections = sectionHeadings.length
    ? sectionHeadings.map((heading, i) => ({
        heading,
        body: sectionBodies[i] || '',
      }))
    : existing.sections || [];

  return {
    ...existing,
    id: existing.id || slugify(body.id || title),
    number: existing.number || String(count + 1).padStart(2, '0'),
    title,
    category: body.category || existing.category || 'Blog',
    date:
      body.date || existing.date || new Date().getFullYear().toString(),
    readTime: body.readTime || existing.readTime || '3 min read',
    excerpt: body.excerpt || existing.excerpt || '',
    intro: body.intro || existing.intro || '',
    coverImage: uploadUrl(file) || existing.coverImage || '',
    sections,
    tags: splitList(body.tags).length
      ? splitList(body.tags)
      : existing.tags || [],
    accent: body.accent || existing.accent || '#A78BFA',
  };
};

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const token = createToken();
  adminSessions.add(token);
  await saveSessions();
  res.json({ token });
});

app.post('/api/auth/logout', requireAdmin, async (req, res) => {
  adminSessions.delete(getBearerToken(req));
  await saveSessions();
  res.json({ ok: true });
});

// ─── Public Read Routes ───────────────────────────────────────────────────────
app.get('/api/content', async (_req, res) => {
  try {
    const [projects, achievements, certificates, blogs, education, profile] =
      await Promise.all([
        readItems('projects'),
        readItems('achievements'),
        readItems('certificates'),
        readItems('blogs'),
        readItems('education'),
        readProfile(),
      ]);
    res.json({ projects, achievements, certificates, blogs, education, profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load content' });
  }
});

app.get('/api/:type', async (req, res) => {
  const { type } = req.params;
  if (!dataFiles[type]) return res.status(404).json({ message: 'Unknown content type' });
  res.json(await readItems(type));
});

// ─── Auth Guard for mutating routes ──────────────────────────────────────────
app.use('/api', (req, res, next) => {
  if (req.method === 'GET' || req.path.startsWith('/auth/')) return next();
  return requireAdmin(req, res, next);
});

// ─── Profile API ──────────────────────────────────────────────────────────────

app.get('/api/profile', async (_req, res) => {
  try {
    res.json(await readProfile());
  } catch (error) {
    res.status(500).json({ error: 'Failed to read profile' });
  }
});

app.put(
  '/api/profile',
  requireAdmin,
  upload.fields([
    { name: 'githubImage', maxCount: 1 },
    { name: 'linkedinImage', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const currentProfile = await readProfile();
      const newProfile = { ...currentProfile, ...req.body };

      if (req.files?.githubImage?.[0]) {
        newProfile.githubImage = uploadUrl(req.files.githubImage[0]);
      }
      if (req.files?.linkedinImage?.[0]) {
        newProfile.linkedinImage = uploadUrl(req.files.linkedinImage[0]);
      }

      await writeProfile(newProfile);
      res.json(newProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

// ─── Projects ────────────────────────────────────────────────────────────────
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

// ─── Achievements ─────────────────────────────────────────────────────────────
app.post(
  '/api/achievements',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'galleryImages', maxCount: 8 },
  ]),
  async (req, res) => {
    const items = await readItems('achievements');
    const achievement = buildAchievement(req.body, req.files, {}, items.length);
    items.unshift(achievement);
    await writeItems('achievements', renumber(items));
    res.status(201).json(achievement);
  }
);

app.put(
  '/api/achievements/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'galleryImages', maxCount: 8 },
  ]),
  async (req, res) => {
    const items = await readItems('achievements');
    const index = items.findIndex((item) => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Achievement not found' });
    items[index] = buildAchievement(req.body, req.files, items[index], index);
    await writeItems('achievements', renumber(items));
    res.json(items[index]);
  }
);

// ─── Certificates ─────────────────────────────────────────────────────────────
app.post('/api/certificates', upload.single('image'), async (req, res) => {
  const items = await readItems('certificates');
  const certificate = buildCertificate(req.body, req.file, {}, items.length);
  items.unshift(certificate);
  await writeItems('certificates', renumber(items));
  res.status(201).json(certificate);
});

app.put('/api/certificates/:id', upload.single('image'), async (req, res) => {
  const items = await readItems('certificates');
  const index = items.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Certificate not found' });
  items[index] = buildCertificate(req.body, req.file, items[index], index);
  await writeItems('certificates', renumber(items));
  res.json(items[index]);
});

// ─── Blogs ────────────────────────────────────────────────────────────────────
app.post('/api/blogs', upload.single('coverImage'), async (req, res) => {
  const items = await readItems('blogs');
  const blog = buildBlog(req.body, req.file, {}, items.length);
  items.unshift(blog);
  await writeItems('blogs', renumber(items));
  res.status(201).json(blog);
});

app.put('/api/blogs/:id', upload.single('coverImage'), async (req, res) => {
  const items = await readItems('blogs');
  const index = items.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Blog not found' });
  items[index] = buildBlog(req.body, req.file, items[index], index);
  await writeItems('blogs', renumber(items));
  res.json(items[index]);
});

// ─── Education ────────────────────────────────────────────────────────────────
app.post('/api/education', upload.single('logo'), async (req, res) => {
  const items = await readItems('education');
  const education = buildEducation(req.body, req.file, {}, items.length);
  items.unshift(education);
  await writeItems('education', renumber(items));
  res.status(201).json(education);
});

app.put('/api/education/:id', upload.single('logo'), async (req, res) => {
  const items = await readItems('education');
  const index = items.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Education not found' });
  items[index] = buildEducation(req.body, req.file, items[index], index);
  await writeItems('education', renumber(items));
  res.json(items[index]);
});

// ─── Reorder ──────────────────────────────────────────────────────────────────
app.patch('/api/:type/reorder', async (req, res) => {
  const { type } = req.params;
  if (!dataFiles[type]) return res.status(404).json({ message: 'Unknown content type' });

  const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
  const items = await readItems(type);
  const byId = new Map(items.map((item) => [item.id, item]));
  const uniqueIds = new Set(ids);
  const valid =
    ids.length === items.length &&
    uniqueIds.size === items.length &&
    ids.every((id) => byId.has(id));

  if (!valid) {
    return res
      .status(400)
      .json({ message: 'Reorder list must include every item id exactly once' });
  }

  const next = ids.map((id) => byId.get(id));
  await writeItems(type, renumber(next));
  res.json(renumber(next));
});

// ─── Delete ───────────────────────────────────────────────────────────────────
app.delete('/api/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  if (!dataFiles[type]) return res.status(404).json({ message: 'Unknown content type' });

  const items = await readItems(type);
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length)
    return res.status(404).json({ message: 'Item not found' });

  await writeItems(type, renumber(next));
  res.json({ ok: true });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((error, _req, res, _next) => {
  console.error(error);
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: error.message, field: error.field });
  }
  return res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Admin API running on http://localhost:${port}`);
  if (cloudinaryConfigured) {
    console.log(`☁️  Cloudinary storage: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  }
});
