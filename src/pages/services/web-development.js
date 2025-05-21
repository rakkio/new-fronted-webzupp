import React from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { FaCode, FaMobile, FaServer, FaDatabase, FaShieldAlt, FaRocket } from 'react-icons/fa'

export default function WebDevelopment() {
  const features = [
    {
      icon: <FaCode className="w-8 h-8 text-indigo-600" />,
      title: 'Sviluppo Frontend',
      description: 'Creiamo interfacce moderne e reattive utilizzando le tecnologie più avanzate.',
      items: [
        'React, Next.js, Vue.js',
        'Design responsive',
        'Animazioni fluide',
        'Ottimizzazione performance'
      ]
    },
    {
      icon: <FaServer className="w-8 h-8 text-indigo-600" />,
      title: 'Sviluppo Backend',
      description: 'Architetture robuste e scalabili per gestire la logica di business.',
      items: [
        'Node.js, Python, PHP',
        'API RESTful',
        'Microservizi',
        'Autenticazione sicura'
      ]
    },
    {
      icon: <FaDatabase className="w-8 h-8 text-indigo-600" />,
      title: 'Database & Storage',
      description: 'Soluzioni di archiviazione dati ottimizzate per ogni esigenza.',
      items: [
        'SQL e NoSQL',
        'Caching avanzato',
        'Backup automatici',
        'Ottimizzazione query'
      ]
    },
    {
      icon: <FaMobile className="w-8 h-8 text-indigo-600" />,
      title: 'Mobile First',
      description: 'Sviluppo con focus sulla compatibilità mobile e PWA.',
      items: [
        'Design responsive',
        'PWA support',
        'Offline capabilities',
        'Push notifications'
      ]
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-indigo-600" />,
      title: 'Sicurezza',
      description: 'Implementazione delle migliori pratiche di sicurezza.',
      items: [
        'HTTPS/SSL',
        'Protezione DDoS',
        'Validazione input',
        'Audit di sicurezza'
      ]
    },
    {
      icon: <FaRocket className="w-8 h-8 text-indigo-600" />,
      title: 'Performance',
      description: 'Ottimizzazione per massime prestazioni e velocità.',
      items: [
        'Lazy loading',
        'Code splitting',
        'CDN integration',
        'Caching avanzato'
      ]
    }
  ]

  const process = [
    {
      title: 'Analisi',
      description: 'Studio approfondito delle tue esigenze e obiettivi.'
    },
    {
      title: 'Progettazione',
      description: 'Creazione di wireframe e prototipi per visualizzare la soluzione.'
    },
    {
      title: 'Sviluppo',
      description: 'Implementazione del codice con le migliori pratiche di programmazione.'
    },
    {
      title: 'Testing',
      description: 'Test approfonditi per garantire qualità e funzionalità.'
    },
    {
      title: 'Deployment',
      description: 'Pubblicazione e configurazione dell\'applicazione.'
    },
    {
      title: 'Manutenzione',
      description: 'Supporto continuo e aggiornamenti regolari.'
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sviluppo Web
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Creiamo applicazioni web moderne, performanti e scalabili utilizzando le tecnologie più avanzate.
              Dal concept alla pubblicazione, ti accompagniamo in ogni fase del progetto.
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
              Un approccio strutturato per garantire il successo del tuo progetto
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
                  Pronto a Iniziare?
                </h2>
                <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Contattaci per una consulenza gratuita e scopri come possiamo aiutarti a realizzare il tuo progetto web.
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