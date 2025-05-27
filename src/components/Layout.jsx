import React, { useEffect, useState } from 'react'
import Header from './header/Header'
import Footer from './footer/Footer'
import { useUser } from '../../context/UserContext'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Layout({ 
  children, 
  requireAuth = false, 
  seo = {
    title: 'WebZupp - Sviluppo Web & Digital Marketing',
    description: 'Servizi professionali di sviluppo web, e-commerce, SEO e marketing digitale per far crescere la tua attività online.',
    keywords: 'sviluppo web, e-commerce, seo, digital marketing, web design',
    canonical: '',
    image: '/images/og-image.jpg',
    type: 'website'
  }
}) {
  const { isAuthenticated, loading, user } = useUser()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isUserAuth, setIsUserAuth] = useState(false)
  
  // Para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Comprobar autenticación y actualizar estado local
  useEffect(() => {
    const checkAuth = () => {
      if (!loading) {
        setIsUserAuth(isAuthenticated);
      }
    };
    
    // Verificar auth después de un breve retraso para asegurar que toda la data se ha cargado
    const timeout = setTimeout(checkAuth, 300);
    
    return () => clearTimeout(timeout);
  }, [loading, isAuthenticated, user, router.pathname]);

  // Redirigir a login si se requiere autenticación
  useEffect(() => {
    if (requireAuth && !loading && !isUserAuth) {
      // Demorar un poco la redirección para dar tiempo a recuperar la sesión
      const redirectTimeout = setTimeout(() => {
        router.push('/auth/login');
      }, 500);
      
      return () => clearTimeout(redirectTimeout);
    }
  }, [requireAuth, isUserAuth, loading, router]);

  // Preparar URL completa para canónica y OpenGraph
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webzupp.com';
  const canonicalUrl = seo.canonical 
    ? `${baseUrl}${seo.canonical}` 
    : `${baseUrl}${router.asPath.split('?')[0]}`;
  
  const ogImageUrl = seo.image?.startsWith('http') 
    ? seo.image 
    : `${baseUrl}${seo.image || '/images/og-image.jpg'}`;

  if (!mounted) {
    return null
  }

  // No renderizar nada durante la carga si se requiere autenticación
  if (requireAuth && loading) {
    return <LoadingScreen />
  }

  return (
    <>
      <SpeedInsights />
      <Head>
        {/* Metadatos básicos */}
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={seo.type} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={ogImageUrl} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={ogImageUrl} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        <style jsx global>{`
          :root {
            --primary-color: #6366f1;
            --primary-dark: #4f46e5;
            --primary-light: #818cf8;
            --accent-color: #ec4899;
            --text-color: #1f2937;
            --background-color: #f9fafb;
            --card-color: rgba(255, 255, 255, 0.8);
          }
          
          body {
            background-image: 
              radial-gradient(at top left, rgba(99, 102, 241, 0.1), transparent),
              radial-gradient(at bottom right, rgba(236, 72, 153, 0.1), transparent);
            background-attachment: fixed;
          }
          
          .blur-card {
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            background-color: var(--card-color);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
          }
          
          .blur-card:hover {
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
          }
          
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </Head>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="flex-grow w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}

// Componente de pantalla de carga
function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 z-50">
      <div className="blur-card p-8 rounded-2xl flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-medium text-gray-700">Cargando...</h2>
      </div>
    </div>
  )
}
