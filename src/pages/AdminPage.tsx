import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Briefcase,
  Database,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  Trophy,
  Award,
  X,
} from 'lucide-react';
import { createContent, deleteContent, getPortfolioContent, reorderContent, updateContent } from '../lib/api';
import { normalizeTechTags } from '../lib/tech';

type ContentType = 'projects' | 'achievements' | 'certificates' | 'education';
type AdminItem = Record<string, any>;

const sections = [
  { type: 'projects' as const, label: 'Projects', single: 'Project', icon: Briefcase },
  { type: 'achievements' as const, label: 'Achievements', single: 'Achievement', icon: Trophy },
  { type: 'certificates' as const, label: 'Certificates', single: 'Certificate', icon: Award },
  { type: 'education' as const, label: 'Education', single: 'Education', icon: GraduationCap },
];

const inputClass =
  'admin-field w-full px-4 py-3 text-sm font-medium transition';
const labelClass = 'text-[10px] font-bold uppercase tracking-[0.22em] text-white/45';

const listValue = (value: unknown) => (Array.isArray(value) ? value.join(', ') : '');

const getTitle = (item: AdminItem) => item.name || item.title || 'Untitled';
const getSummary = (item: AdminItem) => item.description || item.summary || item.excerpt || 'No description added yet.';
const getImage = (item: AdminItem) => item.heroImage || item.image || item.coverImage || item.galleryImages?.[0] || '';
const getTags = (item: AdminItem, type: ContentType) => {
  if (type === 'projects') return normalizeTechTags(item.tech);
  return item.skills || [];
};

const Field = ({
  label,
  name,
  placeholder,
  type = 'text',
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
}) => (
  <label className="flex flex-col gap-2">
    <span className={labelClass}>{label}</span>
    <input className={inputClass} defaultValue={defaultValue || ''} name={name} placeholder={placeholder} type={type} />
  </label>
);

const TextArea = ({
  label,
  name,
  placeholder,
  defaultValue,
  rows = 4,
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
}) => (
  <label className="flex flex-col gap-2">
    <span className={labelClass}>{label}</span>
    <textarea className={`${inputClass} resize-y leading-7`} defaultValue={defaultValue || ''} name={name} placeholder={placeholder} rows={rows} />
  </label>
);

const FileField = ({ label, name, multiple = false }: { label: string; name: string; multiple?: boolean }) => (
  <label className="flex flex-col gap-2">
    <span className={labelClass}>{label}</span>
    <input className="admin-file w-full px-4 py-3 text-sm" name={name} type="file" accept="image/*" multiple={multiple} />
  </label>
);

