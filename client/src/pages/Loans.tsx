import { CalendarDays, CheckCircle2, ClipboardList, Hourglass, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useLoans, useReservations } from '../hooks/useLoans';
import { isAdminUser, useAuth } from '../hooks/useAuth';

const loanBadgeVariant = {
  EN_COURS: 'info',
  EN_RETARD: 'danger',
  RETOUR_DEMANDE: 'warning',
  TERMINE: 'success',
} as const;

const reservationBadgeVariant = {
  EN_ATTENTE: 'warning',
  VALIDEE: 'success',
  REFUSEE: 'danger',
  ANNULEE: 'default',
  EXPIREE: 'default',
} as const;

export default function Loans() {
  const { user } = useAuth();
  const { data: loans = [], isLoading: loansLoading } = useLoans();
  const { data: reservations = [], isLoading: reservationsLoading } = useReservations();

  const isAdmin = isAdminUser(user);
  const visibleLoans = isAdmin ? loans : loans.filter((loan) => loan.borrower.id === user?.id);
  const visibleReservations = isAdmin
    ? reservations
    : reservations.filter((reservation) => reservation.requester.id === user?.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {isAdmin ? 'Flux des prets et reservations' : 'Mes demandes et mes emprunts'}
        </h1>
        <p className="mt-2 text-gray-500">
          {isAdmin
            ? 'Vision globale des reservations en attente et des prets actuellement actifs.'
            : 'Suivez ce que vous avez demande et ce qui vous a deja ete attribue.'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hourglass size={18} />
              Reservations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reservationsLoading ? (
              <p className="text-sm text-gray-500">Chargement des reservations...</p>
            ) : visibleReservations.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune reservation a afficher.</p>
            ) : (
              visibleReservations.map((reservation) => (
                <div key={reservation.id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">{reservation.equipment.name}</p>
                      <p className="text-sm text-gray-500">
                        {isAdmin ? reservation.requester.email : `Quantite : ${reservation.quantity}`}
                      </p>
                    </div>
                    <Badge variant={reservationBadgeVariant[reservation.status]}>
                      {reservation.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs text-gray-400">Creee le {reservation.createdAt}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList size={18} />
              Prets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loansLoading ? (
              <p className="text-sm text-gray-500">Chargement des prets...</p>
            ) : visibleLoans.length === 0 ? (
              <p className="text-sm text-gray-500">Aucun pret a afficher.</p>
            ) : (
              visibleLoans.map((loan) => (
                <div key={loan.id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">{loan.equipment.name}</p>
                      <p className="text-sm text-gray-500">
                        {isAdmin ? loan.borrower.email : `Quantite : ${loan.quantity}`}
                      </p>
                    </div>
                    <Badge variant={loanBadgeVariant[loan.status]}>{loan.status}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={12} />
                      Debut : {loan.pickupDate}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Echeance : {loan.dueDate}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none bg-perigreen-50 shadow-md">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 text-perigreen-700" size={20} />
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Harmonisation des roles</p>
              <p className="mt-1">
                {isAdmin
                  ? 'En tant qu administrateur, vous voyez le flux global et prenez les decisions de validation.'
                  : 'En tant qu utilisateur, vous ne voyez que vos propres reservations et vos propres prets.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
