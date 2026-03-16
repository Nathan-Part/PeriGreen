import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Package2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useEquipment } from '../hooks/useEquipment';
import { isAdminUser, useAuth } from '../hooks/useAuth';
import { useCreateReservation, useReservations } from '../hooks/useLoans';

export default function EquipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: equipment, isLoading } = useEquipment(id ?? '');
  const { data: reservations = [] } = useReservations();
  const createReservation = useCreateReservation();
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState(false);

  const isAdmin = isAdminUser(user);
  const equipmentReservations = reservations.filter((reservation) => reservation.equipment.id === Number(id));
  const pendingCount = equipmentReservations.filter((reservation) => reservation.status === 'EN_ATTENTE').length;

  const handleReservation = () => {
    if (!user || !equipment) {
      return;
    }

    createReservation.mutate(
      {
        equipmentId: equipment.id,
        quantity,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setQuantity(1);
        },
      }
    );
  };

  if (isLoading) {
    return <div className="p-12 text-center">Chargement...</div>;
  }

  if (!equipment) {
    return <div className="p-12 text-center text-danger-500 font-bold">Equipement introuvable</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-perigreen-600"
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="border-none shadow-md">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge variant="info">{equipment.category.name}</Badge>
                <CardTitle className="mt-4 text-3xl">{equipment.name}</CardTitle>
                <p className="mt-2 text-sm text-gray-500">
                  {equipment.brand} · {equipment.model}
                </p>
              </div>
              <Badge variant={equipment.totalQuantity > 0 ? 'success' : 'warning'}>
                {equipment.totalQuantity > 0 ? `${equipment.totalQuantity} disponibles` : 'Indisponible'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-3xl bg-gray-50 p-8">
              <div className="flex items-center gap-3 text-perigreen-700">
                <Package2 size={24} />
                <span className="font-semibold">Fiche equipement harmonisee</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">{equipment.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InfoCard label="Etat" value={equipment.etat} />
              <InfoCard label="Numero de serie" value={equipment.serialNumber} />
              <InfoCard label="Marque" value={equipment.brand} />
              <InfoCard label="Modele" value={equipment.model} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>{isAdmin ? 'Lecture admin' : 'Demande utilisateur'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAdmin ? (
                <>
                  <p className="text-sm text-gray-600">
                    L&apos;admin supervise cet equipement, les demandes en attente et la disponibilite globale.
                  </p>
                  <div className="rounded-2xl bg-perigreen-50 p-4 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">Reservations en attente</p>
                    <p className="mt-1">{pendingCount}</p>
                  </div>
                </>
              ) : (
                <>
                  {success ? (
                    <div className="rounded-2xl bg-green-50 p-4 text-green-700">
                      <div className="flex items-center gap-2 font-semibold">
                        <CheckCircle2 size={18} />
                        Reservation envoyee
                      </div>
                      <p className="mt-2 text-sm">
                        Votre demande est maintenant visible dans votre espace utilisateur et dans le dashboard admin.
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">
                        L&apos;utilisateur ne cree pas directement un pret. Il envoie une reservation, puis l&apos;admin la traite.
                      </p>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="quantity">
                        Quantite souhaitee
                      </label>
                      <input
                        id="quantity"
                        min={1}
                        max={Math.max(equipment.totalQuantity, 1)}
                        type="number"
                        value={quantity}
                        onChange={(event) => setQuantity(Number(event.target.value))}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-perigreen-500 focus:ring-2 focus:ring-perigreen-100"
                      />
                      <Button
                        className="w-full"
                        onClick={handleReservation}
                        isLoading={createReservation.isPending}
                        disabled={equipment.totalQuantity <= 0}
                      >
                        Envoyer une reservation
                      </Button>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-slate-950 text-white">
            <CardContent className="pt-6 text-sm text-white/80">
              <p className="font-semibold text-white">Pourquoi cette separation ?</p>
              <p className="mt-2">
                L&apos;interface utilisateur doit guider la demande. L&apos;interface admin doit piloter la validation et la mise a disposition.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <p className="mt-2 font-semibold text-gray-900">{value}</p>
    </div>
  );
}
