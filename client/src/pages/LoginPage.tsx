import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Leaf, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.roles?.includes('ROLE_ADMIN')) {
        navigate('/dashboard');
      } else {
        navigate('/espace');
      }
    } catch {
      // useAuth exposes the error state.
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
            Connexion
          </h2>
          <p className="text-slate-500 text-center mb-8">
            Accedez a votre compte pour gerer vos equipements
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
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

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-perigreen-500 focus:border-transparent transition-all"
                  placeholder="........"
                  required
                />
              </div>
              <div className="mt-2 text-right">
                <Link to="/forgot-password" className="text-sm font-medium text-perigreen-600 hover:text-perigreen-700">
                  Mot de passe oublie ?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-lg"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-perigreen-600 font-semibold hover:text-perigreen-700">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          <Link to="/" className="hover:text-perigreen-600">Retour a l'accueil</Link>
          {' | '}
          <Link to="/cgu" className="hover:text-perigreen-600">CGU</Link>
          {' | '}
          <Link to="/rgpd" className="hover:text-perigreen-600">RGPD</Link>
        </p>
      </div>
    </div>
  );
}
