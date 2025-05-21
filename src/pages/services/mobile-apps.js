import React from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { FaMobile, FaReact, FaApple, FaAndroid, FaCloud, FaBell } from 'react-icons/fa'

export default function MobileApps() {
  const features = [
    {
      icon: <FaMobile className="w-8 h-8 text-indigo-600" />,
      title: 'App Native',
      description: 'Sviluppo di applicazioni native per iOS e Android.',
      items: [
        'Swift per iOS',
        'Kotlin per Android',
        'UI/UX nativa',
        'Performance ottimale'
      ]
    },
    {
      icon: <FaReact className="w-8 h-8 text-indigo-600" />,
      title: 'App Ibride',
      description: 'Soluzioni cross-platform con React Native.',
      items: [
        'React Native',
        'Flutter',
        'Codice condiviso',
        'Tempo di sviluppo ridotto'
      ]
    },
    {
      icon: <FaApple className="w-8 h-8 text-indigo-600" />,
      title: 'iOS Development',
      description: 'Applicazioni native per iPhone e iPad.',
      items: [
        'Swift e SwiftUI',
        'App Store optimization',
        'Integrazione iOS',
        'Design Apple'
      ]
    },
    {
      icon: <FaAndroid className="w-8 h-8 text-indigo-600" />,
      title: 'Android Development',
      description: 'Applicazioni native per dispositivi Android.',
      items: [
        'Kotlin e Jetpack',
        'Play Store optimization',
        'Integrazione Android',
        'Material Design'
      ]
    },
    {
      icon: <FaCloud className="w-8 h-8 text-indigo-600" />,
      title: 'Backend & API',
      description: 'Infrastruttura cloud per le tue app.',
      items: [
        'API RESTful',
        'Firebase integration',
        'Cloud storage',
        'Serverless'
      ]
    },
    {
      icon: <FaBell className="w-8 h-8 text-indigo-600" />,
      title: 'Push Notifications',
      description: 'Sistema di notifiche push avanzato.',
      items: [
        'Notifiche in tempo reale',
        'Targeting utenti',
        'Analisi engagement',
        'A/B testing'
      ]
    }
  ]

  const process = [
    {
      title: 'Analisi',
      description: 'Studio delle esigenze e definizione degli obiettivi.'
    },
    {
      title: 'Design',
      description: 'Creazione dell\'interfaccia utente e dell\'esperienza.'
    },
    {
      title: 'Sviluppo',
      description: 'Implementazione dell\'applicazione e delle funzionalità.'
    },
    {
      title: 'Testing',
      description: 'Test approfonditi su vari dispositivi e versioni.'
    },
    {
      title: 'Pubblicazione',
      description: 'Pubblicazione sugli store e ottimizzazione.'
    },
    {
      title: 'Manutenzione',
      description: 'Supporto continuo e aggiornamenti.'
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              App Mobile
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sviluppiamo applicazioni mobile native e ibride per iOS e Android.
              Dalla progettazione alla pubblicazione, ti accompagniamo in ogni fase.
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
              Un approccio strutturato per il tuo progetto mobile
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
                  Pronto a Creare la Tua App?
                </h2>
                <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Contattaci per una consulenza gratuita e scopri come possiamo aiutarti a realizzare la tua app mobile.
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