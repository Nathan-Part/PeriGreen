import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ClipboardList, MessageSquare, AlertCircle, Trash2, AlertTriangle } from 'lucide-react';
import { useReservations } from '../../hooks/useReservations';

const statutConfig: Record<string, { label: string; color: string }> = {
  EN_ATTENTE: { label: 'En attente', color: 'badge-warning' },
  VALIDEE: { label: 'Validée', color: 'badge-success' },
  REFUSEE: { label: 'Refusée', color: 'badge-danger' },
  ANNULEE: { label: 'Annulée', color: 'badge-default' },
  EXPIREE: { label: 'Expirée', color: 'badge-warning' },
};

function StatutBadge({ status }: { status: string }) {
  const cfg = statutConfig[status] ?? { label: status, color: 'badge-default' };
  return <span className={cfg.color}>{cfg.label}</span>;
}

/** Modale de confirmation générique */
function ConfirmModal({
  message,
  onConfirm,
  onCancel,
  isLoading,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-xl">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Confirmer la suppression</h3>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="h-4 w-4 border-2 border-red-200 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 size={14} /> Supprimer
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function GestionReservations() {
  const { reservations, fetchAll, isLoading, updateStatus, deleteOne, deleteAll, error } = useReservations();
  const [activeNote, setActiveNote] = useState<Record<number, string>>({});
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [filterStatut, setFilterStatut] = useState('TOUS');

  // États pour la suppression
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);       // id pour suppression unitaire
  const [deleteAllPending, setDeleteAllPending] = useState(false);             // flag "tout supprimer"
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchAll();
    useReservations.setState({ error: null });
  }, [fetchAll]);

  const sortedReservations = [...reservations].sort((a, b) => b.id - a.id);

  const filtered = filterStatut === 'TOUS'
    ? sortedReservations
    : sortedReservations.filter((r) => r.status === filterStatut);

  const handleAction = async (id: number, status: 'VALIDEE' | 'REFUSEE') => {
    setActionLoading(id);
    useReservations.setState({ error: null });
    try {
      await updateStatus(id, status, activeNote[id] ?? '');
    } catch (err) {
      console.error('Erreur action:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Suppression unitaire ──
  const handleDeleteOne = async () => {
    if (deleteTarget === null) return;
    setDeleteLoading(true);
    try {
      await deleteOne(deleteTarget);
    } catch {/* error already in store */} finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  // ── Tout supprimer (réservations filtrées) ──
  const handleDeleteAll = async () => {
    setDeleteLoading(true);
    try {
      await deleteAll(filtered.map((r) => r.id));
    } catch {/* error already in store */} finally {
      setDeleteLoading(false);
      setDeleteAllPending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Modales de confirmation ── */}
      <AnimatePresence>
        {deleteTarget !== null && (
          <ConfirmModal
            message={`Supprimer définitivement la réservation #${deleteTarget} ? Cette action est irréversible.`}
            onConfirm={handleDeleteOne}
            onCancel={() => setDeleteTarget(null)}
            isLoading={deleteLoading}
          />
        )}
        {deleteAllPending && (
          <ConfirmModal
            message={`Supprimer définitivement les ${filtered.length} réservation(s) affichée(s) ? Cette action est irréversible.`}
            onConfirm={handleDeleteAll}
            onCancel={() => setDeleteAllPending(false)}
            isLoading={deleteLoading}
          />
        )}
      </AnimatePresence>

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des réservations</h1>
          <p className="text-sm text-gray-500 mt-1">Validez ou refusez les demandes des étudiants.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            {['TOUS', 'EN_ATTENTE', 'VALIDEE', 'REFUSEE', 'ANNULEE', 'EXPIREE'].map((s) => (
              <option key={s} value={s}>{s === 'TOUS' ? 'Tous les statuts' : statutConfig[s]?.label ?? s}</option>
            ))}
          </select>

          {/* Bouton "Tout supprimer" */}
          {filtered.length > 0 && (
            <button
              onClick={() => setDeleteAllPending(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 border border-red-200 transition-colors"
            >
              <Trash2 size={14} />
              Tout supprimer ({filtered.length})
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={16} />
          <span className="font-semibold uppercase text-[10px] bg-red-100 px-1.5 py-0.5 rounded mr-1">Erreur</span>
          {error}
        </div>
      )}

      {/* ─── Mobile Card View ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm animate-pulse space-y-4">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-8 bg-gray-100 rounded w-full" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
            <ClipboardList size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Aucune réservation trouvée.</p>
          </div>
        ) : (
          filtered.map((r) => (
            <motion.div
              key={r.id}
              layout
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{r.equipment?.name ?? '—'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.requester?.email ?? '—'}</p>
                </div>
                <StatutBadge status={r.status} />
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Quantité</span>
                  <p className="text-sm font-medium text-gray-700">{r.quantity}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Date</span>
                  <p className="text-sm font-medium text-gray-700">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR') : '—'}
                  </p>
                </div>
              </div>

              {/* Note */}
              <div className="pt-3 border-t border-gray-50">
                {r.status === 'EN_ATTENTE' ? (
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-gray-300 shrink-0" />
                    <input
                      type="text"
                      placeholder="Note optionnelle…"
                      value={activeNote[r.id] ?? ''}
                      onChange={(e) => setActiveNote((n) => ({ ...n, [r.id]: e.target.value }))}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-300"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 italic">{r.decisionNote ?? '—'}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                {r.status === 'EN_ATTENTE' && (
                  <>
                    <button
                      onClick={() => handleAction(r.id, 'VALIDEE')}
                      disabled={actionLoading === r.id}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
                    >
                      {actionLoading === r.id ? (
                        <span className="h-4 w-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" />
                      ) : (
                        <><CheckCircle2 size={16} /> Valider</>
                      )}
                    </button>
                    <button
                      onClick={() => handleAction(r.id, 'REFUSEE')}
                      disabled={actionLoading === r.id}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
                    >
                      <XCircle size={16} /> Refuser
                    </button>
                  </>
                )}
                {/* Bouton supprimer (toujours visible) */}
                <button
                  onClick={() => setDeleteTarget(r.id)}
                  title="Supprimer cette réservation"
                  className="p-2 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ─── Desktop Table View ───────────────────────────────────────────── */}
      <div className="hidden md:block pg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Équipement</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Étudiant</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Qté</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Demandée le</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Note / Échéance</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-5 py-5 h-14 bg-gray-50/30" />
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <ClipboardList size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Aucune réservation trouvée.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{r.equipment?.name ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-500">{r.requester?.email ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-700">{r.quantity}</td>
                    <td className="px-5 py-4 text-gray-400">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="px-5 py-4"><StatutBadge status={r.status} /></td>

                    {/* Note */}
                    <td className="px-5 py-4">
                      {r.status === 'EN_ATTENTE' ? (
                        <div className="flex items-center gap-1.5">
                          <MessageSquare size={13} className="text-gray-300 shrink-0" />
                          <input
                            type="text"
                            placeholder="Note optionnelle…"
                            value={activeNote[r.id] ?? ''}
                            onChange={(e) => setActiveNote((n) => ({ ...n, [r.id]: e.target.value }))}
                            className="border border-gray-200 rounded-lg px-2 py-1 text-xs w-36 focus:outline-none focus:ring-1 focus:ring-green-300"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">{r.decisionNote ?? '—'}</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {r.status === 'EN_ATTENTE' && (
                          <>
                            <button
                              onClick={() => handleAction(r.id, 'VALIDEE')}
                              disabled={actionLoading === r.id}
                              title="Valider et créer le prêt"
                              className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {actionLoading === r.id ? (
                                <span className="h-4 w-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin block" />
                              ) : (
                                <CheckCircle2 size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => handleAction(r.id, 'REFUSEE')}
                              disabled={actionLoading === r.id}
                              title="Refuser"
                              className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {/* Bouton supprimer */}
                        <button
                          onClick={() => setDeleteTarget(r.id)}
                          title="Supprimer cette réservation"
                          className="p-1.5 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
