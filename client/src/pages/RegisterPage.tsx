import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { Leaf, Mail, Lock, User, GraduationCap, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    universityId: '',
    cguAccepted: false,
    privacyAccepted: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/login', { state: { message: 'Compte cree avec succes. Veuillez vous connecter.' } });
    } catch (err) {
      setError((err as Error).message || "Erreur lors de l'inscription");
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
            Creer un compte
          </h2>
          <p className="text-slate-500 text-center mb-8">
            Rejoignez la communaute PeriGreen
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-perigreen-500 focus:border-transparent transition-all"
                  placeholder="Jean Dupont"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="universityId" className="block text-sm font-semibold text-slate-700 mb-2">
                Numero etudiant / ID universite
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  id="universityId"
                  type="text"
                  value={formData.universityId}
                  onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-perigreen-500 focus:border-transparent transition-all"
                  placeholder="E12345678"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email universitaire
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-perigreen-500 focus:border-transparent transition-all"
                  placeholder="jean.dupont@university.fr"
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-perigreen-500 focus:border-transparent transition-all"
                  placeholder="........"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="flex items-start gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={formData.cguAccepted}
                  onChange={(e) => setFormData({ ...formData, cguAccepted: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-perigreen-600 focus:ring-perigreen-500"
                  required
                />
                <span>
                  J'accepte les <Link to="/cgu" className="font-semibold text-perigreen-700 underline">CGU</Link>.
                </span>
              </label>

              <label className="flex items-start gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={formData.privacyAccepted}
                  onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-perigreen-600 focus:ring-perigreen-500"
                  required
                />
                <span>
                  J'accepte la <Link to="/rgpd" className="font-semibold text-perigreen-700 underline">politique RGPD</Link>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-perigreen-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-perigreen-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-perigreen-200"
            >
              {isLoading ? 'Creation...' : 'Creer mon compte'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500">
              Deja un compte ?{' '}
              <Link to="/login" className="text-perigreen-600 font-semibold hover:text-perigreen-700">
                Se connecter
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
