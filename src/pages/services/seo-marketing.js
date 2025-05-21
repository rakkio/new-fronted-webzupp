import React from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { FaSearch, FaChartLine, FaBullhorn, FaUsers, FaHashtag, FaEnvelope } from 'react-icons/fa'

export default function SEOMarketing() {
  const features = [
    {
      icon: <FaSearch className="w-8 h-8 text-indigo-600" />,
      title: 'SEO',
      description: 'Ottimizzazione per i motori di ricerca.',
      items: [
        'Keyword research',
        'On-page SEO',
        'Off-page SEO',
        'Technical SEO'
      ]
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-indigo-600" />,
      title: 'Analisi',
      description: 'Monitoraggio e analisi delle performance.',
      items: [
        'Google Analytics',
        'Report personalizzati',
        'Analisi competitor',
        'Metriche KPI'
      ]
    },
    {
      icon: <FaBullhorn className="w-8 h-8 text-indigo-600" />,
      title: 'Content Marketing',
      description: 'Creazione di contenuti di qualità.',
      items: [
        'Blog e articoli',
        'Case study',
        'White paper',
        'Newsletter'
      ]
    },
    {
      icon: <FaUsers className="w-8 h-8 text-indigo-600" />,
      title: 'Social Media',
      description: 'Gestione dei social media e community.',
      items: [
        'Strategia social',
        'Content calendar',
        'Community management',
        'Social advertising'
      ]
    },
    {
      icon: <FaHashtag className="w-8 h-8 text-indigo-600" />,
      title: 'Campagne PPC',
      description: 'Gestione di campagne pubblicitarie.',
      items: [
        'Google Ads',
        'Social ads',
        'Remarketing',
        'Analisi ROI'
      ]
    },
    {
      icon: <FaEnvelope className="w-8 h-8 text-indigo-600" />,
      title: 'Email Marketing',
      description: 'Strategie di email marketing.',
      items: [
        'Newsletter',
        'Automazione',
        'A/B testing',
        'Analisi performance'
      ]
    }
  ]

  const process = [
    {
      title: 'Analisi',
      description: 'Studio del mercato e degli obiettivi.'
    },
    {
      title: 'Strategia',
      description: 'Definizione della strategia di marketing.'
    },
    {
      title: 'Implementazione',
      description: 'Esecuzione delle attività pianificate.'
    },
    {
      title: 'Monitoraggio',
      description: 'Analisi continua dei risultati.'
    },
    {
      title: 'Ottimizzazione',
      description: 'Miglioramento basato sui dati.'
    },
    {
      title: 'Report',
      description: 'Report dettagliati delle performance.'
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              SEO & Marketing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Migliora la visibilità online della tua azienda con strategie SEO e marketing digitale efficaci.
              Aumenta il traffico e converti i visitatori in clienti.
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
              Un approccio strutturato per il tuo successo online
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
                  Pronto a Crescere Online?
                </h2>
                <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Contattaci per una consulenza gratuita e scopri come possiamo aiutarti a migliorare la tua presenza online.
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