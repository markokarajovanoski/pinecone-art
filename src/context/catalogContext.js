import { createContext, useContext } from 'react';

export const CatalogContext = createContext(null);

// { status: 'loading' | 'ready' | 'error', categories, pieces, settings }
export function useCatalog() {
  return useContext(CatalogContext);
}
