import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaCalendarAlt, FaUser, FaTag, FaClock, FaShare, FaFacebook, FaTwitter, FaLinkedin, FaArrowLeft } from 'react-icons/fa'
import { getBlog, getBlogs } from '@/pages/api/blog'
import { motion } from 'framer-motion'
import { subscribeToNewsletter } from '@/pages/api/newsletter'

export default function BlogPost({ initialPost, initialRelatedPosts, error: serverError }) {
  const router = useRouter()
  const { id } = router.query

  const [post, setPost] = useState(initialPost)
  const [loading, setLoading] = useState(!initialPost)
  const [error, setError] = useState(serverError)
  const [relatedPosts, setRelatedPosts] = useState(initialRelatedPosts || [])
  const [loadingRelated, setLoadingRelated] = useState(!initialRelatedPosts)
  
  // Estado para la suscripción a newsletter
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const [subscribeSuccess, setSubscribeSuccess] = useState(false)
  const [subscribeMessage, setSubscribeMessage] = useState('')

  // Si no tenemos post inicial, lo cargamos del cliente
  useEffect(() => {
    if (initialPost || !id) return;
    
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await getBlog(id);
        setPost(response.data);
        setError(null);
      } catch (err) {
        setError('Articolo non trovato');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id, initialPost]);

  // Si no tenemos posts relacionados iniciales, los cargamos del cliente
  useEffect(() => {
    if (initialRelatedPosts || !post) return;

    const fetchRelatedPosts = async () => {
      setLoadingRelated(true);
      try {
        // Si el post tiene categorías, buscamos por la primera categoría
        const params = {
          limit: 3,
          page: 1
        };
        
        if (post.categories && post.categories.length > 0) {
          params.category = post.categories[0];
        }
        
        const response = await getBlogs(params);
        
        if (response.success) {
          // Filtrar posts para excluir el post actual y asegurar que tenemos máximo 3
          let relatedData = Array.isArray(response.data) 
            ? response.data 
            : (response.data.blogs || []);
            
          relatedData = relatedData
            .filter(relatedPost => relatedPost._id !== id)
            .slice(0, 3);
            
          setRelatedPosts(relatedData);
        }
      } catch (error) {
        // En caso de error, simplemente no mostramos posts relacionados
      } finally {
        setLoadingRelated(false);
      }
    };
    
    fetchRelatedPosts();
  }, [post, id, initialRelatedPosts]);

  // Manejar la suscripción a la newsletter
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!email || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      setEmailError('Per favore inserisci un indirizzo email valido');
      return;
    }
    
    setEmailError('');
    setSubscribing(true);
    setSubscribeSuccess(false);
    setSubscribeMessage('');
    
    try {
      const result = await subscribeToNewsletter({ 
        email,
        source: 'blog',
        topics: ['blog']
      });
      
      if (result.success) {
        setSubscribeSuccess(true);
        setSubscribeMessage(result.message || 'Iscrizione effettuata con successo!');
        setEmail('');
      } else {
        setSubscribeSuccess(false);
        setSubscribeMessage(result.message || 'Errore durante l\'iscrizione');
      }
    } catch (error) {
      setSubscribeSuccess(false);
      setSubscribeMessage('Errore di connessione al server');
    } finally {
      setSubscribing(false);
    }
  };

  // Preparar metadatos para SEO
  const seoMetadata = post ? {
    title: `${post.title} | WebZupp Blog`,
    description: post.excerpt || `Leggi il nostro articolo su ${post.title}`,
    keywords: post.tags?.join(', ') || 'blog, articoli, sviluppo web',
    image: post.featuredImage?.url || '',
    type: 'article',
    canonical: `/blog/${post._id}`
  } : {
    title: 'Blog | WebZupp',
    description: 'Articoli e guide sul mondo del web development, design e marketing digitale.',
    type: 'website'
  };

  if (loading) {
    return (
      <Layout seo={seoMetadata}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-64 bg-indigo-100 rounded-full mb-6"></div>
            <div className="h-6 w-40 bg-indigo-50 rounded-full"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !post) {
    return (
      <Layout 
        seo={{
          title: 'Articolo non trovato | WebZupp Blog',
          description: 'Il contenuto che stai cercando non è disponibile o è stato rimosso.',
          type: 'website'
        }}
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="text-red-500 text-xl mb-4">{error || 'Articolo non trovato'}</div>
          <button 
            onClick={() => router.push('/blog')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Torna al blog
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout seo={seoMetadata}>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-100 to-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 mb-6 shadow-sm"
            >
              <FaTag className="mr-2 text-indigo-500" />
              {post.categories?.[0] || 'Blog'}
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold text-black mb-6 leading-tight"
            >
              {post.title}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6 text-gray-800"
            >
              <span className="flex items-center">
                <FaUser className="mr-2 text-indigo-400" />
                {post.author?.name || 'Admin'}
              </span>
              <span className="flex items-center">
                <FaCalendarAlt className="mr-2 text-indigo-400" />
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Featured Image */}
      {post.featuredImage?.url && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src={post.featuredImage.url}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-black">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-gray-900 prose-strong:font-bold prose-strong:text-black prose-a:text-indigo-700 prose-a:font-semibold prose-a:decoration-indigo-400 prose-a:decoration-2 hover:prose-a:text-indigo-800 prose-li:text-black prose-ol:text-black prose-ul:text-black prose-blockquote:text-black" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    key={index}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Share */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex items-center gap-4"
          >
            <span className="text-gray-800 font-medium">Condividi:</span>
            <div className="flex gap-4">
              <button className="text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-50">
                <FaFacebook size={20} />
              </button>
              <button className="text-sky-500 hover:text-sky-600 transition-colors p-2 rounded-full hover:bg-sky-50">
                <FaTwitter size={20} />
              </button>
              <button className="text-blue-700 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-50">
                <FaLinkedin size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Articoli Correlati
          </h2>
          {loadingRelated ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md p-4">
                  <div className="animate-pulse">
                    <div className="rounded-lg bg-gray-200 h-48 w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : relatedPosts.length === 0 ? (
            <p className="text-center text-gray-600">No hay artículos relacionados disponibles</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.article 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                  key={relatedPost._id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    <img
                      src={relatedPost.featuredImage?.url || '/images/blog/default.jpg'}
                      alt={relatedPost.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-4">
                      <FaTag className="mr-2 text-indigo-500" />
                      {relatedPost.categories?.[0] || 'Blog'}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-indigo-600 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-700">
                      <FaCalendarAlt className="mr-2 text-indigo-400" />
                      {relatedPost.createdAt ? new Date(relatedPost.createdAt).toLocaleDateString() : ''}
                    </div>
                    <Link
                      href={`/blog/${relatedPost._id}`}
                      className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Leggi di più <FaArrowLeft className="ml-2 rotate-180" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="px-6 py-12 sm:px-12 lg:px-16">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Iscriviti alla Newsletter
                </h2>
                <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Ricevi gli ultimi articoli e aggiornamenti direttamente nella tua casella email.
                </p>
                
                {subscribeSuccess ? (
                  <div className="bg-green-500/30 border border-green-500/50 text-white p-4 rounded-lg max-w-md mx-auto mb-8">
                    {subscribeMessage}
                  </div>
                ) : subscribeMessage ? (
                  <div className="bg-red-500/30 border border-red-500/50 text-white p-4 rounded-lg max-w-md mx-auto mb-8">
                    {subscribeMessage}
                  </div>
                ) : null}
                
                <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="email"
                        placeholder="La tua email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm border-0 ${
                          emailError ? 'ring-2 ring-red-500' : ''
                        }`}
                      />
                      {emailError && (
                        <p className="absolute -bottom-6 left-0 text-sm text-red-200">
                          {emailError}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={subscribing}
                      className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {subscribing ? 'Attendere...' : 'Iscriviti'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}

// Obtener datos del servidor para SEO
export async function getServerSideProps(context) {
  const { id } = context.params;
  
  try {
    // Obtener post principal
    const response = await getBlog(id);
    
    if (!response.success || !response.data) {
      return {
        props: {
          error: 'Articolo non trovato',
          initialPost: null,
          initialRelatedPosts: []
        }
      };
    }
    
    const post = response.data;
    
    // Obtener posts relacionados por categoría
    let relatedPosts = [];
    
    if (post.categories && post.categories.length > 0) {
      const params = {
        limit: 3,
        page: 1,
        category: post.categories[0]
      };
      
      const relatedResponse = await getBlogs(params);
      
      if (relatedResponse.success) {
        let relatedData = Array.isArray(relatedResponse.data)
          ? relatedResponse.data
          : (relatedResponse.data.blogs || []);
          
        relatedPosts = relatedData
          .filter(relatedPost => relatedPost._id !== id)
          .slice(0, 3);
      }
    }
    
    return {
      props: {
        initialPost: post,
        initialRelatedPosts: relatedPosts,
        error: null
      }
    };
  } catch (error) {
    return {
      props: {
        error: 'Error al cargar el artículo',
        initialPost: null,
        initialRelatedPosts: []
      }
    };
  }
} 