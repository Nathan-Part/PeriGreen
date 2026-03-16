import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, PackageSearch, Search } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useEquipments } from '../hooks/useEquipment';
import { isAdminUser, useAuth } from '../hooks/useAuth';

export default function Inventory() {
  const { user } = useAuth();
  const { data: equipments = [], isLoading } = useEquipments();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  const categories = Array.from(new Set(equipments.map((equipment) => equipment.category.name)));
  const filteredEquipments = equipments.filter((equipment) => {
    const normalizedSearch = search.toLowerCase();
    const matchesSearch = [equipment.name, equipment.brand, equipment.model, equipment.serialNumber]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch);
    const matchesCategory = category === 'ALL' || equipment.category.name === category;

    return matchesSearch && matchesCategory;
  });

  const isAdmin = isAdminUser(user);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {isAdmin ? 'Inventaire du parc' : 'Catalogue des equipements'}
          </h1>
          <p className="mt-2 text-gray-500">
            {isAdmin
              ? 'Vision globale du parc pour le suivi et la supervision.'
              : 'Consultez les equipements disponibles avant de faire une demande.'}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nom, marque, modele, numero de serie..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-perigreen-500 focus:ring-2 focus:ring-perigreen-100"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-perigreen-500 focus:ring-2 focus:ring-perigreen-100"
          >
            <option value="ALL">Toutes les categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-64 rounded-3xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filteredEquipments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <Filter className="text-gray-300" size={30} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Aucun equipement trouve</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Ajustez vos filtres ou revenez plus tard, le catalogue pourra evoluer en fonction des disponibilites.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredEquipments.map((equipment, index) => (
            <motion.div
              key={equipment.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="h-full border-none shadow-md">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <Badge variant="info">{equipment.category.name}</Badge>
                    <Badge variant={equipment.totalQuantity > 0 ? 'success' : 'warning'}>
                      {equipment.totalQuantity > 0 ? `${equipment.totalQuantity} dispo` : 'Rupture'}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{equipment.name}</CardTitle>
                    <p className="mt-2 text-sm text-gray-500">{equipment.brand} · {equipment.model}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-700">{equipment.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Etat</p>
                      <p className="font-medium text-gray-900">{equipment.etat}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Serie</p>
                      <p className="font-medium text-gray-900">{equipment.serialNumber}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`${isAdmin ? '/admin' : '/dashboard'}/inventory/${equipment.id}`} className="w-full">
                    <Button className="w-full">
                      {isAdmin ? 'Voir la fiche admin' : 'Voir le detail'}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <div className="rounded-3xl bg-slate-950 p-6 text-white">
        <div className="flex items-center gap-3">
          <PackageSearch size={22} />
          <p className="font-semibold">
            {isAdmin
              ? 'Les actions de gestion lourdes doivent rester dans l espace admin.'
              : 'La demande se fait depuis la fiche detail d un equipement.'}
          </p>
        </div>
      </div>
    </div>
  );
}
