import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, ClipboardList, MessageSquare } from 'lucide-react';
import { useReservations } from '../../hooks/useReservations';

const statutConfig: Record<string, { label: string; color: string }> = {
  EN_ATTENTE: { label: 'En attente', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  VALIDEE:    { label: 'Validée',    color: 'bg-green-50  text-green-700  border-green-200' },
  REFUSEE:    { label: 'Refusée',    color: 'bg-red-50    text-red-700    border-red-200' },
  ANNULEE:    { label: 'Annulée',    color: 'bg-gray-50   text-gray-600   border-gray-200' },
  EXPIREE:    { label: 'Expirée',    color: 'bg-orange-50 text-orange-700 border-orange-200' },
};

function StatutBadge({ status }: { status: string }) {
  const cfg = statutConfig[status] ?? { label: status, color: 'bg-gray-50 text-gray-600 border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export default function GestionReservations() {
  const { reservations, fetchAll, isLoading, updateStatus } = useReservations();
  const [activeNote, setActiveNote] = useState<Record<number, string>>({});
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [filterStatut, setFilterStatut] = useState('TOUS');

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = filterStatut === 'TOUS'
    ? reservations
    : reservations.filter((r) => r.status === filterStatut);

  const handleAction = async (id: number, status: 'VALIDEE' | 'REFUSEE') => {
    setActionLoading(id);
    try {
      await updateStatus(id, status, activeNote[id] ?? '');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des réservations</h1>
          <p className="text-sm text-gray-500 mt-1">Validez ou refusez les demandes des étudiants.</p>
        </div>
        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          {['TOUS', 'EN_ATTENTE', 'VALIDEE', 'REFUSEE', 'ANNULEE', 'EXPIREE'].map((s) => (
            <option key={s} value={s}>{s === 'TOUS' ? 'Tous les statuts' : statutConfig[s]?.label ?? s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Équipement</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Étudiant</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Qté</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Demandée le</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Note</th>
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
                    <td className="px-5 py-4">
                      {r.status === 'EN_ATTENTE' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAction(r.id, 'VALIDEE')}
                            disabled={actionLoading === r.id}
                            title="Valider"
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
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300 italic">—</span>
                      )}
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
