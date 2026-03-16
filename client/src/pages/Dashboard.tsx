import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, ClipboardList, Leaf, Package2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useEquipments } from '../hooks/useEquipment';
import { useLoans, useReservations } from '../hooks/useLoans';
import { useUsers } from '../hooks/useUsers';

export default function Dashboard() {
  const { data: equipments = [] } = useEquipments();
  const { data: loans = [] } = useLoans();
  const { data: reservations = [] } = useReservations();
  const { data: users = [] } = useUsers();

  const activeLoans = loans.filter((loan) => loan.status === 'EN_COURS' || loan.status === 'EN_RETARD');
  const pendingReservations = reservations.filter((reservation) => reservation.status === 'EN_ATTENTE');

  const stats = [
    { label: 'Utilisateurs', value: users.length, icon: Users },
    { label: 'Equipements', value: equipments.length, icon: Package2 },
    { label: 'Prets actifs', value: activeLoans.length, icon: ClipboardList },
    { label: 'Demandes en attente', value: pendingReservations.length, icon: BarChart3 },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-perigreen-900 p-8 text-white">
        <Badge className="mb-4 bg-white/10 border-white/20 text-white">Dashboard administrateur</Badge>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Pilotez l&apos;ecosysteme PeriGreen avec une vision claire des flux.
            </h1>
            <p className="mt-4 text-white/75 text-lg">
              Le back-office admin doit rester distinct de l&apos;espace utilisateur : ici vous supervisez le parc,
              les demandes et les volumes de pret.
            </p>
          </div>
          <Link
            to="/admin/loans"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900"
          >
            Traiter les demandes <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Reservations a traiter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingReservations.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune reservation en attente pour le moment.</p>
            ) : (
              pendingReservations.slice(0, 5).map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
                  <div>
                    <p className="font-semibold text-gray-900">{reservation.equipment.name}</p>
                    <p className="text-sm text-gray-500">{reservation.requester.email}</p>
                  </div>
                  <Badge variant="warning">{reservation.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-perigreen-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf size={18} />
              Lecture senior du produit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p>Le dashboard admin sert a superviser des flux globaux, pas a reproduire l&apos;experience utilisateur.</p>
            <p>Le dashboard utilisateur sert a agir vite sur ses propres besoins, pas a voir tout le parc.</p>
            <p>Cette separation clarifie les permissions et rend l&apos;application plus maintenable.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
