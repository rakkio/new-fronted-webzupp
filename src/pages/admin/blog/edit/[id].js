import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaSpinner, FaImage, FaSave, FaTimes } from 'react-icons/fa';
import { getBlog, updateBlog, uploadBlogImage, deleteBlogImage } from '@/pages/api/blog';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

// Importar el editor de texto enriquecido de forma dinámica
const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function EditBlog() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      console.log('Obteniendo blog con ID:', id);
      const response = await getBlog(id);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al cargar el post');
      }
      
      const data = response.data;
      
      setPost({
        title: data.title || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        featuredImage: data.featuredImage || null,
        categories: data.categories?.join(', ') || '',
        tags: data.tags?.join(', ') || '',
        status: data.status || 'draft'
      });
    } catch (err) {
      console.error('Error al cargar el post:', err);
      toast.error('Error al cargar el post');
      router.push('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

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
      
      // Si hay una imagen anterior, eliminarla
      if (post.featuredImage?.publicId) {
        await deleteBlogImage(post.featuredImage.publicId).catch(err => {
          console.error('Error al eliminar imagen antigua:', err);
        });
      }

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
      
      const postData = {
        ...post,
        categories: post.categories.split(',').map(cat => cat.trim()),
        tags: post.tags.split(',').map(tag => tag.trim())
      };

      await updateBlog(id, postData);
      toast.success('Post actualizado correctamente');
      router.push('/admin/blog');
    } catch (err) {
      toast.error('Error al actualizar el post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <FaSpinner className="w-8 h-8 text-pink-500 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-pink-600">Editar Post</h1>
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
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </AdminLayout>
  );
} 