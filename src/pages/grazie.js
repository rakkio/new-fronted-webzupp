import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaCheckCircle, FaArrowRight, FaHome } from 'react-icons/fa';

export default function Grazie() {
  return (
    <Layout>
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <FaCheckCircle className="text-green-500 text-4xl" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Grazie per la tua richiesta!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Abbiamo ricevuto il tuo preventivo e ti contatteremo al più presto.
            </p>
            
            <div className="border-t border-gray-200 pt-8 mt-8">
              <p className="text-gray-500 mb-6">
                Nel frattempo, puoi esplorare il nostro sito o contattarci direttamente se hai domande.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link href="/" className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <FaHome className="text-white" /> 
                  Torna alla Home
                </Link>
                
                <Link href="/contatti" className="flex items-center justify-center gap-2 px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                  Contattaci
                  <FaArrowRight className="text-indigo-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 