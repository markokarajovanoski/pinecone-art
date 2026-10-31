import { useState } from 'react';
import { signIn } from '../adminApi';
import LoginView from './Login.view';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  // On success the session listener in AdminApp switches to the admin screens.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setFailed(false);
    try {
      await signIn(email.trim(), password);
    } catch {
      setFailed(true);
      setBusy(false);
    }
  };

  return (
    <LoginView
      email={email}
      password={password}
      busy={busy}
      failed={failed}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
}
