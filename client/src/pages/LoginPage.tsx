import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import AuthShell from '../components/auth/AuthShell';
import { getDefaultDashboardPath, useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, clearError, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

    try {
      const user = await login(email, password);
      navigate(getDefaultDashboardPath(user), { replace: true });
    } catch {
      // Handled by auth store
    }
  };

  return (
    <AuthShell
      title="Accedez a votre espace PeriGreen"
      subtitle="Connectez-vous pour retrouver votre tableau personnel ou votre espace d'administration."
    >
      <article className="auth-card">
        <header className="auth-card__header">
          <h2 className="auth-card__title">Bon retour</h2>
          <p className="auth-card__subtitle">Utilisez votre compte universitaire pour continuer.</p>
        </header>

        {error ? (
          <div className="auth-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">E-mail</label>
            <div className="auth-field__control">
              <Mail className="auth-field__icon" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="vous@universite.fr"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="password">Mot de passe</label>
            <div className="auth-field__control">
              <Lock className="auth-field__icon" size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button className="auth-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <footer className="auth-card__footer">
          <span>Pas encore de compte ? </span>
          <Link to="/register">Creer un compte</Link>
        </footer>
      </article>
    </AuthShell>
  );
}
