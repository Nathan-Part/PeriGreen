import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Leaf, Lock } from 'lucide-react';
import { resetPassword } from '../services/api';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError('Lien de reinitialisation invalide.');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword(token, password);
      setMessage(response.message);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-perigreen-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-perigreen-600 rounded-xl flex items-center justify-center shadow-lg shadow-perigreen-200">
                <Leaf className="text-white" size={28} />
              </div>
              <span className="text-2xl font-bold text-slate-900">PeriGreen</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
            Nouveau mot de passe
          </h2>
          <p className="text-slate-500 text-center mb-8">
            Choisissez un nouveau mot de passe securise.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
              <span className="text-sm">{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-perigreen-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-perigreen-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 text-lg">
              {isLoading ? 'Mise a jour...' : 'Mettre a jour le mot de passe'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            <Link to="/login" className="text-perigreen-600 font-semibold hover:text-perigreen-700">
              Retour a la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
