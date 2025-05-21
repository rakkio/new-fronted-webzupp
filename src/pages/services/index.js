import React from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { FaCode, FaShoppingCart, FaNewspaper, FaMobile, FaChartLine, FaShieldAlt } from 'react-icons/fa'

export default function Services() {
  const services = [
    {
      icon: <FaCode className="w-12 h-12 text-indigo-600" />,
      title: 'Sviluppo Web',
      description: 'Creiamo applicazioni web moderne e performanti utilizzando le tecnologie più avanzate.',
      href: '/services/web-development',
      features: [
        'Applicazioni Web Progressive',
        'Single Page Applications',
        'API RESTful',
        'Integrazione con servizi terzi'
      ]
    },
    {
      icon: <FaShoppingCart className="w-12 h-12 text-indigo-600" />,
      title: 'E-commerce',
      description: 'Soluzioni complete per il tuo negozio online, dalla piattaforma alla gestione degli ordini.',
      href: '/services/ecommerce',
      features: [
        'Negozi online personalizzati',
        'Integrazione con sistemi di pagamento',
        'Gestione inventario',
        'Analisi delle vendite'
      ]
    },
    {
      icon: <FaNewspaper className="w-12 h-12 text-indigo-600" />,
      title: 'CMS & Blog',
      description: 'Sistemi di gestione dei contenuti personalizzati per il tuo blog o sito aziendale.',
      href: '/services/cms',
      features: [
        'WordPress personalizzato',
        'CMS headless',
        'Editor visuale',
        'Gestione multi-lingua'
      ]
    },
    {
      icon: <FaMobile className="w-12 h-12 text-indigo-600" />,
      title: 'App Mobile',
      description: 'Sviluppiamo applicazioni mobile native e ibride per iOS e Android.',
      href: '/services/mobile-apps',
      features: [
        'App native iOS e Android',
        'App ibride con React Native',
        'PWA',
        'Integrazione con API'
      ]
    },
    {
      icon: <FaChartLine className="w-12 h-12 text-indigo-600" />,
      title: 'SEO & Marketing',
      description: 'Ottimizzazione per i motori di ricerca e strategie di marketing digitale.',
      href: '/services/seo-marketing',
      features: [
        'Ottimizzazione SEO',
        'Analisi delle performance',
        'Content Marketing',
        'Social Media Marketing'
      ]
    },
    {
      icon: <FaShieldAlt className="w-12 h-12 text-indigo-600" />,
      title: 'Sicurezza & Manutenzione',
      description: 'Protezione dei dati e manutenzione continua delle tue applicazioni.',
      href: '/services/maintenance',
      features: [
        'Sicurezza avanzata',
        'Backup automatici',
        'Monitoraggio 24/7',
        'Supporto tecnico'
      ]
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              I Nostri Servizi
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Offriamo soluzioni digitali complete per aiutare la tua azienda a crescere nel mondo digitale.
              Scegli il servizio più adatto alle tue esigenze.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link 
                key={index}
                href={service.href}
                className="group"
              >
                <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 blur-card">
                  <div className="mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-2xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 lg:px-16">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Non trovi quello che cerchi?
                </h2>
                <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Contattaci per una consulenza gratuita. Analizzeremo le tue esigenze e ti proporremo la soluzione più adatta.
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