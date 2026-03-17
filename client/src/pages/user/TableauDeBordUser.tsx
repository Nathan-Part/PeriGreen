import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, PlusCircle, Clock, CheckCircle2, XCircle, Hourglass } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useReservations } from '../../hooks/useReservations';

const statutConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  EN_ATTENTE: { label: 'En attente',  color: 'badge-warning',  icon: <Hourglass size={14} /> },
  VALIDEE:    { label: 'Validée',     color: 'badge-success',  icon: <CheckCircle2 size={14} /> },
  REFUSEE:    { label: 'Refusée',     color: 'badge-danger',   icon: <XCircle size={14} /> },
  ANNULEE:    { label: 'Annulée',     color: 'badge-default',  icon: <XCircle size={14} /> },
  EXPIREE:    { label: 'Expirée',     color: 'badge-warning',  icon: <Clock size={14} /> },
};

function StatutBadge({ status }: { status: string }) {
  const cfg = statutConfig[status] ?? { label: status, color: 'badge-default', icon: null };
  return (
    <span className={cfg.color}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

export default function TableauDeBordUser() {
  const { user } = useAuth();
  const { reservations, fetchMine, isLoading } = useReservations();

  useEffect(() => {
    if (user?.id) fetchMine(user.id);
  }, [user?.id, fetchMine]);

  const recentes = reservations.slice(0, 5);
  const enAttente = reservations.filter(r => r.status === 'EN_ATTENTE').length;
  const validees  = reservations.filter(r => r.status === 'VALIDEE').length;

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, <span className="text-green-600">{user?.email?.split('@')[0]}</span> 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gérez vos demandes de réservation de matériel.</p>
        </div>
        <Link
          to="/espace/reservations/nouvelle"
          className="btn-primary"
        >
          <PlusCircle size={16} />
          Nouvelle réservation
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total demandes',  value: reservations.length, icon: CalendarCheck, color: 'text-green-600 bg-green-50' },
          { label: 'En attente',      value: enAttente,           icon: Hourglass,     color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Validées',        value: validees,            icon: CheckCircle2,  color: 'text-blue-600 bg-blue-50' },
        ].map((kpi) => (
          <div key={kpi.label} className="pg-card p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${kpi.color}`}>
              <kpi.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
              <p className="text-xs text-gray-400 font-medium">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dernières réservations */}
      <div className="pg-card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <CalendarCheck size={17} className="text-green-500" />
            Mes dernières réservations
          </h2>
          <Link to="/espace/reservations" className="text-sm text-green-600 hover:underline font-medium">
            Voir tout
          </Link>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Chargement…</div>
        ) : recentes.length === 0 ? (
          <div className="p-10 text-center">
            <CalendarCheck size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Aucune réservation pour le moment.</p>
            <Link to="/espace/reservations/nouvelle" className="text-green-600 text-sm hover:underline mt-1 inline-block">
              Faire une première demande →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {recentes.map((r) => (
              <li key={r.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{r.equipment?.name ?? '—'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Qté : {r.quantity} · Demandée le {r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR') : '—'}
                  </p>
                </div>
                <StatutBadge status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
