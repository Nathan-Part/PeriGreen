import { BarChart3, ClipboardList, Leaf, Package2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useEquipments } from '../hooks/useEquipment';
import { useLoans, useReservations } from '../hooks/useLoans';
import { useUsers } from '../hooks/useUsers';

export default function Stats() {
  const { data: equipments = [] } = useEquipments();
  const { data: loans = [] } = useLoans();
  const { data: reservations = [] } = useReservations();
  const { data: users = [] } = useUsers();

  const totalQuantity = equipments.reduce((sum, equipment) => sum + equipment.totalQuantity, 0);
  const pendingReservations = reservations.filter((reservation) => reservation.status === 'EN_ATTENTE').length;
  const activeLoans = loans.filter((loan) => loan.status === 'EN_COURS' || loan.status === 'EN_RETARD').length;
  const estimatedImpact = Math.round(totalQuantity * 6.5);

  const cards = [
    { label: 'References materiel', value: equipments.length, icon: Package2 },
    { label: 'Unites gerees', value: totalQuantity, icon: BarChart3 },
    { label: 'Utilisateurs', value: users.length, icon: Users },
    { label: 'Impact estime', value: `${estimatedImpact} kg CO2`, icon: Leaf },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Statistiques administrateur</h1>
        <p className="mt-2 text-gray-500">
          Lecture transverse des usages, du parc et des demandes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex rounded-2xl bg-perigreen-50 p-3 text-perigreen-700">
                <card.icon size={24} />
              </div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="mt-1 text-3xl font-black text-gray-900">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Suivi operationnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatRow label="Reservations en attente" value={pendingReservations} />
            <StatRow label="Prets actifs ou en retard" value={activeLoans} />
            <StatRow label="Demandes traitees" value={reservations.length - pendingReservations} />
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-slate-950 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ClipboardList size={18} />
              Lecture produit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/80">
            <p>Un bon dashboard admin synthese les flux et les ecarts, il ne recopie pas juste la liste des donnees.</p>
            <p>Les chiffres ici servent surtout a prioriser : stock, demandes en attente et activite de pret.</p>
            <p>Les ecrans utilisateur restent plus simples et centres sur l action individuelle.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-xl font-bold text-gray-900">{value}</span>
    </div>
  );
}
