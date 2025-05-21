import React, { useState } from 'react';
import LayoutAuth from './components/LayoutAuth';
import Link from 'next/link';
import Head from 'next/head';
import { requestPasswordReset } from '@/pages/api/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!email) {
      setErrorMsg('Per favore inserisci la tua email');
      setLoading(false);
      return;
    }

    try {
      const result = await requestPasswordReset(email);
      
      if (result.success) {
        setSuccessMsg('Se la email è associata a un account, riceverai le istruzioni per reimpostare la password.');
        setEmail(''); // Limpiar el campo para evitar envíos múltiples
      } else {
        setErrorMsg(result.message || 'Errore durante la richiesta di reimpostazione della password');
      }
    } catch (error) {
      console.error('Error al solicitar restablecimiento:', error);
      setErrorMsg('Errore di connessione al server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAuth>
      <Head>
        <style jsx global>{`
          body { background: #f5f7fa; }
          .login-glass {
            background: rgba(255,255,255,0.15);
            box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 2rem;
            border: 1.5px solid rgba(255,255,255,0.18);
          }
          .gradient-title {
            background: linear-gradient(90deg, #6366f1 0%, #a21caf 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
          }
        `}</style>
      </Head>
      {/* Sfondo video o gradiente animato */}
      <div className="fixed inset-0 -z-10">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center" style={{filter:'brightness(0.7)'}}>
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/60 via-purple-700/40 to-pink-600/30"></div>
      </div>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md mx-auto login-glass p-8 md:p-10 relative">
          {/* Logo/avatar brand */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-lg">
              WZ
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4 gradient-title">Password dimenticata?</h1>
          <p className="text-center text-gray-200 mb-8">Inserisci la tua email e ti invieremo le istruzioni per reimpostarla.</p>
          
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-white text-center">
              {errorMsg}
            </div>
          )}
          
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-white text-center">
              {successMsg}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
                placeholder="tu@email.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:from-indigo-600 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              {loading ? 'Invio in corso...' : 'Reimposta password'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-indigo-200 hover:text-white text-sm font-medium transition">
              Torna al login
            </Link>
          </div>
        </div>
      </div>
    </LayoutAuth>
  );
} 