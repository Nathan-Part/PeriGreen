import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Hourglass,
  XCircle,
  Clock,
  PackageCheck,
  PackageX,
  AlertTriangle,
} from 'lucide-react';
import { getReservationById, returnLoan, type Reservation } from '../../services/api';

// ─── Badges Réservation ────────────────────────────────────────────────────
const reservationStatutConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  EN_ATTENTE:  { label: 'En attente', color: 'badge-warning',  icon: <Hourglass size={13} /> },
  VALIDEE:     { label: 'Validée',    color: 'badge-success',  icon: <CheckCircle2 size={13} /> },
  REFUSEE:     { label: 'Refusée',    color: 'badge-danger',   icon: <XCircle size={13} /> },
  ANNULEE:     { label: 'Annulée',    color: 'badge-default',  icon: <XCircle size={13} /> },
  EXPIREE:     { label: 'Expirée',    color: 'badge-warning',  icon: <Clock size={13} /> },
};

// ─── Badges Prêt ───────────────────────────────────────────────────────────
const loanStatutConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  EN_COURS:        { label: 'En cours',        color: 'badge-success', icon: <PackageCheck size={13} /> },
  RETOUR_DEMANDE:  { label: 'Retour demandé',  color: 'badge-warning', icon: <Clock size={13} /> },
  EN_RETARD:       { label: 'En retard',        color: 'badge-danger',  icon: <AlertTriangle size={13} /> },
  TERMINE:         { label: 'Terminé',          color: 'badge-default', icon: <PackageX size={13} /> },
};

function ReservationBadge({ status }: { status: string }) {
  const cfg = reservationStatutConfig[status] ?? { label: status, color: 'badge-default', icon: null };
  return <span className={cfg.color}>{cfg.icon} {cfg.label}</span>;
}

function LoanBadge({ status }: { status: string }) {
  const cfg = loanStatutConfig[status] ?? { label: status, color: 'badge-default', icon: null };
  return <span className={cfg.color}>{cfg.icon} {cfg.label}</span>;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

// ─── Composant principal ───────────────────────────────────────────────────
export default function DetailReservation() {
  const { id } = useParams<{ id: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [returnError, setReturnError] = useState<string | null>(null);

  const fetchReservation = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getReservationById(Number(id));
      setReservation(data);
    } catch (e) {
      setError((e as Error).message ?? 'Erreur lors du chargement.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservation();
  }, [id]);

  const handleReturn = async () => {
    if (!reservation?.loan?.id) return;
    setIsReturning(true);
    setReturnError(null);
    try {
      await returnLoan(reservation.loan.id);
      await fetchReservation();
    } catch (e) {
      setReturnError((e as Error).message ?? 'Erreur lors du retour.');
    } finally {
      setIsReturning(false);
    }
  };

  // ─── États de chargement / erreur ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="space-y-4">
        <Link to="/espace/reservations" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} /> Retour à mes réservations
        </Link>
        <div className="pg-card p-8 text-center">
          <XCircle size={40} className="text-red-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">{error ?? 'Réservation introuvable.'}</p>
        </div>
      </div>
    );
  }

  const loan = reservation.loan;
  const loanIsActive = loan && loan.status !== 'TERMINE';

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Retour */}
      <Link
        to="/espace/reservations"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Retour à mes réservations
      </Link>

      {/* Titre */}
      <h1 className="text-2xl font-bold text-gray-900">
        Réservation <span className="text-gray-400 font-normal">#{reservation.id}</span>
      </h1>

      {/* ─── Bloc Réservation ─────────────────────────────────────────────── */}
      <div className="pg-card divide-y divide-gray-100">
        <div className="px-6 py-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Réservation</h2>
        </div>
        <div className="px-6 py-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs mb-1">Équipement</p>
            <p className="font-medium text-gray-900">{reservation.equipment?.name ?? '—'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Quantité</p>
            <p className="font-medium text-gray-900">{reservation.quantity}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Statut</p>
            <ReservationBadge status={reservation.status} />
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Demandé le</p>
            <p className="text-gray-700">{formatDate(reservation.createdAt)}</p>
          </div>
          {reservation.validatedAt && (
            <div>
              <p className="text-gray-400 text-xs mb-1">Validé le</p>
              <p className="text-gray-700">{formatDate(reservation.validatedAt)}</p>
            </div>
          )}
          {reservation.decisionNote && (
            <div className="col-span-2">
              <p className="text-gray-400 text-xs mb-1">Note de l'administrateur</p>
              <p className="text-gray-700 italic">{reservation.decisionNote}</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Bloc Prêt ────────────────────────────────────────────────────── */}
      {loan && (
        <div className="pg-card divide-y divide-gray-100">
          <div className="px-6 py-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Prêt</h2>
          </div>
          <div className="px-6 py-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">Retiré le</p>
              <p className="text-gray-700">{formatDate(loan.pickupDate)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">À rendre avant le</p>
              <p className="text-gray-700">{formatDate(loan.dueDate)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Statut du prêt</p>
              <LoanBadge status={loan.status} />
            </div>
            {loan.returnDate && (
              <div>
                <p className="text-gray-400 text-xs mb-1">Rendu le</p>
                <p className="text-gray-700">{formatDate(loan.returnDate)}</p>
              </div>
            )}
          </div>

          {/* ─── Bouton retour ──────────────────────────────────────────── */}
          {loanIsActive && (
            <div className="px-6 py-5">
              {returnError && (
                <div className="mb-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  {returnError}
                </div>
              )}
              <button
                onClick={handleReturn}
                disabled={isReturning}
                className="btn-primary disabled:opacity-60"
              >
                {isReturning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Enregistrement…
                  </>
                ) : (
                  <>
                    <PackageX size={16} />
                    J'ai rendu l'objet
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
