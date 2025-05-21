import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { unsubscribeFromNewsletter } from '@/pages/api/newsletter';

export default function UnsubscribeNewsletter() {
  const router = useRouter();
  const { email, token } = router.query;
  
  const [unsubscribing, setUnsubscribing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [emailInput, setEmailInput] = useState('');
  
  useEffect(() => {
    if (email) {
      setEmailInput(email);
    }
    
    // Si hay un token o email en la URL, intentar cancelar la suscripción automáticamente
    if (token || email) {
      handleUnsubscribe();
    }
  }, [token, email]);
  
  const handleUnsubscribe = async (e) => {
    if (e) e.preventDefault();
    
    if (!token && !email && !emailInput) {
      setMessage('Per favore inserisci un indirizzo email');
      return;
    }
    
    try {
      setUnsubscribing(true);
      const result = await unsubscribeFromNewsletter(token ? null : (email || emailInput));
      
      if (result.success) {
        setSuccess(true);
        setMessage(result.message || 'Iscrizione annullata con successo!');
      } else {
        setSuccess(false);
        setMessage(result.message || 'Errore durante l\'annullamento dell\'iscrizione');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      setSuccess(false);
      setMessage('Errore di connessione al server');
    } finally {
      setUnsubscribing(false);
    }
  };
  
  return (
    <Layout>
      <div className="bg-gradient-to-b from-indigo-50 to-white min-h-[70vh] flex items-center justify-center py-20">
        <div className="max-w-lg w-full mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Annulla iscrizione Newsletter
                </h1>
                
                {unsubscribing ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-600">Elaborazione in corso...</p>
                  </div>
                ) : success ? (
                  <div className="py-6">
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      Iscrizione annullata
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {message}
                    </p>
                    <p className="text-gray-600">
                      Non riceverai più email dalla nostra newsletter. Puoi iscriverti nuovamente in qualsiasi momento.
                    </p>
                  </div>
                ) : (
                  <>
                    {message && (
                      <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                        {message}
                      </div>
                    )}
                    
                    <form onSubmit={handleUnsubscribe} className="max-w-sm mx-auto">
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                          La tua email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="nome@example.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={unsubscribing}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                      >
                        Annulla iscrizione
                      </button>
                      
                      <p className="mt-4 text-sm text-gray-600">
                        Ci dispiace vederti andare. Se hai feedback o suggerimenti, ti invitiamo a contattarci.
                      </p>
                    </form>
                  </>
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