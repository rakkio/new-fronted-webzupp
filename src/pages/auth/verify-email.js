import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import LayoutAuth from './components/LayoutAuth';
import { useUser } from '../../../context/UserContext';

export default function VerifyEmail() {
  const router = useRouter();
  const { token, id } = router.query;
  const { verifyEmail, resendVerificationEmail } = useUser();
  
  const [verificationStatus, setVerificationStatus] = useState('verificando');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      // Solo verificar si tenemos un token y un ID
      if (token && id) {
        try {
          const result = await verifyEmail(token, id);
          
          if (result.success) {
            setVerificationStatus('success');
          } else {
            setVerificationStatus('error');
            setMessage(result.message || 'Error al verificar el email');
          }
        } catch (error) {
          console.error('Error de verificación:', error);
          setVerificationStatus('error');
          setMessage('Error de conexión al verificar el email');
        }
      }
    };

    verifyToken();
  }, [token, id, verifyEmail]);

  const handleResend = async (e) => {
    e.preventDefault();
    
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const result = await resendVerificationEmail(email);
      
      if (result.success) {
        setMessage('Email di verifica inviato. Controlla la tua casella di posta.');
      } else {
        setMessage(result.message || "Errore nell'invio dell'email di verifica");
      }
    } catch (error) {
      console.error('Error al reenviar:', error);
      setMessage('Errore di connessione durante l\'invio dell\'email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LayoutAuth>
      <Head>
        <style jsx global>{`
          body { background: #f5f7fa; }
          .verify-glass {
            background: rgba(255,255,255,0.15);
            box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 2rem;
            border: 1.5px solid rgba(255,255,255,0.18);
          }
          .gradient-title {
            background: linear-gradient(90deg, #10B981 0%, #3B82F6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
          }
        `}</style>
      </Head>
      
      {/* Fondo de video */}
      <div className="fixed inset-0 -z-10">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center" style={{filter:'brightness(0.7)'}}>
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/40 via-blue-600/30 to-indigo-600/20"></div>
      </div>
      
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md mx-auto verify-glass p-8 md:p-10 relative">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl font-bold text-green-600 shadow-lg">
              WZ
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4 gradient-title">Verifica Email</h1>
          
          {verificationStatus === 'verificando' && (
            <div className="text-center">
              <p className="text-gray-200 text-lg mb-4">
                Stiamo verificando la tua email...
              </p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
              </div>
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Email verificata con successo!</h3>
              <p className="text-gray-200 mb-6">
                Il tuo account è stato verificato. Ora puoi accedere a tutte le funzionalità.
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                >
                  Vai alla Home
                </Link>
              </div>
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Errore di verifica</h3>
              <p className="text-gray-200 mb-6">
                {message || "Il link di verifica potrebbe essere scaduto o non valido."}
              </p>
              
              <div className="space-y-6 bg-white/10 rounded-xl p-6 mt-8 border border-white/10">
                <h4 className="text-lg font-semibold text-white text-left">Richiedi un nuovo link di verifica</h4>
                <form onSubmit={handleResend} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2 text-left">
                      Indirizzo email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                  >
                    {isSubmitting ? 'Invio in corso...' : 'Invia nuovo link di verifica'}
                  </button>
                </form>
              </div>
              
              <div className="mt-6">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-green-300 hover:text-white transition-colors"
                >
                  Torna al Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutAuth>
  );
} 