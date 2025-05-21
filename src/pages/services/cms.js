import React from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { FaNewspaper, FaEdit, FaGlobe, FaImage, FaChartBar, FaCog } from 'react-icons/fa'

export default function CMS() {
  const features = [
    {
      icon: <FaNewspaper className="w-8 h-8 text-indigo-600" />,
      title: 'CMS Personalizzato',
      description: 'Sistemi di gestione dei contenuti su misura per le tue esigenze.',
      items: [
        'WordPress personalizzato',
        'CMS headless',
        'Editor visuale',
        'Gestione contenuti'
      ]
    },
    {
      icon: <FaEdit className="w-8 h-8 text-indigo-600" />,
      title: 'Editor Avanzato',
      description: 'Interfaccia intuitiva per la creazione di contenuti.',
      items: [
        'Editor WYSIWYG',
        'Formattazione avanzata',
        'Template personalizzati',
        'Anteprima live'
      ]
    },
    {
      icon: <FaGlobe className="w-8 h-8 text-indigo-600" />,
      title: 'Multi-lingua',
      description: 'Supporto completo per contenuti in più lingue.',
      items: [
        'Traduzioni automatiche',
        'Gestione locale',
        'SEO multi-lingua',
        'Contenuti localizzati'
      ]
    },
    {
      icon: <FaImage className="w-8 h-8 text-indigo-600" />,
      title: 'Gestione Media',
      description: 'Sistema avanzato per la gestione di immagini e video.',
      items: [
        'Ottimizzazione immagini',
        'Gallerie dinamiche',
        'Streaming video',
        'CDN integration'
      ]
    },
    {
      icon: <FaChartBar className="w-8 h-8 text-indigo-600" />,
      title: 'Analisi e SEO',
      description: 'Strumenti per ottimizzare la visibilità dei tuoi contenuti.',
      items: [
        'Analisi traffico',
        'Ottimizzazione SEO',
        'Report performance',
        'Keyword tracking'
      ]
    },
    {
      icon: <FaCog className="w-8 h-8 text-indigo-600" />,
      title: 'Personalizzazione',
      description: 'Opzioni avanzate per personalizzare il tuo CMS.',
      items: [
        'Temi personalizzati',
        'Plugin dedicati',
        'API personalizzate',
        'Integrazioni'
      ]
    }
  ]

  const process = [
    {
      title: 'Analisi',
      description: 'Studio delle tue esigenze di contenuto e obiettivi.'
    },
    {
      title: 'Progettazione',
      description: 'Creazione dell\'architettura dei contenuti e del design.'
    },
    {
      title: 'Sviluppo',
      description: 'Implementazione del CMS e delle funzionalità.'
    },
    {
      title: 'Training',
      description: 'Formazione del team per la gestione dei contenuti.'
    },
    {
      title: 'Testing',
      description: 'Verifica di tutte le funzionalità e ottimizzazione.'
    },
    {
      title: 'Lancio',
      description: 'Pubblicazione e supporto continuo.'
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              CMS & Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Gestisci i tuoi contenuti in modo semplice ed efficace. 
              Offriamo soluzioni CMS personalizzate per blog, siti aziendali e portali di contenuti.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 blur-card"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Il Nostro Processo
            </h2>
            <p className="text-xl text-gray-600">
              Un approccio strutturato per il tuo CMS
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 blur-card"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
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
                  Pronto a Gestire i Tuoi Contenuti?
                </h2>
                <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Contattaci per una consulenza gratuita e scopri come possiamo aiutarti a gestire i tuoi contenuti in modo efficace.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/contact" 
                    className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Contattaci
                  </Link>
                  <Link 
                    href="/services" 
                    className="inline-block px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition-colors"
                  >
                    Altri Servizi
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
} 