import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="center-card">
      <h1>Admin Access</h1>
      <p>Enter admin password</p>
      <form onSubmit={handleSubmit} className="stack">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Open Admin'}
        </button>
      </form>
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
