import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaUser, FaEnvelope, FaUserTag, FaCheckCircle, FaEdit, FaTrash, FaUserShield, FaSpinner, FaCrown, FaUsers } from 'react-icons/fa';
import { getUsers, deleteUser } from '@/pages/api/user';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data.users || response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los usuarios');
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      toast.success('Usuario eliminado correctamente');
      setConfirmDelete(null);
      fetchUsers();
    } catch (error) {
      toast.error('Error al eliminar el usuario');
    }
  };

  return (
    <AdminLayout title="Gestión de Usuarios">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaUsers className="w-5 h-5 text-white" />
              </div>
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600">Administra los usuarios del sistema</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-medium">{users.length} usuarios activos</span>
          </div>
        </motion.div>

        {/* Lista de usuarios */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 overflow-hidden"
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FaSpinner className="w-8 h-8 text-white animate-spin" />
                </div>
                <p className="text-gray-600 font-medium">Cargando usuarios...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserShield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar</h3>
              <p className="text-red-600">{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay usuarios disponibles</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  <AnimatePresence>
                    {users.map((user, index) => (
                      <motion.tr 
                        key={user._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-indigo-50/30 transition-all duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 mr-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-lg font-bold text-white overflow-hidden shadow-lg">
                                {user.avatar?.url ? (
                                  <img src={user.avatar.url} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                  user.name?.charAt(0) || '?'
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 mb-1">
                                {user.name} {user.lastname}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <FaUser className="w-3 h-3" />
                                @{user.username || 'sin-username'}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{user.email}</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' 
                              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border border-orange-200' 
                              : 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200'
                          }`}>
                            {user.role === 'admin' && <FaCrown className="w-3 h-3" />}
                            {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 
                            user.status === 'suspended' ? 'bg-red-100 text-red-700 border border-red-200' : 
                            'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                            {user.status === 'active' && <FaCheckCircle className="w-3 h-3" />} 
                            {user.status === 'active' ? 'Activo' : 
                             user.status === 'suspended' ? 'Suspendido' : 'Inactivo'}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Link href={`/admin/users/${user._id}`}>
                                <div className="p-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-600 transition-all duration-200 cursor-pointer" title="Editar">
                                  <FaEdit className="w-4 h-4" />
                                </div>
                              </Link>
                            </motion.div>
                            
                            {confirmDelete === user._id ? (
                              <div className="flex gap-1">
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDelete(user._id)} 
                                  className="p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-lg" 
                                  title="Confirmar"
                                >
                                  ✓
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setConfirmDelete(null)} 
                                  className="p-2 rounded-xl bg-gray-500 hover:bg-gray-600 text-white transition-all duration-200 shadow-lg" 
                                  title="Cancelar"
                                >
                                  ✗
                                </motion.button>
                              </div>
                            ) : (
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setConfirmDelete(user._id)} 
                                className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-200" 
                                title="Eliminar"
                              >
                                <FaTrash className="w-4 h-4" />
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
} 