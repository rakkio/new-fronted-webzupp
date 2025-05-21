import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { verifyNewsletterSubscription } from '@/pages/api/newsletter';

export default function VerifyNewsletter() {
  const router = useRouter();
  const { token } = router.query;
  
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    if (!token) return;
    
    async function verifySubscription() {
      try {
        setVerifying(true);
        const result = await verifyNewsletterSubscription(token);
        
        if (result.success) {
          setSuccess(true);
          setMessage(result.message || 'Iscrizione verificata con successo!');
        } else {
          setSuccess(false);
          setMessage(result.message || 'Errore durante la verifica dell\'iscrizione');
        }
      } catch (error) {
        console.error('Error verifying subscription:', error);
        setSuccess(false);
        setMessage('Errore di connessione al server');
      } finally {
        setVerifying(false);
      }
    }
    
    verifySubscription();
  }, [token]);
  
  return (
    <Layout>
      <div className="bg-gradient-to-b from-indigo-50 to-white min-h-[70vh] flex items-center justify-center py-20">
        <div className="max-w-lg w-full mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Verifica Newsletter
                </h1>
                
                {verifying ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-600">Verifica in corso...</p>
                  </div>
                ) : success ? (
                  <div className="py-6">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      Grazie per la conferma!
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {message}
                    </p>
                    <p className="text-gray-600">
                      Da adesso riceverai i nostri aggiornamenti direttamente nella tua casella email.
                    </p>
                  </div>
                ) : (
                  <div className="py-6">
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      Verifica fallita
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {message}
                    </p>
                    <p className="text-gray-600">
                      Il token potrebbe essere scaduto o non valido. Prova a iscriverti nuovamente.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <Link 
                  href="/"
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Torna alla home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 