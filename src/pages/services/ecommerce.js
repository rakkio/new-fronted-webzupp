import React from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { FaShoppingCart, FaCreditCard, FaBox, FaChartLine, FaUserShield, FaTruck } from 'react-icons/fa'

export default function Ecommerce() {
  const features = [
    {
      icon: <FaShoppingCart className="w-8 h-8 text-indigo-600" />,
      title: 'Piattaforma E-commerce',
      description: 'Soluzioni personalizzate per il tuo negozio online.',
      items: [
        'Shopify, WooCommerce, Magento',
        'Design responsive',
        'Catalogo prodotti',
        'Carrello e checkout'
      ]
    },
    {
      icon: <FaCreditCard className="w-8 h-8 text-indigo-600" />,
      title: 'Pagamenti Sicuri',
      description: 'Integrazione con i principali sistemi di pagamento.',
      items: [
        'PayPal, Stripe, Square',
        'Carte di credito',
        'Criptovalute',
        'Pagamenti in-store'
      ]
    },
    {
      icon: <FaBox className="w-8 h-8 text-indigo-600" />,
      title: 'Gestione Inventario',
      description: 'Sistema completo per la gestione del magazzino.',
      items: [
        'Controllo stock',
        'Ordini automatici',
        'Gestione fornitori',
        'Tracking prodotti'
      ]
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-indigo-600" />,
      title: 'Analisi e Report',
      description: 'Strumenti avanzati per monitorare le performance.',
      items: [
        'Analisi vendite',
        'Report personalizzati',
        'Metriche KPI',
        'Dashboard in tempo reale'
      ]
    },
    {
      icon: <FaUserShield className="w-8 h-8 text-indigo-600" />,
      title: 'Sicurezza',
      description: 'Protezione avanzata per il tuo e-commerce.',
      items: [
        'SSL/HTTPS',
        'Protezione dati',
        'Conformità GDPR',
        'Backup automatici'
      ]
    },
    {
      icon: <FaTruck className="w-8 h-8 text-indigo-600" />,
      title: 'Logistica',
      description: 'Integrazione con i principali servizi di spedizione.',
      items: [
        'Tracking spedizioni',
        'Calcolo costi',
        'Integrazione corrieri',
        'Gestione resi'
      ]
    }
  ]

  const process = [
    {
      title: 'Analisi',
      description: 'Studio del mercato e definizione degli obiettivi.'
    },
    {
      title: 'Progettazione',
      description: 'Creazione del layout e dell\'esperienza utente.'
    },
    {
      title: 'Sviluppo',
      description: 'Implementazione della piattaforma e-commerce.'
    },
    {
      title: 'Integrazione',
      description: 'Collegamento con sistemi di pagamento e logistica.'
    },
    {
      title: 'Testing',
      description: 'Verifica completa di tutte le funzionalità.'
    },
    {
      title: 'Lancio',
      description: 'Pubblicazione e monitoraggio iniziale.'
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              E-commerce
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trasforma la tua attività in un negozio online di successo. 
              Offriamo soluzioni complete per la vendita online, dalla piattaforma alla gestione degli ordini.
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
              Un approccio strutturato per il successo del tuo e-commerce
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
                  Pronto a Vendere Online?
                </h2>
                <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Contattaci per una consulenza gratuita e scopri come possiamo aiutarti a creare il tuo negozio online.
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