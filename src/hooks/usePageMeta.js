import { useEffect } from 'react';

function setMetaTag(name, content) {
  if (!content) return;
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

/**
 * Updates document title and meta description/keywords for SPA routes.
 * Accepts { title, description, keywords } or legacy { title, description }.
 */
export function usePageMeta({ title, description, keywords }) {
  useEffect(() => {
    if (title) document.title = title;
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);

    return () => {
      /* RouteTitle on next navigation will overwrite */
    };
  }, [title, description, keywords]);
}
