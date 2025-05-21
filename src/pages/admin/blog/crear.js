import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaSpinner, FaImage, FaSave, FaTimes, FaUserShield } from 'react-icons/fa';
import { createBlog, uploadBlogImage } from '@/pages/api/blog';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { useUser } from '../../../../context/UserContext';

// Importar el editor de texto enriquecido de forma dinámica
const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function CrearBlog() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useUser();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: null,
    categories: '',
    tags: '',
    status: 'draft'
  });

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar que es una imagen válida
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecciona un archivo de imagen válido');
      return;
    }

    // Verificar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande (máximo 5MB)');
      return;
    }

    try {
      // Mostrar estado de carga
      toast.loading('Subiendo imagen...', { id: 'uploadImage' });
      
      const response = await uploadBlogImage(file);
      
      toast.dismiss('uploadImage');

      setPost(prev => ({
        ...prev,
        featuredImage: {
          url: response.data.url,
          publicId: response.data.public_id,
          alt: post.title
        }
      }));

      toast.success('Imagen subida correctamente');
    } catch (err) {
      toast.dismiss('uploadImage');
      toast.error(err.message || 'Error al subir la imagen');
      console.error('Error detallado:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Verificar que el usuario sea administrador
      if (!isAdmin()) {
        toast.error('Solo los administradores pueden crear blogs');
        return;
      }
      
      // Verificar autenticación
      if (!localStorage.getItem('token')) {
        toast.error('Sesión expirada, por favor inicie sesión nuevamente');
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }
      
      // Validar campos requeridos
      if (!post.title.trim()) {
        toast.error('El título es obligatorio');
        return;
      }
      
      console.log('Preparando datos para crear blog:', post);
      
      const postData = {
        ...post,
        categories: post.categories.split(',').map(cat => cat.trim()).filter(Boolean),
        tags: post.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      console.log('Enviando creación al servidor...');
      const response = await createBlog(postData);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al crear el post');
      }
      
      console.log('Blog creado correctamente:', response.data);
      toast.success('Post creado correctamente');
      router.push('/admin/blog');
    } catch (err) {
      console.error('Error al crear el post:', err);
      toast.error('Error al crear el post: ' + (err.message || 'Error desconocido'));
    } finally {
      setSaving(false);
    }
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
      <section className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-pink-600">Crear Nuevo Post</h1>
          <button
            onClick={() => router.push('/admin/blog')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <FaTimes /> Cancelar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={post.title}
              onChange={e => setPost(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          {/* Extracto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extracto
            </label>
            <textarea
              value={post.excerpt}
              onChange={e => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
              rows="3"
            />
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido
            </label>
            <Editor
              value={post.content}
              onChange={content => setPost(prev => ({ ...prev, content }))}
            />
          </div>

          {/* Imagen destacada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen Destacada
            </label>
            <div className="flex items-center gap-4">
              {post.featuredImage?.url && (
                <div className="relative w-32 h-32">
                  <img
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setPost(prev => ({ ...prev, featuredImage: null }))}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-600 rounded-lg cursor-pointer hover:bg-pink-200">
                <FaImage />
                {post.featuredImage ? 'Cambiar imagen' : 'Subir imagen'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Categorías */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categorías (separadas por comas)
            </label>
            <input
              type="text"
              value={post.categories}
              onChange={e => setPost(prev => ({ ...prev, categories: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
              placeholder="ej: Tecnología, Desarrollo, Diseño"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (separados por comas)
            </label>
            <input
              type="text"
              value={post.tags}
              onChange={e => setPost(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
              placeholder="ej: react, nextjs, javascript"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={post.status}
              onChange={e => setPost(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/blog')}
              className="px-6 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave />
                  Crear Post
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </AdminLayout>
  );
} 