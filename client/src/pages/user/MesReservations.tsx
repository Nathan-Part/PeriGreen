import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarCheck, PlusCircle, Hourglass, CheckCircle2, XCircle, Clock, Ban } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useReservations } from '../../hooks/useReservations';

const statutConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  EN_ATTENTE: { label: 'En attente',  color: 'badge-warning',  icon: <Hourglass size={13} /> },
  VALIDEE:    { label: 'Validée',     color: 'badge-success',  icon: <CheckCircle2 size={13} /> },
  REFUSEE:    { label: 'Refusée',     color: 'badge-danger',   icon: <XCircle size={13} /> },
  ANNULEE:    { label: 'Annulée',     color: 'badge-default',  icon: <XCircle size={13} /> },
  EXPIREE:    { label: 'Expirée',     color: 'badge-warning',  icon: <Clock size={13} /> },
};

function StatutBadge({ status }: { status: string }) {
  const cfg = statutConfig[status] ?? { label: status, color: 'badge-default', icon: null };
  return (
    <span className={cfg.color}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

export default function MesReservations() {
  const { user } = useAuth();
  const { reservations, fetchMine, cancel, isLoading } = useReservations();
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) fetchMine(user.id);
  }, [user?.id, fetchMine]);

  const handleCancel = async (id: number) => {
    setCancelingId(id);
    setErrorMsg(null);
    try {
      await cancel(id);
    } catch (e) {
      setErrorMsg((e as Error).message ?? 'Une erreur est survenue.');
    } finally {
      setCancelingId(null);
      setConfirmId(null);
    }
  };

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
          className="btn-primary"
        >
          <PlusCircle size={16} />
          Nouvelle réservation
        </Link>
      </div>

      {/* Message d'erreur */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm animate-pulse space-y-4" />
          ))
        ) : reservations.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
            <CalendarCheck size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Aucune réservation trouvée.</p>
          </div>
        ) : (
          reservations.map((r) => {
            const dateRetour = (r.status === 'VALIDEE' && r.validatedAt)
              ? new Date(r.validatedAt).toLocaleDateString('fr-FR')
              : '—';
            const isConfirming = confirmId === r.id;
            const isCanceling = cancelingId === r.id;

            return (
              <motion.div
                key={r.id}
                layout
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4"
              >
                {/* Header: Equipment + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{r.equipment?.name ?? '—'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Qté: {r.quantity}</p>
                  </div>
                  <StatutBadge status={r.status} />
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Demandée le</span>
                    <p className="text-sm font-medium text-gray-700">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR') : '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Date retour</span>
                    <p className="text-sm font-medium text-gray-700">{dateRetour}</p>
                  </div>
                </div>

                {/* Note */}
                {r.decisionNote && r.decisionNote !== '—' && (
                  <div className="pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400 italic">Note: {r.decisionNote}</span>
                  </div>
                )}

                {/* Actions */}
                {r.status === 'EN_ATTENTE' ? (
                  <div className="pt-3 border-t border-gray-50">
                    {isConfirming ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCancel(r.id)}
                          disabled={isCanceling}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60"
                        >
                          {isCanceling ? 'Annulation…' : 'Confirmer'}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          disabled={isCanceling}
                          className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          Retour
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(r.id)}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <Ban size={13} />
                        Annuler la réservation
                      </button>
                    )}
                  </div>
                ) : null}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block pg-card">
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
                <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-5 h-14 bg-gray-50/30" />
                  </tr>
                ))
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <CalendarCheck size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Aucune réservation trouvée.</p>
                  </td>
                </tr>
              ) : (
                reservations.map((r) => {
                  const dateRetour = (r.status === 'VALIDEE' && r.validatedAt)
                    ? new Date(r.validatedAt).toLocaleDateString('fr-FR')
                    : '—';
                  const isConfirming = confirmId === r.id;
                  const isCanceling = cancelingId === r.id;

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                      onClick={() => navigate(`/espace/reservations/${r.id}`)}
                    >
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
                      <td className="px-6 py-4">
                        {r.status === 'EN_ATTENTE' && (
                          isConfirming ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleCancel(r.id); }}
                                disabled={isCanceling}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60"
                              >
                                {isCanceling ? 'Annulation…' : 'Confirmer'}
                              </button>
                              <button
                                onClick={(e: React.MouseEvent) => { e.stopPropagation(); setConfirmId(null); }}
                                disabled={isCanceling}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              >
                                Retour
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e: React.MouseEvent) => { e.stopPropagation(); setConfirmId(r.id); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                              <Ban size={13} />
                              Annuler
                            </button>
                          )
                        )}
                      </td>
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
