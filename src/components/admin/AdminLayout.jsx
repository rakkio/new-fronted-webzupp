import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaUsers, FaBlog, FaFileInvoice, FaGlobe, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { useUser } from '../../../context/UserContext';
import { useRouter } from 'next/router';

export default function AdminLayout({ children, title = 'Admin Panel' }) {
  const { user, isAuthenticated, logout } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  
  // Determinación simple de si el usuario es admin basado en el contexto del usuario
  const isAdmin = isAuthenticated && user?.role === 'admin';
  
  // Evitar problemas de hidratación usando useEffect para clientside rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Log de diagnóstico solo después del mount
  useEffect(() => {
    if (isMounted) {
      console.log('AdminLayout - Estado de usuario:', {
        autenticado: isAuthenticated,
        esAdmin: isAdmin,
        usuario: user ? {
          id: user._id,
          email: user.email,
          role: user.role || 'no definido'
        } : 'no disponible'
      });
    }
  }, [isMounted, isAuthenticated, isAdmin, user]);

  // Estado de carga inicial - evitar problemas de hidratación
  if (!isMounted) {
    return null; // No renderizar nada hasta que el componente esté montado
  }

  // Después de determinar el estado en el cliente, mostrar pantalla de acceso denegado
  if (!isAdmin) {
    return (
      <>
        <Head>
          <title>{`Acceso Denegado | ${title}`}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h1 className="text-3xl font-bold mb-4 text-red-600">Accesso Negato</h1>
            <p className="text-lg text-gray-600 mb-4">Questa sezione è riservata agli amministratori.</p>
            <div className="text-sm text-gray-500 mb-4">
              Estado actual: {isAuthenticated ? 'Autenticado' : 'No autenticado'}
              <br/>
              Rol: {user?.role || 'No definido'}
            </div>
            <div className="flex space-x-3 justify-center">
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Cerrar sesión
              </button>
              <button 
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
              >
                Ir a inicio
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Si pasamos la verificación de admin en el cliente, mostrar el layout completo
  return (
    <>
      <Head>
        <title>{`${title} | WebZupp Admin`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen flex bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-lg hidden md:flex flex-col py-8 px-4">
          <div className="flex items-center mb-10">
            <FaUserShield className="text-indigo-600 w-8 h-8 mr-2" />
            <span className="text-xl font-bold text-indigo-700">Admin Panel</span>
          </div>
          <nav className="flex-1 space-y-2">
            <Link href="/admin/dashboard" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition font-medium">
              <FaUserShield className="mr-2" /> Dashboard
            </Link>
            <Link href="/admin/users" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition font-medium">
              <FaUsers className="mr-2" /> Utenti
            </Link>
            <Link href="/admin/blog" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition font-medium">
              <FaBlog className="mr-2" /> Blog
            </Link>
            <Link href="/admin/preventivi" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition font-medium">
              <FaFileInvoice className="mr-2" /> Preventivi
            </Link>
            <Link href="/admin/websites" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition font-medium">
              <FaGlobe className="mr-2" /> Siti Web
            </Link>
          </nav>
          <div className="mt-auto pt-8 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <div className="font-medium text-gray-800">{user?.name || 'Admin'}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center px-4 py-2 w-full text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
            >
              <FaSignOutAlt className="mr-2" /> Esci
            </button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 min-h-screen flex flex-col">
          {/* Header mobile */}
          <header className="md:hidden flex items-center justify-between px-4 py-4 bg-white border-b shadow">
            <div className="flex items-center space-x-2">
              <FaUserShield className="text-indigo-600 w-6 h-6" />
              <span className="font-bold text-indigo-700">Admin</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <button onClick={logout} className="text-red-600 hover:text-red-800">
                <FaSignOutAlt />
              </button>
            </div>
          </header>
          <div className="flex-1 p-4 md:p-10">
            {children}
          </div>
        </main>
      </div>
    </>
  );
} 