import { useCallback, useEffect, useState } from 'react';
import { fetchPieces, setPieceStatus } from '../adminApi';
import PieceManagerView from './PieceManager.view';

export default function PieceManager() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // a piece id, 'new', or null for the list

  const reload = useCallback(async () => {
    try {
      setData(await fetchPieces());
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const changeStatus = async (piece, status) => {
    try {
      await setPieceStatus(piece.id, status);
      await reload();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <PieceManagerView
      data={data}
      error={error}
      isEditing={editingId !== null}
      editingPiece={editingId === 'new' ? null : data?.pieces.find((p) => p.id === editingId) ?? null}
      onAdd={() => setEditingId('new')}
      onEdit={(piece) => setEditingId(piece.id)}
      onStatusChange={changeStatus}
      onEditorSaved={async (id) => {
        await reload();
        setEditingId(id);
      }}
      onEditorChanged={reload}
      onEditorClose={() => {
        setEditingId(null);
        reload();
      }}
    />
  );
}
