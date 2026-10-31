import { useCallback, useState } from 'react';
import CustomOrder from '../components/CustomOrder';
import { CustomOrderContext } from './customOrderContext';

// Lets any section open the custom-order flow (hero, contact, each piece).
export default function CustomOrderProvider({ children }) {
  const [openWith, setOpenWith] = useState(null); // { piece } while open

  const open = useCallback((piece = null) => setOpenWith({ piece }), []);
  const close = useCallback(() => setOpenWith(null), []);

  return (
    <CustomOrderContext.Provider value={open}>
      {children}
      {openWith && <CustomOrder fromPiece={openWith.piece} onClose={close} />}
    </CustomOrderContext.Provider>
  );
}
