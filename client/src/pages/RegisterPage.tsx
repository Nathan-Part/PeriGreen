import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, GraduationCap, Lock, Mail, User } from 'lucide-react';
import AuthShell from '../components/auth/AuthShell';
import { register } from '../services/api';

type RegisterFormState = {
  fullName: string;
  universityId: string;
  email: string;
  password: string;
};

const INITIAL_FORM: RegisterFormState = {
  fullName: '',
  universityId: '',
  email: '',
  password: '',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterFormState>(INITIAL_FORM);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateField = <K extends keyof RegisterFormState>(key: K, value: RegisterFormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(form);
      navigate('/login', { replace: true });
    } catch (caughtError) {
      setError((caughtError as Error).message || 'Echec de l inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Creez votre compte PeriGreen"
      subtitle="Rejoignez la plateforme pour demander du materiel avec un flux clair selon votre role."
    >
      <article className="auth-card">
        <header className="auth-card__header">
          <h2 className="auth-card__title">Creation de compte</h2>
          <p className="auth-card__subtitle">Vous demarrez avec un role utilisateur et un espace personnel.</p>
        </header>

        {error ? (
          <div className="auth-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="fullName">Nom complet</label>
            <div className="auth-field__control">
              <User className="auth-field__icon" size={18} />
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
                placeholder="Jean Dupont"
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="universityId">Identifiant universitaire</label>
            <div className="auth-field__control">
              <GraduationCap className="auth-field__icon" size={18} />
              <input
                id="universityId"
                type="text"
                value={form.universityId}
                onChange={(event) => updateField('universityId', event.target.value)}
                placeholder="ETU-2026-001"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="email">E-mail</label>
            <div className="auth-field__control">
              <Mail className="auth-field__icon" size={18} />
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
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
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="Au moins 6 caracteres"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
          </div>

          <button className="auth-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Creation en cours...' : 'Creer le compte'}
          </button>
        </form>

        <footer className="auth-card__footer">
          <span>Vous avez deja un compte ? </span>
          <Link to="/login">Se connecter</Link>
        </footer>
      </article>
    </AuthShell>
  );
}
