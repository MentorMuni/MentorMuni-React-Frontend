import { useEffect } from 'react';

/**
 * Updates document title and meta description for SPA routes (crawlers still read index.html defaults).
 */
export function usePageMeta({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;

    if (!description) return undefined;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);

    return () => {
      /* RouteTitle / next page will overwrite */
    };
  }, [title, description]);
}
