import React, { useEffect, useRef, useState } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import gsap from 'gsap'
import { useUser } from '@/../context/UserContext'
import { 
  FaRocket, FaCode, FaMobile, FaChartLine, FaShieldAlt, FaUsers,
  FaReact, FaNodeJs, FaPython, FaPhp, FaDatabase, FaAws,
  FaDocker, FaGitAlt, FaWordpress, FaShopify, FaLaravel,
  FaVuejs, FaAngular, FaSass, FaLess, FaBootstrap, FaLayerGroup
} from 'react-icons/fa'
import { 
  SiNextdotjs, SiTypescript, SiTailwindcss, SiMongodb, SiPostgresql, SiMysql,
  SiAstro, SiSvelte, SiNuxtdotjs, SiVuedotjs, SiAngular, SiExpress,
  SiDjango, SiFlask, SiFastapi, SiGraphql, SiPrisma, SiSupabase,
  SiFirebase, SiVercel, SiNetlify, SiWebpack, SiVite, SiJquery, 
  SiMaterialdesign, SiChakraui
} from 'react-icons/si'

// ScrollTrigger se importará dinámicamente en los useEffect

export default function Home() {
  const techRef = useRef(null)
  const techItemsRef = useRef([])
  const { user, isAuthenticated, loading } = useUser()
  const [authChecked, setAuthChecked] = useState(false)
  
  // Verificar estado de autenticación al cargar la página
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Esperar a que se complete la carga del estado de autenticación
        if (!loading) {
          setAuthChecked(true)
        }
      } catch (err) {
        console.error('Error verificando autenticación en Home:', err)
        setAuthChecked(true)
      }
    }
    
    checkAuthState()
  }, [isAuthenticated, user, loading])

  useEffect(() => {
    if (!techRef.current || typeof window === 'undefined') return

    const initAnimations = async () => {
      // Importar ScrollTrigger dinámicamente
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const techItems = techItemsRef.current

      // Animación para cada categoría
      techItems.forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            y: 100,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom-=100',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      // Animación para los iconos dentro de cada categoría
      const allIcons = techRef.current.querySelectorAll('.tech-icon')
      allIcons.forEach((icon, index) => {
        gsap.fromTo(
          icon,
          {
            scale: 0,
            rotation: -180,
          },
          {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            delay: index * 0.1,
            scrollTrigger: {
              trigger: icon,
              start: 'top bottom-=50',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
    }

    initAnimations()
  }, [authChecked])

  const features = [
    {
      icon: <FaRocket className="w-8 h-8 text-indigo-600" />,
      title: 'Soluzioni Veloci',
      description: 'Sviluppiamo applicazioni web performanti e ottimizzate per garantire la massima velocità.'
    },
    {
      icon: <FaCode className="w-8 h-8 text-indigo-600" />,
      title: 'Codice Pulito',
      description: 'Utilizziamo le migliori pratiche di programmazione per un codice mantenibile e scalabile.'
    },
    {
      icon: <FaMobile className="w-8 h-8 text-indigo-600" />,
      title: 'Design Responsive',
      description: 'I nostri siti si adattano perfettamente a qualsiasi dispositivo, dal desktop al mobile.'
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-indigo-600" />,
      title: 'SEO Ottimizzato',
      description: 'Implementiamo le migliori strategie SEO per aumentare la visibilità del tuo sito.'
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-indigo-600" />,
      title: 'Sicurezza Avanzata',
      description: 'Proteggiamo i tuoi dati con le più moderne tecnologie di sicurezza.'
    },
    {
      icon: <FaUsers className="w-8 h-8 text-indigo-600" />,
      title: 'Supporto Dedicato',
      description: 'Il nostro team è sempre disponibile per aiutarti e risolvere qualsiasi problema.'
    }
  ]

  const technologies = [
    {
      category: 'Frontend',
      items: [
        { icon: <FaReact className="w-8 h-8" />, name: 'React' },
        { icon: <SiNextdotjs className="w-8 h-8" />, name: 'Next.js' },
        { icon: <SiSvelte className="w-8 h-8" />, name: 'Svelte' },
        { icon: <SiAstro className="w-8 h-8" />, name: 'Astro' },
        { icon: <FaVuejs className="w-8 h-8" />, name: 'Vue.js' },
        { icon: <SiNuxtdotjs className="w-8 h-8" />, name: 'Nuxt.js' },
        { icon: <FaAngular className="w-8 h-8" />, name: 'Angular' },
        { icon: <SiTypescript className="w-8 h-8" />, name: 'TypeScript' }
      ]
    },
    {
      category: 'UI & Styling',
      items: [
        { icon: <SiTailwindcss className="w-8 h-8" />, name: 'Tailwind CSS' },
        { icon: <FaBootstrap className="w-8 h-8" />, name: 'Bootstrap' },
        { icon: <SiMaterialdesign className="w-8 h-8" />, name: 'Material UI' },
        { icon: <SiChakraui className="w-8 h-8" />, name: 'Chakra UI' },
        { icon: <FaSass className="w-8 h-8" />, name: 'Sass' },
        { icon: <FaLess className="w-8 h-8" />, name: 'Less' },
        { icon: <SiJquery className="w-8 h-8" />, name: 'jQuery' },
        { icon: <FaLayerGroup className="w-8 h-8" />, name: 'Redux' }
      ]
    },
    {
      category: 'Backend',
      items: [
        { icon: <FaNodeJs className="w-8 h-8" />, name: 'Node.js' },
        { icon: <SiExpress className="w-8 h-8" />, name: 'Express' },
        { icon: <FaPython className="w-8 h-8" />, name: 'Python' },
        { icon: <SiDjango className="w-8 h-8" />, name: 'Django' },
        { icon: <SiFlask className="w-8 h-8" />, name: 'Flask' },
        { icon: <SiFastapi className="w-8 h-8" />, name: 'FastAPI' },
        { icon: <FaPhp className="w-8 h-8" />, name: 'PHP' },
        { icon: <FaLaravel className="w-8 h-8" />, name: 'Laravel' }
      ]
    },
    {
      category: 'Database & API',
      items: [
        { icon: <SiMongodb className="w-8 h-8" />, name: 'MongoDB' },
        { icon: <SiPostgresql className="w-8 h-8" />, name: 'PostgreSQL' },
        { icon: <SiMysql className="w-8 h-8" />, name: 'MySQL' },
        { icon: <SiPrisma className="w-8 h-8" />, name: 'Prisma' },
        { icon: <SiGraphql className="w-8 h-8" />, name: 'GraphQL' },
        { icon: <SiSupabase className="w-8 h-8" />, name: 'Supabase' },
        { icon: <SiFirebase className="w-8 h-8" />, name: 'Firebase' },
        { icon: <FaDatabase className="w-8 h-8" />, name: 'Redis' }
      ]
    },
    {
      category: 'DevOps & Cloud',
      items: [
        { icon: <FaDocker className="w-8 h-8" />, name: 'Docker' },
        { icon: <FaAws className="w-8 h-8" />, name: 'AWS' },
        { icon: <SiVercel className="w-8 h-8" />, name: 'Vercel' },
        { icon: <SiNetlify className="w-8 h-8" />, name: 'Netlify' },
        { icon: <FaGitAlt className="w-8 h-8" />, name: 'Git' },
        { icon: <SiWebpack className="w-8 h-8" />, name: 'Webpack' },
        { icon: <SiVite className="w-8 h-8" />, name: 'Vite' },
        { icon: <FaDatabase className="w-8 h-8" />, name: 'CI/CD' }
      ]
    }
  ]

  const services = [
    {
      title: 'Sviluppo Web Personalizzato',
      description: 'Creiamo applicazioni web su misura utilizzando le tecnologie più moderne e adatte alle tue esigenze.',
      features: [
        'Architettura scalabile',
        'API RESTful',
        'Autenticazione sicura',
        'Integrazione con servizi terzi'
      ]
    },
    {
      title: 'E-commerce Solutions',
      description: 'Soluzioni complete per il tuo negozio online, dalla piattaforma alla gestione degli ordini.',
      features: [
        'Integrazione con sistemi di pagamento',
        'Gestione inventario',
        'Analisi delle vendite',
        'Marketing automation'
      ]
    },
    {
      title: 'CMS & Blog',
      description: 'Sistemi di gestione dei contenuti personalizzati o basati su WordPress per il tuo blog o sito aziendale.',
      features: [
        'Editor visuale',
        'SEO ottimizzato',
        'Gestione media',
        'Multi-lingua'
      ]
    },
    {
      title: 'Vetrine Web',
      description: 'Pagine web semplici ed eleganti per presentare la tua attività e facilitare il contatto con i clienti.',
      features: [
        'Design moderno e accattivante',
        'Ottimizzazione per i motori di ricerca',
        'Moduli di contatto intuitivi',
        'Rapida realizzazione'
      ]
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative mt-12 min-h-[70vh] flex items-center justify-center py-12 md:py-20 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center absolute top-0 left-0"
            style={{ filter: 'brightness(0.7)' }}
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Trasforma la tua <span className="text-indigo-400">Presenza Digitale</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow">
            Creiamo soluzioni web innovative che aiutano la tua azienda a crescere nel mondo digitale.
            Utilizziamo le tecnologie più moderne per garantire performance, sicurezza e scalabilità.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/preventivo" 
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
            >
              Richiedi Preventivo
            </Link>
            <Link 
              href="/services" 
              className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors transform hover:scale-105 duration-300"
            >
              Scopri i Servizi
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tecnologie che Utilizziamo
            </h2>
            <p className="text-xl text-gray-600">
              Scegliamo le tecnologie più adatte per ogni progetto, dalla più semplice alla più complessa
            </p>
          </div>
          <div 
            ref={techRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {technologies.map((tech, index) => (
              <div 
                key={index}
                ref={el => techItemsRef.current[index] = el}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow blur-card transform hover:scale-105 duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{tech.category}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {tech.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex} 
                      className="flex flex-col items-center text-center tech-icon"
                    >
                      <div className="text-gray-600 mb-2 transform hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perché Scegliere Noi
            </h2>
            <p className="text-xl text-gray-600">
              Offriamo soluzioni complete per il tuo business digitale
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow blur-card"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              I Nostri Servizi
            </h2>
            <p className="text-xl text-gray-600">
              Soluzioni personalizzate per ogni esigenza
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow blur-card flex flex-col h-full"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-4">
                  <Link 
                    href={service.title === 'Vetrine Web' ? "/contact" : "/services"} 
                    className={`inline-block px-4 py-2 rounded-lg transition-colors ${
                      service.title === 'Vetrine Web' 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    {service.title === 'Vetrine Web' ? 'Contattaci Ora' : 'Scopri di più'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vetrine Web Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Vetrine Web <span className="text-indigo-600">Professionali</span>
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Hai bisogno di una presenza online semplice ma efficace? Le nostre Vetrine Web sono la soluzione ideale per piccole attività e professionisti.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <span className="font-medium text-gray-900">Realizzazione rapida</span> - Il tuo sito online in pochi giorni
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <span className="font-medium text-gray-900">Costi contenuti</span> - Soluzioni a partire da €500
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <span className="font-medium text-gray-900">Facile da gestire</span> - Nessuna competenza tecnica richiesta
                  </p>
                </li>
              </ul>
              <Link 
                href="/contact" 
                className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
              >
                Richiedi Informazioni
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="/vetrina.jpg" 
                  alt="Esempio Vetrina Web" 
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x400/indigo/white?text=Vetrine+Web";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-2xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 lg:px-16">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Pronto a Iniziare?
                </h2>
                <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Contattaci oggi stesso per una consulenza gratuita e scopri come possiamo aiutare il tuo business a crescere.
                  Analizzeremo le tue esigenze e ti proporremo la soluzione più adatta.
                </p>
                <Link 
                  href="/contact" 
                  className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl"
                >
                  Contattaci
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
