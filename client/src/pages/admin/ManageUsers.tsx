import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, MoreVertical, Shield, 
  ShieldCheck, Trash2, UserPlus, Mail, Fingerprint,
  Calendar
} from 'lucide-react';
import { 
  getUsers, updateUser, deleteUser, type User 
} from '../../services/api';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setMessage({ type: 'error', text: 'Impossible de charger les utilisateurs.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: number, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await updateUser(userId, { role: newRole } as any);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setMessage({ type: 'success', text: 'Rôle mis à jour avec succès.' });
    } catch (error) {
      console.error('Failed to update role:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du rôle.' });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setMessage({ type: 'success', text: 'Utilisateur supprimé.' });
    } catch (error) {
      console.error('Failed to delete user:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la suppression.' });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.universityId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-green-600" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez les comptes utilisateurs, leurs rôles et leurs accès.
          </p>
        </div>
        
        <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm">
          <UserPlus size={18} />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Alert Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "p-4 rounded-xl border flex items-center justify-between",
              message.type === 'success' ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800"
            )}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-current opacity-60 hover:opacity-100">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Filtrer par Student ID..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-gray-400" />
          <select
            className="bg-gray-50 border-none rounded-xl py-2 pl-3 pr-8 focus:ring-2 focus:ring-green-500 text-sm font-medium cursor-pointer"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">Tous les rôles</option>
            <option value="ADMIN">Administrateurs</option>
            <option value="USER">Étudiants</option>
          </select>
        </div>

        <div className="text-sm text-gray-400 font-medium px-2">
          {filteredUsers.length} utilisateur(s) trouvé(s)
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Identifiants</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 w-40 bg-gray-100 rounded-lg" /></td>
                    <td className="px-6 py-4"><div className="h-10 w-32 bg-gray-100 rounded-lg" /></td>
                    <td className="px-6 py-4"><div className="h-8 w-20 bg-gray-100 rounded-lg" /></td>
                    <td className="px-6 py-4"><div className="h-8 w-24 bg-gray-100 rounded-lg" /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <motion.tr 
                    layout
                    key={user.id} 
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                          {user.fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.fullName}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Mail size={12} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-600 flex items-center gap-1.5 font-medium">
                          <Fingerprint size={14} className="text-gray-400" />
                          {user.universityId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border shrink-0",
                        user.role === 'ADMIN' 
                          ? "bg-purple-50 text-purple-700 border-purple-100" 
                          : "bg-green-50 text-green-700 border-green-100"
                      )}>
                        {user.role === 'ADMIN' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                        {user.role === 'ADMIN' ? 'Administrateur' : 'Étudiant'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleUpdateRole(user.id, user.role)}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            user.role === 'ADMIN' 
                              ? "text-blue-600 hover:bg-blue-50" 
                              : "text-purple-600 hover:bg-purple-50"
                          )}
                          title={user.role === 'ADMIN' ? "Rétrograder en utilisateur" : "Promouvoir en administrateur"}
                        >
                          {user.role === 'ADMIN' ? <Shield size={18} /> : <ShieldCheck size={18} />}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Supprimer l'utilisateur"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
