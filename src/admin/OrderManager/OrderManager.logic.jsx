import { useCallback, useEffect, useState } from 'react';
import { createOrder, deleteOrder, fetchDesigns, fetchOrders, updateOrder } from '../adminApi';
import OrderManagerView from './OrderManager.view';
import { ACTIVE_STATUSES, FILTERS } from './OrderManager.props';

const matches = (order, filter) =>
  filter === 'all' || (filter === 'active' ? ACTIVE_STATUSES.includes(order.status) : order.status === filter);

export default function OrderManager() {
  const [orders, setOrders] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('active');
  const [adding, setAdding] = useState(false);

  const reload = useCallback(async () => {
    try {
      const [loadedOrders, loadedDesigns] = await Promise.all([fetchOrders(), fetchDesigns()]);
      setOrders(loadedOrders);
      setDesigns(loadedDesigns);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // Errors from the card and form actions are shown where they happened, so pass them on.
  const thenReload = (action) => async (...args) => {
    await action(...args);
    await reload();
  };

  const counts = Object.fromEntries(
    FILTERS.map((f) => [f, (orders ?? []).filter((order) => matches(order, f)).length])
  );

  return (
    <OrderManagerView
      orders={orders?.filter((order) => matches(order, filter)) ?? null}
      designs={designs}
      error={error}
      filter={filter}
      counts={counts}
      adding={adding}
      onFilter={setFilter}
      onAdd={() => setAdding(true)}
      onCloseForm={() => setAdding(false)}
      onCreate={thenReload(async (fields, item) => {
        await createOrder(fields, item);
        setAdding(false);
        setFilter('active');
      })}
      onUpdate={thenReload((order, fields) => updateOrder(order.id, fields))}
      onDelete={thenReload((order) => deleteOrder(order.id))}
    />
  );
}
