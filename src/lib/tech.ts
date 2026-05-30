const COMPOUND_TECH = new Set(['Tailwind CSS']);

export const normalizeTechTags = (value: unknown): string[] => {
  const rawItems = Array.isArray(value) ? value : [value];
  const tags: string[] = [];

  rawItems.forEach((item) => {
    const text = String(item || '').trim();
    if (!text) return;

    if (text.includes(',')) {
      tags.push(...text.split(',').map((tag) => tag.trim()).filter(Boolean));
      return;
    }

    const words = text.split(/\s+/).filter(Boolean);
    for (let index = 0; index < words.length; index += 1) {
      const pair = `${words[index]} ${words[index + 1] || ''}`.trim();

      if (COMPOUND_TECH.has(pair)) {
        tags.push(pair);
        index += 1;
      } else {
        tags.push(words[index]);
      }
    }
  });

  return Array.from(new Set(tags));
};
