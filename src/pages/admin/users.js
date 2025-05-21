import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaUser, FaEnvelope, FaUserTag, FaCheckCircle, FaEdit, FaTrash, FaUserShield } from 'react-icons/fa';
import { getUsers, deleteUser } from '@/pages/api/user';
import { toast } from 'react-hot-toast';
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
      console.error('Error al cargar usuarios:', err);
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
      fetchUsers(); // Recargar lista
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      toast.error('Error al eliminar el usuario');
    }
  };

  return (
    <AdminLayout>
      <section className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8 flex items-center gap-2"><FaUserShield className="text-indigo-500" /> Gestione Utenti</h1>
        <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
          {loading ? (
            <div className="text-center text-gray-500 py-20">Cargando usuarios...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-20">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-500 py-20">No hay usuarios disponibles</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Avatar</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rol</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Estado</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-indigo-50 transition">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600 overflow-hidden">
                        {user.avatar?.url ? (
                          <img src={user.avatar.url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          user.name?.charAt(0) || '?'
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{user.name} {user.lastname}</td>
                    <td className="px-4 py-3 text-gray-700 flex items-center gap-2"><FaEnvelope className="text-indigo-400" /> {user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-yellow-400 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                        {user.role === 'admin' ? 'Admin' : 'Usuario'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 
                        user.status === 'suspended' ? 'bg-red-100 text-red-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.status === 'active' && <FaCheckCircle className="text-green-400" />} 
                        {user.status === 'active' ? 'Activo' : 
                         user.status === 'suspended' ? 'Suspendido' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3 justify-center">
                      <Link href={`/admin/users/${user._id}`}>
                        <button className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 transition" title="Editar">
                          <FaEdit />
                        </button>
                      </Link>
                      {confirmDelete === user._id ? (
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleDelete(user._id)} 
                            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition" 
                            title="Confirmar"
                          >
                            ✓
                          </button>
                          <button 
                            onClick={() => setConfirmDelete(null)} 
                            className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition" 
                            title="Cancelar"
                          >
                            ✗
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setConfirmDelete(user._id)} 
                          className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition" 
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </AdminLayout>
  );
} 