import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaSearch, FaFilter, FaUserShield, FaEye, FaClock, FaUser, FaTag } from 'react-icons/fa';
import { getBlogs, deleteBlog } from '@/pages/api/blog';
import { toast } from 'react-hot-toast';
import { useUser } from '../../../../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function BlogAdmin() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useUser();
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleting, setDeleting] = useState(null);

  // Verificar que el usuario sea administrador
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      toast.error('Se requiere iniciar sesión como administrador', {
        duration: 5000,
        id: 'auth-error'
      });
      
      setTimeout(() => {
        router.push(`/auth/login?redirect=${encodeURIComponent(router.asPath)}`);
      }, 2000);
      return;
    }
    
    if (!loading && (!isAuthenticated || !isAdmin())) {
      toast.error('Acceso denegado: Esta sección es solo para administradores');
      router.push('/auth/login');
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  // Cargar blogs
  useEffect(() => {
    fetchBlogs();
  }, [pagination.page, statusFilter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      
      const response = await getBlogs(pagination.page, pagination.limit, search, statusFilter);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al cargar blogs');
      }
      
      setBlogs(response.data);
      setPagination(response.pagination || pagination);
      
    } catch (err) {
      toast.error('Error al cargar blogs: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchBlogs();
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm('¿Estás seguro de eliminar este blog? Esta acción no se puede deshacer.')) {
        return;
      }
      
      setDeleting(id);
      
      const response = await deleteBlog(id);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al eliminar blog');
      }
      
      toast.success('Blog eliminado correctamente');
      setBlogs(blogs.filter(blog => blog._id !== id));
      
    } catch (err) {
      toast.error('Error al eliminar blog: ' + (err.message || 'Error desconocido'));
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-200/50"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaUserShield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Acceso restringido</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">Esta sección requiere permisos de administrador.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent(router.asPath)}`)}
            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
          >
            Iniciar sesión como administrador
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <AdminLayout title="Gestión de Blog">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Blog</h1>
            <p className="text-gray-600">Administra y organiza tu contenido</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/admin/blog/crear"
              className="mt-4 sm:mt-0 inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
            >
              <FaPlus className="w-4 h-4" /> Nuevo Post
            </Link>
          </motion.div>
        </motion.div>

        {/* Filtros y búsqueda */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-200/50 mb-8"
        >
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por título o contenido..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all duration-200 bg-gray-50/50"
                />
              </div>
            </div>
            
            <div className="w-full lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all duration-200 bg-gray-50/50"
              >
                <option value="">Todos los estados</option>
                <option value="published">Publicados</option>
                <option value="draft">Borradores</option>
              </select>
            </div>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 rounded-2xl hover:from-indigo-200 hover:to-purple-200 transition-all duration-200 font-medium flex items-center gap-2"
            >
              <FaFilter className="w-4 h-4" /> Filtrar
            </motion.button>
          </form>
        </motion.div>

        {/* Lista de blogs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 overflow-hidden"
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FaSpinner className="w-8 h-8 text-white animate-spin" />
                </div>
                <p className="text-gray-600 font-medium">Cargando blogs...</p>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron blogs</h3>
              <p className="text-gray-600 mb-6">Crea un nuevo blog o ajusta los filtros de búsqueda</p>
              <Link
                href="/admin/blog/crear"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                <FaPlus className="w-4 h-4" /> Crear primer post
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Post
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  <AnimatePresence>
                    {blogs.map((blog, index) => (
                      <motion.tr 
                        key={blog._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-indigo-50/30 transition-all duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {blog.featuredImage?.url && (
                              <div className="flex-shrink-0 h-12 w-12 mr-4">
                                <img
                                  src={blog.featuredImage.url}
                                  alt={blog.title}
                                  className="h-12 w-12 rounded-xl object-cover shadow-sm"
                                />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-gray-900 mb-1">{blog.title}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <FaTag className="w-3 h-3" />
                                {blog.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FaUser className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{blog.author?.name || 'Sin autor'}</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            blog.status === 'published' 
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          }`}>
                            {blog.status === 'published' ? 'Publicado' : 'Borrador'}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaClock className="w-4 h-4 text-gray-400" />
                            <div>
                              <div>{formatDate(blog.createdAt)}</div>
                              <div className="text-xs text-gray-500">
                                Actualizado: {formatDate(blog.updatedAt || blog.createdAt)}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Link
                                href={`/admin/blog/edit/${blog._id}`}
                                className="p-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-600 transition-all duration-200"
                                title="Editar"
                              >
                                <FaEdit className="w-4 h-4" />
                              </Link>
                            </motion.div>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(blog._id)}
                              disabled={deleting === blog._id}
                              className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-200 disabled:opacity-50"
                              title="Eliminar"
                            >
                              {deleting === blog._id ? (
                                <FaSpinner className="w-4 h-4 animate-spin" />
                              ) : (
                                <FaTrash className="w-4 h-4" />
                              )}
                            </motion.button>
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

        {/* Paginación */}
        {blogs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-200/50"
          >
            <div className="text-sm text-gray-600 mb-4 sm:mb-0">
              Mostrando <span className="font-semibold">{(pagination.page - 1) * pagination.limit + 1}</span> a{' '}
              <span className="font-semibold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> de{' '}
              <span className="font-semibold">{pagination.total}</span> resultados
            </div>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-200/50 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Anterior
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.pages}
                className="px-4 py-2 border border-gray-200/50 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Siguiente
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
} 