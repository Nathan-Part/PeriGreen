import { Link } from 'react-router-dom';

export default function RgpdPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-emerald-950/10 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2f8f6b]">Protection des donnees</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-[#0f3d2e]">Politique RGPD</h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-[#1b5e4b] sm:text-base">
          <p>PeriGreen collecte uniquement les donnees necessaires au fonctionnement du service : nom, email, identifiant universitaire et historique lie aux reservations ou emprunts.</p>
          <p>Ces donnees sont traitees pour authentifier l'utilisateur, suivre les prets de materiel et permettre l'administration du parc par les equipes habilitees.</p>
          <p>Les donnees ne sont pas revendues et restent accessibles aux seuls personnels autorises dans le cadre de la gestion du service.</p>
          <p>L'utilisateur peut demander l'acces, la rectification ou la suppression de ses donnees dans le respect des obligations legales et de conservation applicables a l'etablissement.</p>
          <p>L'acceptation de cette politique est enregistree a la creation du compte afin de conserver une preuve du consentement.</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4 text-sm">
          <Link to="/register" className="btn-primary px-5 py-3">Retour a l'inscription</Link>
          <Link to="/cgu" className="font-semibold text-[#0f3d2e] underline">Voir les CGU</Link>
        </div>
      </div>
    </section>
  );
}
