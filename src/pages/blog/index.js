import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { FaCalendarAlt, FaUser, FaTag, FaSearch, FaArrowRight } from 'react-icons/fa'
import { getBlogs } from '@/pages/api/blog'

export default function Blog({ initialPosts, initialPagination, initialError }) {
  const categories = [
    'Sviluppo Web',
    'E-commerce',
    'Mobile Apps',
    'SEO',
    'Design',
    'Marketing'
  ]

  const [posts, setPosts] = useState(initialPosts || []);
  const [loading, setLoading] = useState(!initialPosts);
  const [error, setError] = useState(initialError);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [totalPages, setTotalPages] = useState(initialPagination?.pages || 1);

  // Obtener posts cuando cambian los filtros o la página (si no hay datos iniciales o cambian los filtros)
  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Construimos los parámetros de consulta
      const params = {
        page: page,
        limit: 9,
        search: searchTerm
      };
      
      // Añadimos la categoría si está seleccionada
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      
      const response = await getBlogs(params);
      
      if (response.success) {
        // Corregimos la extracción de los datos según la estructura de la respuesta
        const blogData = response.data || [];
        setPosts(Array.isArray(blogData) ? blogData : blogData.blogs || []);
        
        // Obtener la información de paginación
        const pagination = response.pagination || response.data?.pagination || {};
        setTotalPages(pagination.pages || 1);
        
        setError(null);
      } else {
        setError(response.message || 'Errore nel caricamento degli articoli');
      }
    } catch (err) {
      setError('Errore nel caricamento degli articoli');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en la búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Manejar la selección de categoría
  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  useEffect(() => {
    fetchPosts();
  }, [page, searchTerm, selectedCategory]);

  // Preparar metadatos para SEO
  const seoMetadata = {
    title: selectedCategory 
      ? `${selectedCategory} - Blog | WebZupp` 
      : 'Blog | WebZupp',
    description: 'Articoli, guide e approfondimenti sul mondo del web development, design e marketing digitale.',
    keywords: 'blog, sviluppo web, design, marketing, seo, e-commerce',
    type: 'website',
    canonical: '/blog'
  };

  return (
    <Layout seo={seoMetadata}>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Articoli, guide e approfondimenti sul mondo del web development,
              design e marketing digitale.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Search Bar */}
            <div className="w-full md:w-96">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Cerca articoli..."
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedCategory === category 
                      ? 'bg-indigo-500 text-white border-indigo-500' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                  } transition-colors`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-gray-500 py-20">Caricamento articoli...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-20">{error}</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-500 py-20">No se encontraron artículos</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article 
                  key={post._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    <img
                      src={post.featuredImage?.url || '/images/blog/default.jpg'}
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                      </span>
                      <span className="flex items-center">
                        <FaUser className="mr-2" />
                        {post.author?.name || 'Admin'}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-600">
                        <FaTag className="mr-2" />
                        {post.categories?.[0] || 'Blog'}
                      </span>
                      <Link
                        href={`/blog/${post._id}`}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Leggi di più
                        <FaArrowRight className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          
          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                {page > 1 && (
                  <button 
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                )}
                {[...Array(totalPages).keys()].map(i => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 border rounded-md ${
                      page === i + 1
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                {page < totalPages && (
                  <button 
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Siguiente
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-2xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 lg:px-16">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Iscriviti alla Newsletter
                </h2>
                <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Ricevi gli ultimi articoli e aggiornamenti direttamente nella tua casella email.
                </p>
                <form className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      placeholder="La tua email"
                      className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                    >
                      Iscriviti
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

// Obtener datos del servidor para SEO
export async function getServerSideProps(context) {
  try {
    // Extraer parámetros de la URL si existen
    const { category, search, page } = context.query;
    
    // Parámetros para la API
    const params = {
      page: page || 1,
      limit: 9
    };
    
    if (category) params.category = category;
    if (search) params.search = search;
    
    // Obtener posts desde la API
    const response = await getBlogs(params);
    
    if (!response.success) {
      return {
        props: {
          initialPosts: [],
          initialPagination: { pages: 1 },
          initialError: response.message || 'Error al cargar los blogs'
        }
      };
    }
    
    // Extraer datos según la estructura de la respuesta
    const blogData = response.data || [];
    const posts = Array.isArray(blogData) ? blogData : (blogData.blogs || []);
    
    // Extraer información de paginación
    const pagination = response.pagination || response.data?.pagination || { pages: 1 };
    
    return {
      props: {
        initialPosts: posts,
        initialPagination: pagination,
        initialError: null
      }
    };
  } catch (error) {
    return {
      props: {
        initialPosts: [],
        initialPagination: { pages: 1 },
        initialError: 'Error al cargar los blogs'
      }
    };
  }
} 