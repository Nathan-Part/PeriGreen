import { Recycle, ShieldCheck, ArrowRight, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const HomePage = () => {
  return (
    <motion.div
      className="min-h-screen bg-white font-sans text-slate-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold bg-perigreen-50 text-perigreen-700 ring-1 ring-inset ring-perigreen-600/20 mb-8"
            >
              L'avenir de la durabilité sur les campuses
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-tight"
            >
              Donnez une seconde vie à <span className="text-transparent bg-clip-text bg-gradient-to-r from-perigreen-600 to-emerald-500">votre technologie.</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto"
            >
              La première plateforme collaborative pour le matériel IT, dédiée aux campuses universitaires. Simplicité, économie, durabilité.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/dashboard" className="px-10 py-5 bg-perigreen-600 text-white rounded-2xl font-bold text-xl hover:bg-perigreen-700 shadow-2xl shadow-perigreen-200 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1">
                Emprunter du matériel <ArrowRight size={24} />
              </Link>
              <Link to="/dashboard" className="px-10 py-5 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all transform hover:-translate-y-1">
                Proposer un équipement
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-perigreen-400 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div variants={itemVariants}>
              <div className="text-4xl font-black text-perigreen-600">500+</div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Équipements partagés</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-4xl font-black text-perigreen-600">1.2t</div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">CO2 économisé</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-4xl font-black text-perigreen-600">2000+</div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Utilisateurs</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-4xl font-black text-perigreen-600">15</div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Campuses</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 variants={itemVariants} className="text-base font-bold text-perigreen-600 tracking-widest uppercase mb-3">Fonctionnalités</motion.h2>
            <motion.h3 variants={itemVariants} className="text-4xl md:text-5xl font-black text-slate-900">Tout ce dont vous avez besoin.</motion.h3>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div variants={itemVariants} className="group">
              <div className="w-16 h-16 bg-perigreen-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-perigreen-600 transition-colors">
                <Recycle className="text-perigreen-600 group-hover:text-white transition-colors" size={32} />
              </div>
              <h4 className="text-2xl font-bold mb-4">Seconde Vie</h4>
              <p className="text-slate-600 leading-relaxed">Donnez une seconde vie à vos chargeurs, souris, câbles et claviers qui dorment dans vos tiroirs.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <ShieldCheck className="text-blue-600 group-hover:text-white transition-colors" size={32} />
              </div>
              <h4 className="text-2xl font-bold mb-4">Confiance Totale</h4>
              <p className="text-slate-600 leading-relaxed">Système de traçabilité et de notation pour garantir le respect du matériel et le bien-être de la communauté.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="group">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                <Globe className="text-orange-600 group-hover:text-white transition-colors" size={32} />
              </div>
              <h4 className="text-2xl font-bold mb-4">Impact Local</h4>
              <p className="text-slate-600 leading-relaxed">Agissez directement sur votre campus pour réduire l'empreinte environnementale de la technologie.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 variants={itemVariants} className="text-base font-bold text-perigreen-600 tracking-widest uppercase mb-3">Fonctionnement</motion.h2>
            <motion.h3 variants={itemVariants} className="text-4xl md:text-5xl font-black text-slate-900">Simple comme 1, 2, 3.</motion.h3>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div variants={itemVariants} className="text-center">
              <div className="w-20 h-20 mx-auto bg-perigreen-100 rounded-full flex items-center justify-center mb-6 text-perigreen-600 text-3xl font-bold">
                1
              </div>
              <h4 className="text-2xl font-bold mb-3">Inscrivez-vous</h4>
              <p className="text-slate-600 leading-relaxed">Créez votre compte en quelques secondes et rejoignez la communauté PeriGreen.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600 text-3xl font-bold">
                2
              </div>
              <h4 className="text-2xl font-bold mb-3">Trouvez ou Proposez</h4>
              <p className="text-slate-600 leading-relaxed">Recherchez le matériel dont vous avez besoin ou mettez à disposition le vôtre.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center">
              <div className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6 text-orange-600 text-3xl font-bold">
                3
              </div>
              <h4 className="text-2xl font-bold mb-3">Échangez & Réemployez</h4>
              <p className="text-slate-600 leading-relaxed">Organisez l'échange et contribuez à une économie plus circulaire.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 variants={itemVariants} className="text-base font-bold text-perigreen-600 tracking-widest uppercase mb-3">Témoignages</motion.h2>
            <motion.h3 variants={itemVariants} className="text-4xl md:text-5xl font-black text-slate-900">Ce qu'ils disent de nous.</motion.h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-white shadow-lg border border-slate-100 rounded-2xl">
                <CardContent className="p-0">
                  <p className="text-slate-700 mb-4 italic">"PeriGreen a révolutionné la façon dont nous gérons le matériel sur le campus. Facile, rapide et écologique !"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-perigreen-200 rounded-full flex items-center justify-center text-perigreen-800 font-bold text-lg mr-3">JD</div>
                    <div>
                      <p className="font-semibold text-slate-900">Jean Dupont</p>
                      <p className="text-sm text-slate-500">Étudiant en Informatique</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-white shadow-lg border border-slate-100 rounded-2xl">
                <CardContent className="p-0">
                  <p className="text-slate-700 mb-4 italic">"Un outil indispensable pour réduire nos déchets électroniques et optimiser l'utilisation de nos ressources. Bravo !"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-lg mr-3">AM</div>
                    <div>
                      <p className="font-semibold text-slate-900">Alice Martin</p>
                      <p className="text-sm text-slate-500">Responsable Logistique</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-white shadow-lg border border-slate-100 rounded-2xl">
                <CardContent className="p-0">
                  <p className="text-slate-700 mb-4 italic">"Je cherchais un câble spécifique depuis des semaines, je l'ai trouvé en 5 minutes grâce à PeriGreen. Génial !"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-orange-800 font-bold text-lg mr-3">PL</div>
                    <div>
                      <p className="font-semibold text-slate-900">Pierre Lefevre</p>
                      <p className="text-sm text-slate-500">Professeur de Physique</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-perigreen-600 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-black mb-6">Prêt à changer vos habitudes ?</motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-perigreen-50 mb-10 max-w-2xl mx-auto">Rejoignez des milliers d'étudiants et de membres du personnel qui troquent, partagent et protègent la planète.</motion.p>
              <motion.div variants={itemVariants}>
                <Link to="/dashboard" className="bg-white text-perigreen-600 px-10 py-4 rounded-2xl font-bold text-xl hover:bg-perigreen-50 transition-all shadow-lg">
                  Commencer maintenant
                </Link>
              </motion.div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
