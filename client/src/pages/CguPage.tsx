import { Link } from 'react-router-dom';

export default function CguPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-emerald-950/10 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2f8f6b]">Informations legales</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-[#0f3d2e]">Conditions Generales d'Utilisation</h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-[#1b5e4b] sm:text-base">
          <p>PeriGreen est une plateforme universitaire de gestion et de reservation de materiel reconditionne ou mutualise.</p>
          <p>L'utilisateur s'engage a fournir des informations exactes, a proteger ses identifiants et a utiliser la plateforme dans le respect des regles de l'etablissement.</p>
          <p>Les emprunts, reservations et retours peuvent etre controles par les administrateurs de la plateforme afin d'assurer la disponibilite du materiel et la tracabilite des usages.</p>
          <p>L'universite peut suspendre un compte en cas d'utilisation abusive, de tentative de fraude ou de non-respect des regles de pret.</p>
          <p>En creant un compte, l'utilisateur reconnait avoir pris connaissance des presentes CGU et les accepter sans reserve.</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4 text-sm">
          <Link to="/register" className="btn-primary px-5 py-3">Retour a l'inscription</Link>
          <Link to="/rgpd" className="font-semibold text-[#0f3d2e] underline">Voir la politique RGPD</Link>
        </div>
      </div>
    </section>
  );
}
