import React from 'react'
import LayoutAuth from './components/LayoutAuth'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useUser } from '../../../context/UserContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loginStatus, setLoginStatus] = useState('')
    const [redirectPath, setRedirectPath] = useState('/')
    const { login, loading, error, isAuthenticated, user } = useUser()
    const router = useRouter()

    // Extraer parámetro de redirección de la URL
    useEffect(() => {
        // Obtener el parámetro redirect de la URL
        const { redirect } = router.query;
        if (redirect) {
            console.log('Se detectó redirección después de login a:', redirect);
            setRedirectPath(decodeURIComponent(redirect));
        }
    }, [router.query]);

    // Verificar autenticación al cargar
    useEffect(() => {
        // Si el usuario ya está autenticado, redirigir
        if (isAuthenticated) {
            console.log('Usuario autenticado, redirigiendo a:', redirectPath);
            setLoginStatus('Redirigiendo...');
            router.push(redirectPath);
        }
    }, [isAuthenticated, router, redirectPath]);
    
    // Monitorear cambios en el estado del usuario
    useEffect(() => {
        console.log('Estado de usuario actualizado:', {
            autenticado: isAuthenticated,
            cargando: loading,
            usuario: user ? {
                id: user._id,
                email: user.email,
                role: user.role || 'no definido'
            } : 'no disponible'
        });
    }, [user, isAuthenticated, loading]);

    // Verificar token al cargar
    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('token');
            console.log('Verificando token al cargar página de login:', {
                existe: !!token,
                longitud: token?.length
            });
            
            // No validamos formato específico del token para ser más flexibles
        };
        
        checkToken();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg('')
        setLoginStatus('Verificando credenciales...')
        
        if (!email || !password) {
            setErrorMsg('Per favore compila tutti i campi')
            setLoginStatus('')
            return
        }
        
        try {
            console.log('Iniciando proceso de login con:', { email });
            console.log('Después del login se redirigirá a:', redirectPath);
            
            // Crear un objeto con las credenciales
            const credentials = { email, password }
            
            // Usamos directamente el método de login del contexto sin la complejidad adicional
            const result = await login(credentials);
            
            if (result.success) {
                console.log('Login exitoso, redirigiendo a:', redirectPath);
                setLoginStatus('Login exitoso! Redirigiendo...');
                
                // Redirigir
                setTimeout(() => {
                    router.push(redirectPath);
                }, 1000);
            } else {
                setErrorMsg(result.message || 'Errore durante l\'autenticazione');
                setLoginStatus('');
            }
        } catch (err) {
            setErrorMsg('Errore del server: ' + (err.message || 'Sconosciuto'));
            setLoginStatus('');
            console.error('Excepción durante login:', err);
        }
    }

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
            <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4 gradient-title">Accedi al tuo account</h1>
            <p className="text-center text-gray-200 mb-8">Benvenuto su WebZUPP! Inserisci le tue credenziali per continuare.</p>
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-white text-center">
                {errorMsg}
              </div>
            )}
            {loginStatus && (
              <div className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-white text-center">
                {loginStatus}
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
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:from-indigo-600 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                {loading ? 'Accesso in corso...' : 'Accedi'}
              </button>
            </form>
            <div className="flex justify-between items-center mt-6">
              <Link href="/auth/register" className="text-indigo-200 hover:text-white text-sm font-medium transition">Non hai un account? Registrati</Link>
              <a href="#" className="text-indigo-200 hover:text-white text-sm font-medium transition">Password dimenticata?</a>
            </div>
          </div>
        </div>
    </LayoutAuth>
  )
}
