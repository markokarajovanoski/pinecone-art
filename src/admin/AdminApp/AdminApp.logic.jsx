import { useEffect, useState } from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { getSession, isAdmin, onSessionChange, signOut } from '../adminApi';
import AdminAppView from './AdminApp.view';

export default function AdminApp() {
  const [session, setSession] = useState(undefined); // undefined while checking
  const [admin, setAdmin] = useState(null); // null while checking
  const [tab, setTab] = useState('pieces');

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let stop = () => {};
    let ignore = false;
    getSession().then((current) => !ignore && setSession(current));
    onSessionChange((current) => setSession(current)).then((unsubscribe) => {
      if (ignore) unsubscribe();
      else stop = unsubscribe;
    });
    return () => {
      ignore = true;
      stop();
    };
  }, []);

  useEffect(() => {
    setAdmin(null);
    if (!session) return;
    isAdmin()
      .then(setAdmin)
      .catch(() => setAdmin(false));
  }, [session]);

  let state;
  if (!isSupabaseConfigured) state = 'notConfigured';
  else if (session === undefined) state = 'loading';
  else if (!session) state = 'signedOut';
  else if (admin === null) state = 'loading';
  else state = admin ? 'admin' : 'notAdmin';

  return (
    <AdminAppView
      state={state}
      email={session?.user?.email}
      tab={tab}
      onSelectTab={setTab}
      onSignOut={signOut}
    />
  );
}
