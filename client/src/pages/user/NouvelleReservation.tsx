import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Package } from 'lucide-react';
import { getEquipments, type Equipment } from '../../services/api';
import { useReservations } from '../../hooks/useReservations';

export default function NouvelleReservation() {
  const navigate = useNavigate();
  const { create, isLoading, error } = useReservations();

  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loadingEq, setLoadingEq] = useState(true);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    equipmentId: '',
    quantity: 1,
  });

  useEffect(() => {
    getEquipments()
      .then((data) => setEquipments(data.filter((e) => e.status === 'AVAILABLE' || !e.status)))
      .finally(() => setLoadingEq(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.equipmentId) return;
    await create({ equipmentId: Number(form.equipmentId), quantity: form.quantity });
    setSuccess(true);
    setTimeout(() => navigate('/espace/reservations'), 1800);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <Send size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Demande envoyée !</h2>
        <p className="text-gray-500 text-sm mt-2">Vous allez être redirigé vers vos réservations…</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouvelle réservation</h1>
          <p className="text-sm text-gray-500">Sélectionnez un équipement disponible.</p>
        </div>
      </div>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
      >
        {/* Équipement */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Équipement <span className="text-red-500">*</span>
          </label>
          {loadingEq ? (
            <div className="h-10 bg-gray-100 animate-pulse rounded-xl" />
          ) : (
            <div className="relative">
              <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                name="equipmentId"
                value={form.equipmentId}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-800 appearance-none"
              >
                <option value="">-- Choisir un équipement --</option>
                {equipments.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name} {eq.brand ? `· ${eq.brand}` : ''} {eq.model ? `${eq.model}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Quantité */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Quantité demandée <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min={1}
            max={20}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Erreur */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
            {error}
          </div>
        )}

        {/* Bouton */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {isLoading ? (
            <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={16} />
          )}
          Soumettre la demande
        </button>
      </form>
    </div>
  );
}