const AdminPage = () => {
  const [activeType, setActiveType] = useState<ContentType>('projects');
  const [content, setContent] = useState<Record<ContentType, AdminItem[]>>({
    projects: [],
    achievements: [],
    certificates: [],
    education: [],
  });
  const [query, setQuery] = useState('');
  const [editingItem, setEditingItem] = useState<AdminItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const activeSection = sections.find((section) => section.type === activeType)!;
  const ActiveIcon = activeSection.icon;
  const activeItems = content[activeType];
  const visibleItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return activeItems;
    return activeItems.filter((item) =>
      [getTitle(item), item.category, item.date, getSummary(item)].filter(Boolean).join(' ').toLowerCase().includes(term)
    );
  }, [activeItems, query]);

  const loadContent = async () => {
    setLoading(true);
    const nextContent = await getPortfolioContent();
    setContent({
      projects: nextContent.projects,
      achievements: nextContent.achievements,
      certificates: nextContent.certificates,
      education: nextContent.education,
    });
    setLoading(false);
  };

  useEffect(() => {
    loadContent();
  }, []);

  const openNew = () => {
    setEditingItem(null);
    setCreating(true);
    setStatus('');
  };

  const openEdit = (item: AdminItem) => {
    setCreating(false);
    setEditingItem(item);
    setStatus('');
  };

  const closeEditor = () => {
    setCreating(false);
    setEditingItem(null);
    setSaving(false);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus(editingItem ? 'Updating content...' : 'Creating content...');

    try {
      const formData = new FormData(event.currentTarget);
      if (editingItem) {
        await updateContent(activeType, editingItem.id, formData);
        setStatus(`${activeSection.single} updated successfully.`);
      } else {
        await createContent(activeType, formData);
        setStatus(`${activeSection.single} created successfully.`);
      }

      await loadContent();
      closeEditor();
    } catch {
      setStatus('Could not save. Make sure the backend is running on port 4000.');
      setSaving(false);
    }
  };

  const removeItem = async (item: AdminItem) => {
    const confirmed = window.confirm(`Delete "${getTitle(item)}"?`);
    if (!confirmed) return;

    setStatus('Deleting content...');
    try {
      await deleteContent(activeType, item.id);
      await loadContent();
      setStatus(`${activeSection.single} deleted successfully.`);
    } catch {
      setStatus('Could not delete. Make sure the backend is running on port 4000.');
    }
  };

  const moveItem = async (item: AdminItem, direction: -1 | 1) => {
    const currentItems: AdminItem[] = content[activeType];
    const currentIndex = currentItems.findIndex((currentItem) => currentItem.id === item.id);
    const nextIndex = currentIndex + direction;

    if (currentIndex === -1 || nextIndex < 0 || nextIndex >= currentItems.length) return;

    const nextItems = [...currentItems];
    [nextItems[currentIndex], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[currentIndex]];

    const renumberedItems: AdminItem[] = nextItems.map((currentItem, index) => ({
      ...currentItem,
      number: String(index + 1).padStart(2, '0'),
    }));

    setContent((current) => ({
      ...current,
      [activeType]: renumberedItems,
    }));
    setStatus('Saving new display order...');

    try {
      const savedItems = await reorderContent(activeType, renumberedItems.map((currentItem) => currentItem.id));
      setContent((current) => ({
        ...current,
        [activeType]: savedItems,
      }));
      setStatus(`${activeSection.label} order updated successfully.`);
    } catch {
      setContent((current) => ({
        ...current,
        [activeType]: currentItems,
      }));
      setStatus('Could not reorder. Make sure the backend is running on port 4000.');
    }
  };

  return (
    <main className="min-h-screen bg-[#080914] text-white">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/[0.08] bg-[#0B0C16] md:flex md:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-white/[0.06] px-6">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 shadow-[0_14px_34px_rgba(37,99,235,0.35)]">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em]">Portfolio</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">Admin Panel</p>
          </div>
        </div>

        <div className="p-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl border border-blue-400/15 bg-blue-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-blue-200 transition hover:bg-blue-500/15"
          >
            <ArrowLeft size={16} /> Back to Site
          </Link>
        </div>

        <div className="px-4 pt-5">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.28em] text-white/25">Content</p>
          <div className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const selected = activeType === section.type;
              return (
                <button
                  key={section.type}
                  onClick={() => setActiveType(section.type)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition ${
                    selected ? 'bg-blue-600 text-white shadow-[0_14px_35px_rgba(37,99,235,0.28)]' : 'text-white/55 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    {section.label}
                  </span>
                  <span className={`rounded-md px-2 py-1 text-xs ${selected ? 'bg-white/18 text-white' : 'bg-white/[0.05] text-white/45'}`}>
                    {content[section.type].length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <section className="md:pl-64">
        <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#090A14]/95 backdrop-blur-xl">
          <div className="flex min-h-[78px] flex-col gap-4 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                <ActiveIcon size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-black leading-none tracking-tight">{activeSection.label}</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
                  Manage your {activeSection.single.toLowerCase()} content
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex h-10 min-w-[250px] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white/40">
                <Search size={17} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                  placeholder={`Search ${activeSection.label.toLowerCase()}...`}
                />
              </label>
              <button
                onClick={loadContent}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/55 transition hover:text-white"
                aria-label="Refresh content"
              >
                <RefreshCw size={17} />
              </button>
              <button className="flex h-10 items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 text-xs font-black uppercase tracking-wider text-emerald-300">
                <Database size={17} /> JSON DB
              </button>
              <button
                onClick={openNew}
                className="grid h-10 w-11 place-items-center rounded-xl bg-blue-600 text-white shadow-[0_16px_34px_rgba(37,99,235,0.35)] transition hover:bg-blue-500"
                aria-label={`Add ${activeSection.single}`}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto px-4 pb-3 sm:px-6">
            {sections.map((section) => {
              const Icon = section.icon;
              const selected = activeType === section.type;
              return (
                <button
                  key={section.type}
                  onClick={() => setActiveType(section.type)}
                  className={`flex items-center gap-2 border-b-2 pb-3 text-xs font-black uppercase tracking-[0.15em] transition ${
                    selected ? 'border-blue-400 text-white' : 'border-transparent text-white/35 hover:text-white/70'
                  }`}
                >
                  <Icon size={15} /> {section.label} <span>{content[section.type].length}</span>
                </button>
              );
            })}
          </div>
        </header>

        <div className="px-4 py-7 sm:px-6">
          {status && (
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/70">
              {status}
            </div>
          )}

          {loading ? (
            <div className="grid min-h-[420px] place-items-center rounded-3xl border border-white/[0.08] bg-white/[0.02] text-white/50">
              <span className="flex items-center gap-3">
                <Loader2 className="animate-spin" size={20} /> Loading content
              </span>
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="grid min-h-[420px] place-items-center rounded-3xl border border-white/[0.08] bg-white/[0.02] text-center">
              <div>
                <FileText className="mx-auto mb-4 text-white/30" size={40} />
                <h2 className="text-2xl font-bold">No {activeSection.label.toLowerCase()} found</h2>
                <p className="mt-2 text-sm text-white/45">Add your first {activeSection.single.toLowerCase()} from the blue plus button.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
              {visibleItems.map((item) => (
                <AdminCard
                  key={item.id}
                  item={item}
                  type={activeType}
                  canMoveUp={activeItems.findIndex((activeItem) => activeItem.id === item.id) > 0}
                  canMoveDown={activeItems.findIndex((activeItem) => activeItem.id === item.id) < activeItems.length - 1}
                  onMoveUp={() => moveItem(item, -1)}
                  onMoveDown={() => moveItem(item, 1)}
                  onEdit={() => openEdit(item)}
                  onDelete={() => removeItem(item)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {(creating || editingItem) && (
        <EditorModal
          key={`${activeType}-${editingItem?.id || 'new'}`}
          type={activeType}
          title={editingItem ? `Edit ${activeSection.single}` : `Add ${activeSection.single}`}
          item={editingItem || undefined}
          saving={saving}
          onClose={closeEditor}
          onSubmit={submit}
        />
      )}
    </main>
  );
};

const AdminCard = ({
  item,
  type,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: {
  item: AdminItem;
  type: ContentType;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const image = getImage(item);
  const tags = getTags(item, type);

  return (
    <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10111D] shadow-[0_20px_55px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-blue-400/25">
      <div className="relative h-[230px] bg-[#080A12]">
        {image ? (
          <img src={image} alt={getTitle(item)} className="h-full w-full object-contain bg-black" />
        ) : (
          <div className="grid h-full place-items-center text-white/25">
            <ImageIcon size={42} />
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/45 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 backdrop-blur">
          {item.number || '--'}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-300/70">{item.category || item.date || 'Entry'}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">{item.year || item.readTime || item.date}</span>
        </div>

        <h2 className="line-clamp-2 min-h-[3.1rem] text-[1.15rem] font-black leading-tight text-white">{getTitle(item)}</h2>
        <p className="mt-3 line-clamp-2 min-h-[2.8rem] text-sm leading-6 text-white/48">{getSummary(item)}</p>

        <div className="mt-4 flex flex-wrap gap-2 border-b border-white/[0.06] pb-4">
          {tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="rounded-md bg-blue-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-200/80">
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="rounded-md bg-white/[0.05] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/45">
              +{tags.length - 3} more
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/55 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label={`Move ${getTitle(item)} up`}
              title="Move up"
            >
              <ArrowUp size={14} />
            </button>
            <button
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/55 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label={`Move ${getTitle(item)} down`}
              title="Move down"
            >
              <ArrowDown size={14} />
            </button>
            <button
              onClick={onEdit}
              className="flex items-center gap-2 rounded-lg border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-blue-200 transition hover:bg-blue-500/18"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-red-200 transition hover:bg-red-500/18"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">{item.date || item.year}</span>
        </div>
      </div>
    </article>
  );
};

const EditorModal = ({
  type,
  title,
  item,
  saving,
  onClose,
  onSubmit,
}: {
  type: ContentType;
  title: string;
  item?: AdminItem;
  saving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 px-4 py-7 backdrop-blur-md">
    <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0B0D17] shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/[0.08] bg-[#0B0D17]/95 px-6 py-5 backdrop-blur">
        <div>
          <h2 className="text-2xl font-black leading-none tracking-tight">{title}</h2>
          {item && <p className="mt-1 text-xs text-white/35">All information for: {getTitle(item)}</p>}
        </div>
        <button
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/55 transition hover:text-white"
          aria-label="Close editor"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="p-6">
        {type === 'projects' && <ProjectFields item={item} />}
        {type === 'achievements' && <AchievementFields item={item} />}
        {type === 'certificates' && <CertificateFields item={item} />}
        {type === 'education' && <EducationFields item={item} />}

        <div className="mt-7 flex flex-wrap items-center justify-end gap-3 border-t border-white/[0.08] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-wider text-white/55 transition hover:text-white"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_14px_35px_rgba(37,99,235,0.3)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {item ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const ProjectFields = ({ item }: { item?: AdminItem }) => (
  <div className="grid gap-5 md:grid-cols-2">
    <Field label="Name" name="name" placeholder="Forge" defaultValue={item?.name} />
    <Field label="Category" name="category" placeholder="Full Stack" defaultValue={item?.category} />
    <Field label="Year" name="year" placeholder="2026" defaultValue={item?.year} />
    <Field label="Tech" name="tech" placeholder="React, Node, MongoDB" defaultValue={listValue(item?.tech)} />
    <Field label="Live URL" name="liveUrl" placeholder="https://..." defaultValue={item?.liveUrl} />
    <Field label="GitHub URL" name="githubUrl" placeholder="https://github.com/..." defaultValue={item?.githubUrl} />
    <Field label="Accent Color" name="accent" placeholder="#7EB8F7" defaultValue={item?.accent} />
    <FileField label={item?.heroImage ? 'Replace Hero Image' : 'Hero Image'} name="heroImage" />
    <div className="md:col-span-2">
      <FileField label={item?.galleryImages?.length ? 'Replace Gallery Images' : 'Gallery Images'} name="galleryImages" multiple />
    </div>
    <div className="md:col-span-2">
      <TextArea label="Description" name="description" placeholder="Short project summary" defaultValue={item?.description} />
    </div>
    <div className="md:col-span-2">
      <TextArea label="Impact" name="impact" placeholder="What this project improved or demonstrates" defaultValue={item?.impact} />
    </div>
  </div>
);

const AchievementFields = ({ item }: { item?: AdminItem }) => (
  <div className="grid gap-5 md:grid-cols-2">
    <Field label="Title" name="title" placeholder="Hackathon Winner" defaultValue={item?.title} />
    <Field label="Issuer" name="issuer" placeholder="College / Platform" defaultValue={item?.issuer} />
    <Field label="Date" name="date" placeholder="2026" defaultValue={item?.date} />
    <Field label="Category" name="category" placeholder="Award" defaultValue={item?.category} />
    <Field label="Skills" name="skills" placeholder="React, DSA, Teamwork" defaultValue={listValue(item?.skills)} />
    <Field label="Highlights" name="highlights" placeholder="Won 1st prize, Built MVP, Presented demo" defaultValue={listValue(item?.highlights)} />
    <Field label="Reference URL" name="certificateUrl" placeholder="https://..." defaultValue={item?.certificateUrl} />
    <Field label="Accent Color" name="accent" placeholder="#4ADE80" defaultValue={item?.accent} />
    <div className="md:col-span-2">
      <FileField label={item?.image ? 'Replace Image' : 'Image'} name="image" />
    </div>
    <div className="md:col-span-2">
      <TextArea label="Summary" name="summary" placeholder="Short card summary" defaultValue={item?.summary} />
    </div>
    <div className="md:col-span-2">
      <TextArea label="Details" name="details" placeholder="Full achievement details" defaultValue={item?.details} />
    </div>
  </div>
);

const CertificateFields = ({ item }: { item?: AdminItem }) => (
  <div className="grid gap-5 md:grid-cols-2">
    <Field label="Title" name="title" placeholder="React Certificate" defaultValue={item?.title} />
    <Field label="Issuer" name="issuer" placeholder="Platform / Organization" defaultValue={item?.issuer} />
    <Field label="Date" name="date" placeholder="2026" defaultValue={item?.date} />
    <Field label="Category" name="category" placeholder="Certificate" defaultValue={item?.category} />
    <Field label="Skills" name="skills" placeholder="React, JavaScript, Frontend" defaultValue={listValue(item?.skills)} />
    <Field label="Highlights" name="highlights" placeholder="Completed course, Built project, Passed assessment" defaultValue={listValue(item?.highlights)} />
    <Field label="Certificate URL" name="certificateUrl" placeholder="https://..." defaultValue={item?.certificateUrl} />
    <Field label="Accent Color" name="accent" placeholder="#38BDF8" defaultValue={item?.accent} />
    <div className="md:col-span-2">
      <FileField label={item?.image ? 'Replace Certificate Image' : 'Certificate Image'} name="image" />
    </div>
    <div className="md:col-span-2">
      <TextArea label="Summary" name="summary" placeholder="Short certificate summary" defaultValue={item?.summary} />
    </div>
    <div className="md:col-span-2">
      <TextArea label="Details" name="details" placeholder="Full certificate details" defaultValue={item?.details} />
    </div>
  </div>
);

const EducationFields = ({ item }: { item?: AdminItem }) => (
  <div className="grid gap-5 md:grid-cols-2">
    <Field label="College Name" name="college" placeholder="IIT Bombay" defaultValue={item?.college} />
    <Field label="Degree" name="degree" placeholder="B.Tech" defaultValue={item?.degree} />
    <Field label="Branch" name="branch" placeholder="Computer Science" defaultValue={item?.branch} />
    <Field label="Year" name="year" placeholder="2024 - 2028" defaultValue={item?.year} />
    <Field label="Score / CGPA" name="score" placeholder="9.5 CGPA" defaultValue={item?.score} />
    <Field label="Accent Color" name="accent" placeholder="#F59E0B" defaultValue={item?.accent} />
    <div className="md:col-span-2">
      <FileField label={item?.logo ? 'Replace Logo' : 'College Logo'} name="logo" />
    </div>
  </div>
);

export default AdminPage;
