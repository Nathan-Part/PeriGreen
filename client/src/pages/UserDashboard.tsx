import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock3, Laptop, PackageSearch, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { useEquipments } from '../hooks/useEquipment';
import { useLoans, useReservations } from '../hooks/useLoans';

export default function UserDashboard() {
  const { user } = useAuth();
  const { data: equipments = [] } = useEquipments();
  const { data: loans = [] } = useLoans();
  const { data: reservations = [] } = useReservations();

  const myLoans = loans.filter((loan) => loan.borrower.id === user?.id);
  const myReservations = reservations.filter((reservation) => reservation.requester.id === user?.id);

  const stats = [
    { label: 'Equipements disponibles', value: equipments.length, icon: PackageSearch },
    { label: 'Mes emprunts', value: myLoans.length, icon: Laptop },
    { label: 'Mes reservations', value: myReservations.length, icon: Clock3 },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-perigreen-700 via-perigreen-600 to-emerald-500 text-white p-8 md:p-10">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-black/10 blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <Badge className="mb-4 bg-white/10 text-white border-white/20">Espace utilisateur</Badge>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Bonjour {user?.fullName ?? 'Utilisateur'}, votre espace PeriGreen est pret.
          </h1>
          <p className="mt-4 text-white/85 text-lg leading-relaxed">
            Retrouvez rapidement le materiel disponible, l&apos;etat de vos demandes et vos emprunts en cours.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/dashboard/inventory"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-perigreen-700 shadow-lg"
            >
              Explorer le catalogue <ArrowRight size={16} />
            </Link>
            <Link
              to="/dashboard/loans"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white"
            >
              Suivre mes demandes
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex rounded-2xl bg-perigreen-50 p-3 text-perigreen-700">
                  <stat.icon size={24} />
                </div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="mt-1 text-3xl font-black text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Dernieres demandes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {myReservations.length === 0 ? (
              <p className="text-sm text-gray-500">
                Aucune reservation pour le moment. Vous pouvez demander du materiel depuis le catalogue.
              </p>
            ) : (
              myReservations.slice(0, 4).map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
                  <div>
                    <p className="font-semibold text-gray-900">{reservation.equipment.name}</p>
                    <p className="text-sm text-gray-500">Quantite demandee : {reservation.quantity}</p>
                  </div>
                  <Badge>{reservation.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ShieldCheck size={18} />
              Bonnes pratiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/80">
            <p>Utilisez les reservations pour faire valider un besoin avant la creation d&apos;un pret.</p>
            <p>Le detail d&apos;un equipement montre les informations utiles avant toute demande.</p>
            <p>Vos donnees visibles sont limitees a votre propre activite, alors que l&apos;admin a une vision globale.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
