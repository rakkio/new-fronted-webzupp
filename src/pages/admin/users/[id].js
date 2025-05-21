import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { getUser, updateUser, deleteUser } from '@/pages/api/user';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaIdCard, FaUserTag, FaCalendar, FaArrowLeft, FaSave, FaEdit, FaTrash, FaUserShield, FaToggleOn, FaCheck, FaTimes, FaUserCog } from 'react-icons/fa';
import Link from 'next/link';

export default function UserDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, [id]);

  const fetchUser = async (userId) => {
    try {
      setLoading(true);
      const response = await getUser(userId);
      setUser(response.data);
      setFormData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar el usuario:', err);
      setError('Error al cargar los detalles del usuario');
      toast.error('Error al cargar los detalles del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleNestedChange = (category, field, value) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category],
        [field]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(id, formData);
      toast.success('Usuario actualizado correctamente');
      setUser(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      toast.error('Error al actualizar el usuario');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(id);
      toast.success('Usuario eliminado correctamente');
      router.push('/admin/users');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      toast.error('Error al eliminar el usuario');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="text-center text-gray-500 py-20">Cargando detalles del usuario...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="text-center text-red-500 py-20">{error}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin/users" className="flex items-center text-indigo-600 hover:text-indigo-800 transition">
            <FaArrowLeft className="mr-2" /> Volver a la lista
          </Link>
          {!editMode ? (
            <div className="flex gap-2">
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <FaEdit /> Editar
              </button>
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                  <FaTrash /> Eliminar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                  >
                    <FaCheck /> Confirmar
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                  >
                    <FaTimes /> Cancelar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-indigo-100 p-6 flex items-start border-b border-indigo-200">
            <div className="flex-shrink-0 mr-4">
              <div className="w-24 h-24 rounded-full bg-indigo-200 flex items-center justify-center overflow-hidden">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-indigo-500">{user?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-indigo-800 mb-1 flex items-center gap-2">
                {user?.name} {user?.lastname} 
                {user?.role === 'admin' && (
                  <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded-full ml-2">Admin</span>
                )}
              </h1>
              <p className="text-indigo-600 flex items-center gap-1 mb-2">
                <FaUser className="text-indigo-400" /> @{user?.username}
              </p>
              <p className="text-indigo-600 flex items-center gap-1">
                <FaEnvelope className="text-indigo-400" /> {user?.email}
              </p>
            </div>
          </div>

          {editMode ? (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">Información personal</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                      <input
                        type="text"
                        name="lastname"
                        value={formData.lastname || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">Configuración de la cuenta</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                      <select
                        name="role"
                        value={formData.role || 'user'}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <select
                        name="status"
                        value={formData.status || 'active'}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                        <option value="suspended">Suspendido</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-4">Preferencias</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
                    <select
                      value={formData.preferences?.theme || 'light'}
                      onChange={(e) => handleNestedChange('preferences', 'theme', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Oscuro</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
                    <select
                      value={formData.preferences?.language || 'es'}
                      onChange={(e) => handleNestedChange('preferences', 'language', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="es">Español</option>
                      <option value="en">Inglés</option>
                      <option value="it">Italiano</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email-notifications"
                        checked={formData.preferences?.notifications?.email || false}
                        onChange={(e) => {
                          const currentNotifications = formData.preferences?.notifications || {};
                          handleNestedChange('preferences', 'notifications', {
                            ...currentNotifications,
                            email: e.target.checked
                          });
                        }}
                        className="h-4 w-4 text-indigo-600 rounded"
                      />
                      <label htmlFor="email-notifications" className="text-sm font-medium text-gray-700">
                        Notificaciones por email
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="push-notifications"
                        checked={formData.preferences?.notifications?.push || false}
                        onChange={(e) => {
                          const currentNotifications = formData.preferences?.notifications || {};
                          handleNestedChange('preferences', 'notifications', {
                            ...currentNotifications,
                            push: e.target.checked
                          });
                        }}
                        className="h-4 w-4 text-indigo-600 rounded"
                      />
                      <label htmlFor="push-notifications" className="text-sm font-medium text-gray-700">
                        Notificaciones push
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-right">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 ml-auto"
                >
                  <FaSave /> Guardar cambios
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Información personal</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaIdCard className="text-indigo-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Nombre completo</p>
                        <p className="font-medium">{user?.name} {user?.lastname}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaUser className="text-indigo-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Nombre de usuario</p>
                        <p className="font-medium">@{user?.username}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaEnvelope className="text-indigo-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>
                    
                    {user?.bio && (
                      <div className="flex items-start">
                        <FaUserTag className="text-indigo-500 mt-1 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Bio</p>
                          <p className="font-medium">{user.bio}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Detalles de la cuenta</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaUserShield className="text-indigo-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Rol</p>
                        <p className="font-medium">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            user?.role === 'admin' 
                              ? 'bg-yellow-400 text-white' 
                              : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaToggleOn className="text-indigo-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <p className="font-medium">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            user?.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : user?.status === 'suspended' 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user?.status === 'active' 
                              ? 'Activo' 
                              : user?.status === 'suspended' 
                                ? 'Suspendido' 
                                : 'Inactivo'}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCalendar className="text-indigo-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Fecha de registro</p>
                        <p className="font-medium">{formatDate(user?.createdAt)}</p>
                      </div>
                    </div>
                    
                    {user?.lastLogin && (
                      <div className="flex items-start">
                        <FaCalendar className="text-indigo-500 mt-1 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Último acceso</p>
                          <p className="font-medium">{formatDate(user.lastLogin)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUserCog className="text-indigo-500" /> Preferencias
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tema</p>
                    <p className="font-medium capitalize">{user?.preferences?.theme || 'Claro'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Idioma</p>
                    <p className="font-medium">
                      {user?.preferences?.language === 'es' ? 'Español' : 
                      user?.preferences?.language === 'en' ? 'Inglés' : 
                      user?.preferences?.language === 'it' ? 'Italiano' : 'Español'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Notificaciones</p>
                    <div className="flex flex-col mt-1">
                      <span className={`flex items-center ${user?.preferences?.notifications?.email ? 'text-indigo-600' : 'text-gray-400'}`}>
                        <FaCheck className={`mr-1 text-xs ${user?.preferences?.notifications?.email ? 'visible' : 'invisible'}`} /> 
                        Email
                      </span>
                      <span className={`flex items-center ${user?.preferences?.notifications?.push ? 'text-indigo-600' : 'text-gray-400'}`}>
                        <FaCheck className={`mr-1 text-xs ${user?.preferences?.notifications?.push ? 'visible' : 'invisible'}`} /> 
                        Push
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 