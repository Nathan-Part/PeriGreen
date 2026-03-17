import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, PlusCircle, Hourglass, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useReservations } from '../../hooks/useReservations';

const statutConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  EN_ATTENTE: { label: 'En attente',  color: 'bg-yellow-50 text-yellow-700 border-yellow-200',  icon: <Hourglass size={13} /> },
  VALIDEE:    { label: 'Validée',     color: 'bg-green-50  text-green-700  border-green-200',   icon: <CheckCircle2 size={13} /> },
  REFUSEE:    { label: 'Refusée',     color: 'bg-red-50    text-red-700    border-red-200',     icon: <XCircle size={13} /> },
  ANNULEE:    { label: 'Annulée',     color: 'bg-gray-50   text-gray-600   border-gray-200',    icon: <XCircle size={13} /> },
  EXPIREE:    { label: 'Expirée',     color: 'bg-orange-50 text-orange-700 border-orange-200',  icon: <Clock size={13} /> },
};

function StatutBadge({ status }: { status: string }) {
  const cfg = statutConfig[status] ?? { label: status, color: 'bg-gray-50 text-gray-600 border-gray-200', icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

export default function MesReservations() {
  const { user } = useAuth();
  const { reservations, fetchMine, isLoading } = useReservations();

  useEffect(() => {
    if (user?.id) fetchMine(user.id);
  }, [user?.id, fetchMine]);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes réservations</h1>
          <p className="text-gray-500 text-sm mt-1">Historique de toutes vos demandes de matériel.</p>
        </div>
        <Link
          to="/espace/reservations/nouvelle"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-sm"
        >
          <PlusCircle size={16} />
          Nouvelle réservation
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Matériel</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Qté</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Demandée le</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Date retour</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-5 h-14 bg-gray-50/30" />
                  </tr>
                ))
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <CalendarCheck size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Aucune réservation trouvée.</p>
                  </td>
                </tr>
              ) : (
                reservations.map((r) => {
                  // Date de retour = validatedAt si validée, sinon rien
                  const dateRetour = (r.status === 'VALIDEE' && r.validatedAt)
                    ? new Date(r.validatedAt).toLocaleDateString('fr-FR')
                    : '—';
                  return (
                    <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 text-sm">{r.equipment?.name ?? '—'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{r.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{dateRetour}</td>
                      <td className="px-6 py-4"><StatutBadge status={r.status} /></td>
                      <td className="px-6 py-4 text-sm text-gray-400 italic">{r.decisionNote ?? '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
