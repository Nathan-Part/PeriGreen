import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Leaf, Mail } from 'lucide-react';
import { requestPasswordReset } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    setResetUrl(null);

    try {
      const response = await requestPasswordReset(email);
      setMessage(response.message);
      setResetUrl(response.resetUrl ?? null);
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
            Mot de passe oublie
          </h2>
          <p className="text-slate-500 text-center mb-8">
            Saisissez votre email pour generer un lien de reinitialisation.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 space-y-3">
              <p className="text-sm">{message}</p>
              {resetUrl && (
                <div className="text-sm break-all">
                  <span className="font-semibold">Lien local de test :</span>{' '}
                  <a href={resetUrl} className="text-perigreen-700 underline">
                    {resetUrl}
                  </a>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-perigreen-500 focus:border-transparent transition-all"
                  placeholder="vous@university.fr"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 text-lg">
              {isLoading ? 'Generation...' : 'Generer le lien'}
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
