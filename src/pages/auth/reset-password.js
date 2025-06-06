import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutAuth from './components/LayoutAuth';
import Link from 'next/link';
import Head from 'next/head';
import { resetPassword } from '@/pages/api/auth';

export default function ResetPassword() {
  const router = useRouter();
  const { token: tokenParam, id: idParam } = router.query;
  
  // Assicurarsi che token e id siano stringhe (non array)
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verificare che i parametri token e id siano presenti
  useEffect(() => {
    if (router.isReady) {
      if (!token || !id) {
        setErrorMsg('Token o ID non valido. Richiedi un nuovo link di reset password.');
      } else {
        setErrorMsg(''); // Limpiar errores previos si los parámetros están presentes
      }
    }
  }, [router.isReady, token, id]);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'La password deve contenere almeno 8 caratteri';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'La password deve contenere almeno una lettera minuscola';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'La password deve contenere almeno una lettera maiuscola';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'La password deve contenere almeno un numero';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Verificare che token e id siano presenti
    if (!token || !id) {
      setErrorMsg('Token o ID non valido. Richiedi un nuovo link di reset password.');
      return;
    }

    // Validazione password
    if (!password) {
      setErrorMsg('Per favore inserisci la nuova password');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrorMsg(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Le password non coincidono');
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(token, id, password);
      
      if (result.success) {
        setSuccessMsg('Password reimpostata con successo! Stai per essere reindirizzato al login...');
        
        // Reindirizzare al login dopo 3 secondi
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setErrorMsg(result.message || 'Errore durante il reset della password. Il token potrebbe essere scaduto.');
      }
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
      setErrorMsg('Errore di connessione al server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAuth>
      <Head>
        <title>Reimposta Password - WebZupp</title>
        <meta name="description" content="Reimposta la tua password per accedere al tuo account WebZupp" />
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
          .password-strength {
            font-size: 0.75rem;
            margin-top: 0.25rem;
          }
          .password-strength.weak { color: #ef4444; }
          .password-strength.medium { color: #f59e0b; }
          .password-strength.strong { color: #10b981; }
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
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4 gradient-title">
            Nuova Password
          </h1>
          <p className="text-center text-gray-200 mb-8">
            Inserisci la tua nuova password per completare il reset
          </p>
          

          
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
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                Nuova Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
                  placeholder="Almeno 8 caratteri"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {password && (
                <div className="password-strength mt-2 text-white/60">
                  {password.length < 8 && 'Almeno 8 caratteri'}
                  {password.length >= 8 && !/(?=.*[a-z])/.test(password) && 'Aggiungi una lettera minuscola'}
                  {password.length >= 8 && /(?=.*[a-z])/.test(password) && !/(?=.*[A-Z])/.test(password) && 'Aggiungi una lettera maiuscola'}
                  {password.length >= 8 && /(?=.*[a-z])/.test(password) && /(?=.*[A-Z])/.test(password) && !/(?=.*\d)/.test(password) && 'Aggiungi un numero'}
                  {password.length >= 8 && /(?=.*[a-z])/.test(password) && /(?=.*[A-Z])/.test(password) && /(?=.*\d)/.test(password) && (
                    <span className="text-green-400">✓ Password sicura</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-1">
                Conferma Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
                  placeholder="Ripeti la password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <div className="text-red-400 text-sm mt-1">
                  Le password non coincidano
                </div>
              )}
              {confirmPassword && password === confirmPassword && confirmPassword.length > 0 && (
                <div className="text-green-400 text-sm mt-1">
                  ✓ Le password coincidono
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !token || !id}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:from-indigo-600 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Reimpostazione in corso...' : 'Reimposta Password'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link href="/auth/login" className="text-indigo-200 hover:text-white text-sm font-medium transition block">
              Torna al login
            </Link>
            <Link href="/auth/forgot-password" className="text-indigo-200 hover:text-white text-sm font-medium transition block">
              Richiedi un nuovo link di reset
            </Link>
          </div>
        </div>
      </div>
    </LayoutAuth>
  );
} 