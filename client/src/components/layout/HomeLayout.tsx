import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const HomeLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-perigreen-600 rounded-xl flex items-center justify-center shadow-lg shadow-perigreen-200">
                  <Leaf className="text-white" size={24} />
                </div>
                <span className="ml-3 text-2xl font-bold tracking-tight text-slate-900">PeriGreen</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-perigreen-600 transition-colors">Fonctionnalités</a>
              <a href="#impact" className="text-sm font-semibold text-slate-600 hover:text-perigreen-600 transition-colors">Impact</a>
              <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-perigreen-600 transition-colors">Comment ça marche</a>
              <Link to="/dashboard" className="bg-perigreen-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-perigreen-700 shadow-lg shadow-perigreen-200">
                Démarrer
              </Link>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-md">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t border-slate-100 py-4"
          >
            <div className="px-4 space-y-2">
              <a href="#features" className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Fonctionnalités</a>
              <a href="#impact" className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Impact</a>
              <a href="#how-it-works" className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Comment ça marche</a>
              <Link to="/dashboard" className="block w-full text-center bg-perigreen-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-perigreen-700">
                Démarrer
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center mb-6 group">
                <Leaf className="text-perigreen-500 group-hover:text-perigreen-400 transition-colors" size={24} />
                <span className="ml-2 text-xl font-bold text-white group-hover:text-slate-100 transition-colors">PeriGreen</span>
              </Link>
              <p className="text-sm">La première solution de gestion de matériel IT durable, appliquée aux universités.</p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Projet</h5>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Notre Approche</a></li>
                <li><a href="#" className="hover:text-white transition-colors">L'Équipe</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partenaires</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Légal</h5>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Contact</h5>
              <ul className="space-y-4 text-sm">
                <li><a href="mailto:support@perigreen.com" className="hover:text-white transition-colors">support@perigreen.com</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-xs">
            <p>© {new Date().getFullYear()} PeriGreen. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
