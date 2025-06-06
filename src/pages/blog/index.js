import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { FaCalendarAlt, FaUser, FaTag, FaSearch, FaArrowRight, FaEye } from 'react-icons/fa'
import { getBlogs } from '@/pages/api/blog'
import { motion } from 'framer-motion'

export default function BlogIndex({ initialBlogs, initialPagination, initialError }) {
  const [blogs, setBlogs] = useState(initialBlogs || [])
  const [loading, setLoading] = useState(!initialBlogs)
  const [error, setError] = useState(initialError)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(initialPagination?.pages || 1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Categorías disponibles
  const categories = [
    'Sviluppo Web',
    'JavaScript', 
    'React',
    'Next.js',
    'SEO',
    'Design',
    'Marketing',
    'E-commerce',
    'Mobile',
    'Tutorial'
  ]

  // Función para obtener imagen optimizada
  const getOptimizedImageUrl = (imageUrl, width = 600, height = 300) => {
    if (!imageUrl) {
      return getFallbackImageForCategory('', width, height)
    }

    // Si es una imagen de Cloudinary, intentar optimización pero preparar fallback
    if (imageUrl.includes('res.cloudinary.com')) {
      try {
        // Verificar que la URL tiene el formato correcto
        if (!imageUrl.includes('/upload/')) {
          console.warn('URL de Cloudinary mal formada:', imageUrl)
          return imageUrl
        }

        // Intentar aplicar transformaciones de Cloudinary para optimizar
        const baseUrl = imageUrl.split('/upload/')[0] + '/upload/'
        const imagePath = imageUrl.split('/upload/')[1]
        
        if (imagePath && imagePath.length > 0) {
          // Agregar transformaciones de Cloudinary para optimización
          const transformations = `w_${width},h_${height},c_fill,q_auto,f_auto`
          const optimizedUrl = `${baseUrl}${transformations}/${imagePath}`
          
          console.log('🔧 Imagen Cloudinary optimizada:', optimizedUrl)
          return optimizedUrl
        }
      } catch (error) {
        console.warn('Error optimizando imagen de Cloudinary:', error)
      }
      
      // Si hay problemas con la optimización, usar URL original
      return imageUrl
    }

    // Para otras imágenes, usar URL directa
    return imageUrl
  }

  // Función para obtener imagen fallback basada en categoría
  const getFallbackImageForCategory = (category, width = 400, height = 300) => {
    const categoryLower = (category || '').toLowerCase()
    
    if (categoryLower.includes('javascript') || categoryLower.includes('react') || categoryLower.includes('next')) {
      return `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=${width}&h=${height}&fit=crop&crop=entropy&auto=format&q=80`
    } else if (categoryLower.includes('seo') || categoryLower.includes('marketing')) {
      return `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=${width}&h=${height}&fit=crop&crop=entropy&auto=format&q=80`
    } else if (categoryLower.includes('design')) {
      return `https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=${width}&h=${height}&fit=crop&crop=entropy&auto=format&q=80`
    } else {
      return `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=${width}&h=${height}&fit=crop&crop=entropy&auto=format&q=80`
    }
  }

  // Función para cargar blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        page,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory })
      }

      const response = await getBlogs(params)

      if (response.success) {
        const blogsData = Array.isArray(response.data) ? response.data : response.data?.blogs || []
        setBlogs(blogsData)
        setTotalPages(response.pagination?.pages || 1)
      } else {
        setError(response.message || 'Errore nel caricamento dei blog')
        setBlogs([])
      }
    } catch (err) {
      setError('Errore di connessione')
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  // Efectos
  useEffect(() => {
    if (!initialBlogs) {
      fetchBlogs()
    }
  }, [])

  useEffect(() => {
    if (initialBlogs) return // Non ricaricare se abbiamo dati iniziali
    
    const timeoutId = setTimeout(() => {
      setPage(1) // Reset page when filters change
      fetchBlogs()
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedCategory])

  useEffect(() => {
    if (!initialBlogs && page > 1) {
      fetchBlogs()
    }
  }, [page])

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryFilter = (category) => {
    setSelectedCategory(selectedCategory === category ? '' : category)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // SEO metadata
  const seoMetadata = {
    title: selectedCategory 
      ? `${selectedCategory} - Blog | WebZupp` 
      : 'Blog | WebZupp - Guide e Tutorial su Sviluppo Web',
    description: 'Scopri guide, tutorial e articoli su sviluppo web, JavaScript, React, Next.js, SEO e molto altro. Resta aggiornato con le ultime tendenze del web development.',
    keywords: 'blog, sviluppo web, javascript, react, nextjs, seo, tutorial, guide, web development',
    type: 'website',
    canonical: '/blog'
  }

  return (
    <Layout seo={seoMetadata}>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Blog <span className="text-indigo-300">WebZupp</span>
            </h1>
            <p className="text-xl lg:text-2xl text-indigo-100 max-w-3xl mx-auto mb-8">
              Guide, tutorial e approfondimenti sul mondo del web development, 
              design e marketing digitale
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-indigo-200">
              <span className="flex items-center">
                <FaUser className="mr-2" />
                Articoli di esperti
              </span>
              <span className="flex items-center">
                <FaTag className="mr-2" />
                Contenuti aggiornati
              </span>
              <span className="flex items-center">
                <FaEye className="mr-2" />
                Guide pratiche
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="w-full lg:w-96">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca articoli..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 lg:gap-3">
              <button
                onClick={() => handleCategoryFilter('')}
                className={`px-4 py-2 rounded-full border transition-all duration-200 ${
                  !selectedCategory
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                Tutti
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full border transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 text-xl mb-4">{error}</div>
              <button 
                onClick={fetchBlogs}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Riprova
              </button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-500 text-xl mb-4">
                {searchTerm || selectedCategory 
                  ? 'Nessun articolo trovato con i filtri selezionati' 
                  : 'Nessun articolo disponibile'
                }
              </div>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('')
                  }}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Rimuovi filtri
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {blogs.map((blog, index) => (
                  <motion.article
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-2"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100">
                      <img
                         src={blog.featuredImage?.url ? getOptimizedImageUrl(blog.featuredImage.url, 400, 300) : getFallbackImageForCategory(blog.categories?.[0], 400, 300)}
                         alt={blog.featuredImage?.alt || blog.title}
                         className="w-full h-full object-cover transition-opacity duration-300"
                         onError={(e) => {
                           console.log('🔄 Fallback attivato per:', blog.title, 'URL originale:', e.target.src);
                           // Fallback immediato su errore
                           if (!e.target.dataset.fallback) {
                             e.target.dataset.fallback = '1'
                             const fallbackUrl = getFallbackImageForCategory(blog.categories?.[0], 400, 300)
                             e.target.src = fallbackUrl
                             console.log('✅ Fallback caricato:', fallbackUrl);
                           }
                         }}
                         onLoad={(e) => {
                           // Fade in l'immagine quando carica
                           e.target.style.opacity = '1'
                         }}
                         style={{ opacity: 0 }}
                       />
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-indigo-600 backdrop-blur-sm shadow-lg">
                          {blog.categories?.[0] || 'Blog'}
                        </span>
                      </div>
                      {/* Views Badge */}
                      {blog.views > 0 && (
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
                            <FaEye className="mr-1" />
                            {blog.views}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(blog.createdAt).toLocaleDateString('it-IT', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center">
                          <FaUser className="mr-1" />
                          {blog.author?.name || 'WebZupp'}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-indigo-600 transition-colors">
                        {blog.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {blog.excerpt || 'Leggi questo interessante articolo per scoprire di più...'}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex items-center">
                            <FaTag className="text-indigo-400 mr-1 text-xs" />
                            <span className="text-xs text-indigo-600 font-medium">
                              {blog.tags[0]}
                            </span>
                          </div>
                        )}

                        {/* Read More */}
                        <Link
                          href={`/blog/${blog.slug || blog._id}`}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium text-sm"
                        >
                          Leggi
                          <FaArrowRight className="ml-2 text-xs" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-16">
                  <div className="flex items-center gap-2">
                    {/* Previous */}
                    {page > 1 && (
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Precedente
                      </button>
                    )}

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1
                      const isActive = page === pageNum
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 border rounded-lg transition-colors ${
                            isActive
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    {/* Next */}
                    {page < totalPages && (
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Successivo
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Non perdere nessun aggiornamento
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Iscriviti alla nostra newsletter per ricevere i migliori articoli 
              direttamente nella tua casella email
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="La tua email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  Iscriviti
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}

// Server-side rendering per SEO
export async function getServerSideProps(context) {
  try {
    const { category, search, page } = context.query

    const params = {
      page: page || 1,
      limit: 12,
      ...(category && { category }),
      ...(search && { search })
    }

    const response = await getBlogs(params)

    if (response.success) {
      const blogsData = Array.isArray(response.data) ? response.data : response.data?.blogs || []
      const pagination = response.pagination || { pages: 1 }

      return {
        props: {
          initialBlogs: blogsData,
          initialPagination: pagination,
          initialError: null
        }
      }
    } else {
      return {
        props: {
          initialBlogs: [],
          initialPagination: { pages: 1 },
          initialError: response.message || 'Errore nel caricamento dei blog'
        }
      }
    }
  } catch (error) {
    return {
      props: {
        initialBlogs: [],
        initialPagination: { pages: 1 },
        initialError: 'Errore del server'
      }
    }
  }
} 