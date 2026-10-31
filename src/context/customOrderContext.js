import { createContext, useContext } from 'react';

export const CustomOrderContext = createContext(() => {});

// openCustomOrder(piece?) — starts "order your own", optionally from a piece the visitor likes.
export function useCustomOrder() {
  return useContext(CustomOrderContext);
}
