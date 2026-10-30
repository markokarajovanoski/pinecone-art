import { useEffect, useState } from 'react';
import { CatalogContext } from './catalogContext';
import { DEFAULT_SETTINGS, fetchCatalog } from '../lib/catalog';

const LOADING = { status: 'loading', categories: [], pieces: [], settings: DEFAULT_SETTINGS };

export default function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState(LOADING);

  useEffect(() => {
    let ignore = false;
    fetchCatalog()
      .then((data) => {
        if (!ignore) setCatalog({ status: 'ready', ...data });
      })
      .catch((error) => {
        console.error('Could not load the catalog', error);
        if (!ignore) setCatalog({ ...LOADING, status: 'error' });
      });
    return () => {
      ignore = true;
    };
  }, []);

  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}
