import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Shield, 
  ShieldCheck, Trash2, UserPlus, Mail, Fingerprint,
  X, Lock, User as UserIcon
} from 'lucide-react';
import { 
  getUsers, updateUser, deleteUser, createUser, type User 
} from '../../services/api';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Create User Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    universityId: '',
    password: '',
    role: 'USER'
  });

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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      const newUser = await createUser(formData);
      setUsers([newUser, ...users]);
      setIsModalOpen(false);
      setFormData({
        fullName: '',
        email: '',
        universityId: '',
        password: '',
        role: 'USER'
      });
      setMessage({ type: 'success', text: 'Utilisateur créé avec succès !' });
    } catch (error: any) {
      console.error('Failed to create user:', error);
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la création.' });
    } finally {
      setIsCreating(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      user.universityId.toLowerCase().includes(term) ||
      user.fullName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term);
    
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
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm"
        >
          <UserPlus size={18} />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Alert Message */}
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "p-4 rounded-xl border flex items-center justify-between shadow-sm",
              message.type === 'success' ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800"
            )}
          >
            <div className="flex items-center gap-2 font-medium">
              {message.type === 'success' ? <ShieldCheck size={18} /> : <X size={18} />}
              {message.text}
            </div>
            <button onClick={() => setMessage(null)} className="text-current opacity-60 hover:opacity-100 p-1">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou ID..."
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

      {/* Create User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl p-8 z-[70] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-2xl text-green-600">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Nouvel Utilisateur</h2>
                    <p className="text-sm text-gray-500">Ajoutez manuellement un nouveau compte.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-5">
                <div className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Nom complet</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        required
                        type="text"
                        placeholder="Jean Dupont"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 font-medium"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        required
                        type="email"
                        placeholder="jean.dupont@univ.fr"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 font-medium"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Student ID (University ID)</label>
                    <div className="relative">
                      <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        required
                        type="text"
                        placeholder="2024-XJF-001"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 font-medium"
                        value={formData.universityId}
                        onChange={(e) => setFormData({...formData, universityId: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        required
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 font-medium"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Rôle initial</label>
                    <div className="flex gap-2">
                       <button
                         type="button"
                         onClick={() => setFormData({...formData, role: 'USER'})}
                         className={cn(
                           "flex-1 py-3 rounded-xl border-2 transition-all font-bold text-sm",
                           formData.role === 'USER' ? "border-green-500 bg-green-50 text-green-700" : "border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-100"
                         )}
                       >
                         Étudiant
                       </button>
                       <button
                         type="button"
                         onClick={() => setFormData({...formData, role: 'ADMIN'})}
                         className={cn(
                           "flex-1 py-3 rounded-xl border-2 transition-all font-bold text-sm",
                           formData.role === 'ADMIN' ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-100"
                         )}
                       >
                         Administrateur
                       </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={isCreating}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg shadow-green-100 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Créer l'utilisateur</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageUsers;
