import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getPortfolioContent, fallbackContent, PortfolioContent } from './api';

interface ContentContextValue {
  content: PortfolioContent;
  loading: boolean;
}

const ContentContext = createContext<ContentContextValue>({
  content: fallbackContent,
  loading: true,
});

/** Fetch with automatic retry/backoff for Render cold-start delays */
async function fetchWithRetry(maxAttempts = 4, baseDelayMs = 3000): Promise<PortfolioContent> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const content = await getPortfolioContent();
      return content;
    } catch {
      if (attempt === maxAttempts) return fallbackContent;
      // Exponential back-off: 3s, 6s, 12s …
      await new Promise((r) => setTimeout(r, baseDelayMs * attempt));
    }
  }
  return fallbackContent;
}

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  // Pre-populate with local JSON data so the page is never blank
  const [content, setContent] = useState<PortfolioContent>(fallbackContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchWithRetry().then((data) => {
      if (!cancelled) {
        setContent(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
