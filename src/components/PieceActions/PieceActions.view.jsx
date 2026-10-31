import { useCustomOrder } from '../../context/customOrderContext';
import { useLanguage } from '../../i18n/languageContext';
import { ORDER_LABELS } from './PieceActions.props';
import './style.css';

/** @param {import('./PieceActions.props').PieceActionsViewProps} props */
export default function PieceActionsView({ piece, onOrder, onShare, className }) {
  const { t } = useLanguage();
  const openCustomOrder = useCustomOrder();

  return (
    <div className={className ? `piece-actions ${className}` : 'piece-actions'}>
      <button type="button" className="order-btn" onClick={() => onOrder(piece)}>
        {t(ORDER_LABELS[piece.status] ?? 'order.button')}
      </button>
      <button type="button" className="share-btn" onClick={() => onShare(piece)}>
        {t('share.button')}
      </button>
      <button type="button" className="custom-like-btn" onClick={() => openCustomOrder(piece)}>
        {t('custom.likeThis')}
      </button>
    </div>
  );
}
