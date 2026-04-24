import { useEffect } from 'react';
const BASE = 'Haseeb Shop';
const useSEO = ({ title, description, keywords }) => {
  useEffect(() => {
    document.title = title ? `${title} \u2014 ${BASE}` : BASE;
    const setMeta = (sel, val) => { const t = document.querySelector(sel); if (t) t.setAttribute('content', val); };
    if (description) { setMeta('meta[name="description"]', description); setMeta('meta[property="og:description"]', description); }
    if (keywords) setMeta('meta[name="keywords"]', keywords);
    setMeta('meta[property="og:title"]', title ? `${title} \u2014 ${BASE}` : BASE);
    return () => { document.title = BASE; };
  }, [title, description, keywords]);
};
export default useSEO;
