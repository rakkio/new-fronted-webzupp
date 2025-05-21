import React from 'react'
import { useState, useEffect } from 'react'
import LayoutAuth from './components/LayoutAuth'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useUser } from '../../../context/UserContext'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [registerStatus, setRegisterStatus] = useState('')
    const { register, loading, error, isAuthenticated, user } = useUser()
    const router = useRouter()

    // Verificar autenticación al cargar
    useEffect(() => {
        // Si el usuario ya está autenticado, redirigir
        if (isAuthenticated) {
            setRegisterStatus('ti sei già loggato');
            router.push('/');
        }
    }, [isAuthenticated, router]);
    
    // Monitorear cambios en el estado del usuario
  
    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg('')
        setRegisterStatus('Verificando datos...')
        
        if (!email || !password || !username || !name || !lastname) {
            setErrorMsg('Per favore compila tutti i campi')
            setRegisterStatus('')
            return
        }
        if (password.length < 6) {
            setErrorMsg('La password deve avere almeno 6 caratteri')
            setRegisterStatus('')
            return
        }
        
        try {
            setRegisterStatus('Creando account...')
            
            const userData = {
                email,
                password,
                username,
                name,
                lastname
            }
            
            const result = await register(userData)
            
            if (result.success) {
                setRegisterStatus('Registro verificato...')
                
                // Mostrar mensaje sobre verificación de email
                setRegisterStatus('Registro verificato! Ti abbiamo inviato un email di verifica. Redirigendo...');
                
                setTimeout(() => {
                    router.push('/')
                }, 1500); // Dar más tiempo para leer el mensaje
            } else {
                setErrorMsg(result.message || "Errore nella creazione dell'account")
                setRegisterStatus('')
            }
        } catch (err) {
            setErrorMsg('Errore del server: ' + (err.message || 'Sconosciuto'))
            setRegisterStatus('')
        }
    }   

    return (
    <LayoutAuth>
        <Head>
            <style jsx global>{`
                body { background: #f5f7fa; }
                .register-glass {
                  background: rgba(255,255,255,0.15);
                  box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18);
                  backdrop-filter: blur(12px);
                  -webkit-backdrop-filter: blur(12px);
                  border-radius: 2rem;
                  border: 1.5px solid rgba(255,255,255,0.18);
                }
                .gradient-title {
                  background: linear-gradient(90deg, #ec4899 0%, #6366f1 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  text-fill-color: transparent;
                }
            `}</style>
        </Head>
        {/* Sfondo video come la home/login */}
        <div className="fixed inset-0 -z-10">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center" style={{filter:'brightness(0.7)'}}>
            <source src="/video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600/60 via-purple-700/40 to-indigo-600/30"></div>
        </div>
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg mx-auto register-glass p-8 md:p-10 relative">
            {/* Logo/avatar brand */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-3xl font-bold text-pink-500 shadow-lg">
                WZ
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4 gradient-title">Crea il tuo account</h1>
            <p className="text-center text-gray-200 mb-8">Registrati su WebZUPP per iniziare la tua esperienza digitale.</p>
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-white text-center">
                {errorMsg}
              </div>
            )}
            {registerStatus && (
              <div className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-white text-center">
                {registerStatus}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-sm"
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
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-1">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-sm"
                  placeholder="username123"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">Nome</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium text-white/80 mb-1">Cognome</label>
                  <input
                    type="text"
                    id="lastname"
                    value={lastname}
                    onChange={e => setLastname(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-sm"
                    required
                  />
                </div>
                </div>
              <div className="flex items-center mt-3">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-pink-500 focus:ring-pink-400 bg-white/10 border-white/20 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-white/80">
                  Accetto i <a href="#" className="text-pink-200 hover:text-white transition-colors">Termini e Condizioni</a>
                </label>
                </div>
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg hover:from-pink-600 hover:to-indigo-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                >
                  {loading ? 'Creazione account...' : 'Registrati'}
                </button>
                </div>
            </form>
            <div className="flex justify-between items-center mt-6">
              <Link href="/auth/login" className="text-pink-200 hover:text-white text-sm font-medium transition">Hai già un account? Accedi</Link>
            </div>
          </div>
        </div>
    </LayoutAuth>
  )
}
