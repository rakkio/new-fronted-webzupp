import React from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { FaShieldAlt, FaTools, FaServer, FaDatabase, FaChartLine, FaHeadset } from 'react-icons/fa'

export default function Maintenance() {
  const features = [
    {
      icon: <FaShieldAlt className="w-8 h-8 text-indigo-600" />,
      title: 'Sicurezza',
      description: 'Protezione avanzata per le tue applicazioni.',
      items: [
        'Firewall e antivirus',
        'SSL/HTTPS',
        'Backup automatici',
        'Monitoraggio 24/7'
      ]
    },
    {
      icon: <FaTools className="w-8 h-8 text-indigo-600" />,
      title: 'Manutenzione',
      description: 'Manutenzione regolare e aggiornamenti.',
      items: [
        'Aggiornamenti software',
        'Ottimizzazione performance',
        'Pulizia database',
        'Controllo errori'
      ]
    },
    {
      icon: <FaServer className="w-8 h-8 text-indigo-600" />,
      title: 'Hosting',
      description: 'Gestione dell\'infrastruttura server.',
      items: [
        'Server dedicati',
        'Cloud hosting',
        'Load balancing',
        'CDN integration'
      ]
    },
    {
      icon: <FaDatabase className="w-8 h-8 text-indigo-600" />,
      title: 'Database',
      description: 'Gestione e ottimizzazione dei database.',
      items: [
        'Backup automatici',
        'Ottimizzazione query',
        'Monitoraggio performance',
        'Recovery plan'
      ]
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-indigo-600" />,
      title: 'Monitoraggio',
      description: 'Monitoraggio continuo delle performance.',
      items: [
        'Uptime monitoring',
        'Performance tracking',
        'Alert system',
        'Report dettagliati'
      ]
    },
    {
      icon: <FaHeadset className="w-8 h-8 text-indigo-600" />,
      title: 'Supporto',
      description: 'Supporto tecnico dedicato.',
      items: [
        'Supporto 24/7',
        'Ticket system',
        'Remote assistance',
        'Training team'
      ]
    }
  ]

  const process = [
    {
      title: 'Analisi',
      description: 'Valutazione dello stato attuale del sistema.'
    },
    {
      title: 'Pianificazione',
      description: 'Definizione del piano di manutenzione.'
    },
    {
      title: 'Implementazione',
      description: 'Esecuzione delle attività di manutenzione.'
    },
    {
      title: 'Monitoraggio',
      description: 'Controllo continuo delle performance.'
    },
    {
      title: 'Report',
      description: 'Report dettagliati delle attività.'
    },
    {
      title: 'Ottimizzazione',
      description: 'Miglioramento continuo del sistema.'
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sicurezza & Manutenzione
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proteggi e mantieni le tue applicazioni al massimo delle performance.
              Offriamo soluzioni complete per la sicurezza e la manutenzione dei tuoi sistemi.
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
              Un approccio strutturato per la manutenzione
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
                  Pronto a Proteggere i Tuoi Sistemi?
                </h2>
                <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Contattaci per una consulenza gratuita e scopri come possiamo aiutarti a proteggere e mantenere i tuoi sistemi.
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