import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaSearch, FaFilter, FaUserShield } from 'react-icons/fa';
import { getBlogs, deleteBlog } from '@/pages/api/blog';
import { toast } from 'react-hot-toast';
import { useUser } from '../../../../context/UserContext';
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
    // Si no hay token en localStorage, mostrar mensaje específico
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      console.error('No se encontró token. Se requiere iniciar sesión como administrador.');
      toast.error('Se requiere iniciar sesión como administrador', {
        duration: 5000,
        id: 'auth-error'
      });
      
      // Esperar un momento y redirigir al login con URL de retorno
      setTimeout(() => {
        router.push(`/auth/login?redirect=${encodeURIComponent(router.asPath)}`);
      }, 2000);
      return;
    }
    
    // Solo verificar cuando el usuario se ha cargado (no durante la carga inicial)
    if (!loading && (!isAuthenticated || !isAdmin())) {
      console.error('Acceso denegado: Usuario no es administrador', { 
        isAuthenticated, 
        esAdmin: isAdmin()
      });
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
        console.error('Error en respuesta del servidor:', response);
        throw new Error(response.message || 'Error al cargar blogs');
      }
      
      setBlogs(response.data);
      setPagination(response.pagination || pagination);
      
    } catch (err) {
      console.error('Error al cargar blogs:', err);
      toast.error('Error al cargar blogs: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); // Resetear página al buscar
    fetchBlogs();
  };

  const handleDelete = async (id) => {
    try {
      // Confirmar la eliminación
      if (!window.confirm('¿Estás seguro de eliminar este blog? Esta acción no se puede deshacer.')) {
        return;
      }
      
      setDeleting(id);
      
      const response = await deleteBlog(id);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al eliminar blog');
      }
      
      toast.success('Blog eliminado correctamente');
      
      // Actualizar la lista
      setBlogs(blogs.filter(blog => blog._id !== id));
      
    } catch (err) {
      console.error('Error al eliminar blog:', err);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <FaUserShield className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso restringido</h1>
          <p className="text-gray-600 mb-6">Esta sección requiere permisos de administrador.</p>
          <button
            onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent(router.asPath)}`)}
            className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            Iniciar sesión como administrador
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <section className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-pink-600">Gestión de Blog</h1>
          <Link
            href="/admin/blog/crear"
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            <FaPlus /> Nuevo Post
          </Link>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por título o contenido..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="published">Publicados</option>
                <option value="draft">Borradores</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
            >
              <FaFilter className="inline mr-2" /> Filtrar
            </button>
          </form>
        </div>

        {/* Lista de blogs */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="w-8 h-8 text-pink-500 animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-xl text-gray-600">No se encontraron blogs</p>
            <p className="text-gray-500 mt-2">Crea un nuevo blog o ajusta los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {blog.featuredImage?.url && (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img
                              src={blog.featuredImage.url}
                              alt={blog.title}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                          <div className="text-sm text-gray-500">
                            {blog.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{blog.author?.name || 'Sin autor'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(blog.createdAt)}</div>
                      <div className="text-xs text-gray-500">
                        Actualizado: {formatDate(blog.updatedAt || blog.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/blog/edit/${blog._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FaEdit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          disabled={deleting === blog._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deleting === blog._id ? (
                            <FaSpinner className="w-5 h-5 animate-spin" />
                          ) : (
                            <FaTrash className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {blogs.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Mostrando {(pagination.page - 1) * pagination.limit + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} resultados
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </section>
    </AdminLayout>
  );
} 