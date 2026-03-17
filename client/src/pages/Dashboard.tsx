import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  Laptop, ClipboardList, Archive, AlertCircle,
  CheckCircle2, XCircle, ArrowRight, Clock
} from 'lucide-react';
import { useEquipments } from '../hooks/useEquipment';
import { useLoans } from '../hooks/useLoans';
import { useReservations } from '../hooks/useReservations';

const container: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item: Variants = { hidden: { y: 16, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } } };

function StatutBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    EN_ATTENTE: { label: 'En attente', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    VALIDEE:    { label: 'Validée',    cls: 'bg-green-50  text-green-700  border-green-200' },
    REFUSEE:    { label: 'Refusée',    cls: 'bg-red-50    text-red-700    border-red-200' },
    ANNULEE:    { label: 'Annulée',    cls: 'bg-gray-50   text-gray-600   border-gray-200' },
  };
  const cfg = map[status] ?? { label: status, cls: 'bg-gray-50 text-gray-600 border-gray-200' };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

export default function Dashboard() {
  const { data: equipments } = useEquipments();
  const { data: loans, isLoading: loansLoading } = useLoans();
  const { reservations, fetchAll, isLoading: resLoading } = useReservations();

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const totalEq         = equipments?.length ?? 0;
  const enAttente       = reservations.filter(r => r.status === 'EN_ATTENTE');
  const loansActifs     = loans?.filter(l => l.status === 'ACTIVE' || l.status === 'EN_COURS').length ?? 0;
  const loansEnRetard   = loans?.filter(l => l.status === 'OVERDUE' || l.status === 'EN_RETARD') ?? [];
  const eqIndispos      = equipments?.filter(e => e.status === 'IN_USE' || e.status === 'MAINTENANCE').length ?? 0;

  const kpis = [
    { label: 'Équipements total', value: totalEq,         icon: Laptop,        color: 'bg-green-50  text-green-600',  link: '/dashboard/inventory' },
    { label: 'Réservations en attente', value: enAttente.length, icon: ClipboardList, color: 'bg-yellow-50 text-yellow-600', link: '/dashboard/reservations' },
    { label: 'Emprunts actifs',   value: loansActifs,     icon: Archive,       color: 'bg-blue-50   text-blue-600',   link: '/dashboard/loans' },
    { label: 'Équipements indispos', value: eqIndispos,   icon: AlertCircle,   color: 'bg-red-50    text-red-500',    link: '/dashboard/inventory' },
  ];

  return (
    <motion.div className="space-y-8" variants={container} initial="hidden" animate="visible">

      {/* Titre */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Vue d&apos;ensemble de votre parc PeriGreen.</p>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} to={kpi.link}>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <div className={`p-3 rounded-xl ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-400 font-medium leading-tight">{kpi.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Réservations en attente */}
        <motion.div variants={item} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
              <ClipboardList size={16} className="text-yellow-500" />
              Réservations en attente ({enAttente.length})
            </h2>
            <Link to="/dashboard/reservations" className="text-xs text-green-600 hover:underline font-medium flex items-center gap-1">
              Gérer <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {resLoading ? (
              <div className="p-8 text-center text-gray-400 text-sm">Chargement…</div>
            ) : enAttente.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
                <CheckCircle2 size={32} className="text-gray-200" />
                Aucune réservation en attente.
              </div>
            ) : (
              enAttente.slice(0, 6).map((r) => (
                <div key={r.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.equipment?.name ?? '—'}</p>
                    <p className="text-xs text-gray-400">
                      {r.requester?.email ?? '—'} · Qté {r.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatutBadge status={r.status} />
                    <Link
                      to="/dashboard/reservations"
                      className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      title="Gérer"
                    >
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Emprunts en retard */}
        <motion.div variants={item} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
              <AlertCircle size={16} className="text-red-500" />
              Emprunts en retard ({loansEnRetard.length})
            </h2>
            <Link to="/dashboard/loans" className="text-xs text-green-600 hover:underline font-medium flex items-center gap-1">
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loansLoading ? (
              <div className="p-8 text-center text-gray-400 text-sm">Chargement…</div>
            ) : loansEnRetard.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
                <CheckCircle2 size={32} className="text-gray-200" />
                Aucun emprunt en retard. Bravo !
              </div>
            ) : (
              loansEnRetard.slice(0, 6).map((loan) => (
                <div key={loan.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{loan.equipment?.name ?? '—'}</p>
                    <p className="text-xs text-gray-400">
                      {loan.borrower?.email ?? '—'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                      <Clock size={11} /> {loan.dueDate ?? '—'}
                    </span>
                    <span className="text-[10px] text-red-400 font-medium">EN RETARD</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

      </div>

      {/* Actions rapides admin */}
      <motion.div variants={item}>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Actions rapides</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/dashboard/inventory"
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-sm"
          >
            <Laptop size={15} /> Gérer l&apos;inventaire
          </Link>
          <Link
            to="/dashboard/reservations"
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ClipboardList size={15} /> Traiter les réservations
          </Link>
          <Link
            to="/dashboard/loans"
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Archive size={15} /> Suivre les emprunts
          </Link>
        </div>
      </motion.div>

      {/* Avertissement indisponibilités */}
      {eqIndispos > 0 && (
        <motion.div variants={item} className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
          <XCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
          <p className="text-sm text-orange-700">
            <strong>{eqIndispos} équipement{eqIndispos > 1 ? 's' : ''}</strong>{' '}
            {eqIndispos > 1 ? 'sont' : 'est'} actuellement en maintenance ou en cours d&apos;emprunt.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
