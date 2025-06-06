import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { FaUsers, FaBlog, FaFileInvoice, FaGlobe, FaCrown, FaArrowRight, FaChartLine, FaEye, FaPlus, FaClock } from 'react-icons/fa';
import { useUser } from '../../../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';

// MOCK: Dati demo, da collegare a backend/API
const mockStats = {
  utenti: 12,
  blog: 24,
  preventivi: 7,
  siti: 4
};

const recentActivities = [
  { type: 'blog', title: 'Nuovo post pubblicato', time: '2 ore fa', icon: FaBlog },
  { type: 'user', title: 'Nuovo utente registrato', time: '4 ore fa', icon: FaUsers },
  { type: 'preventivo', title: 'Richiesta preventivo ricevuta', time: '1 giorno fa', icon: FaFileInvoice },
];

export default function Dashboard() {
  const [stats, setStats] = useState(mockStats);
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setIsMounted(true);
    // Qui si possono fare chiamate API per caricare i dati reali
    // setStats(...)
  }, []);

  // Evita errori di hydration rendendo solo dopo il mount
  if (!isMounted) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <FaChartLine className="w-8 h-8 text-white" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header con benvenuto */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-200/50">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl text-white font-bold shadow-lg overflow-hidden">
                    {user?.avatar?.url ? (
                      <img src={user.avatar.url} alt="Avatar" className="w-full h-full object-cover rounded-3xl" />
                    ) : (
                      user?.name?.charAt(0)?.toUpperCase() || 'A'
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full px-2 py-1 text-xs font-bold flex items-center shadow-lg">
                    <FaCrown className="mr-1 w-3 h-3" /> Admin
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    ¡Hola, {user?.name || 'Admin'}!
                  </h1>
                  <p className="text-gray-600 text-lg">Bienvenido a tu panel de administración</p>
                  <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
                </div>
              </div>
              <div className="flex flex-col items-center lg:items-end">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50/50 rounded-2xl border border-gray-200/50">
                  <FaClock className="w-4 h-4 text-gray-400" />
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Último acceso</div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date().toLocaleDateString('es-ES', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Estadísticas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard 
            icon={<FaUsers className="w-6 h-6" />} 
            value={stats.utenti} 
            label="Usuarios" 
            color="from-indigo-500 to-purple-600"
            delay={0}
          />
          <StatCard 
            icon={<FaBlog className="w-6 h-6" />} 
            value={stats.blog} 
            label="Posts Blog" 
            color="from-pink-500 to-rose-600"
            delay={0.1}
          />
          <StatCard 
            icon={<FaFileInvoice className="w-6 h-6" />} 
            value={stats.preventivi} 
            label="Preventivos" 
            color="from-green-500 to-emerald-600"
            delay={0.2}
          />
          <StatCard 
            icon={<FaGlobe className="w-6 h-6" />} 
            value={stats.siti} 
            label="Sitios Web" 
            color="from-yellow-500 to-orange-600"
            delay={0.3}
          />
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enlaces de gestión */}
          <div className="xl:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión Rápida</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ManageCard
                  href="/admin/users"
                  icon={<FaUsers className="w-6 h-6" />}
                  title="Gestión de Usuarios"
                  description="Administra los usuarios registrados en el sistema"
                  color="from-indigo-500 to-purple-600"
                  stats={`${stats.utenti} usuarios`}
                />
                <ManageCard
                  href="/admin/blog"
                  icon={<FaBlog className="w-6 h-6" />}
                  title="Gestión de Blog"
                  description="Crea y gestiona el contenido del blog"
                  color="from-pink-500 to-rose-600"
                  stats={`${stats.blog} posts`}
                />
                <ManageCard
                  href="/admin/preventivi"
                  icon={<FaFileInvoice className="w-6 h-6" />}
                  title="Gestión de Preventivos"
                  description="Revisa las solicitudes de presupuesto"
                  color="from-green-500 to-emerald-600"
                  stats={`${stats.preventivi} solicitudes`}
                />
                <ManageCard
                  href="/admin/websites"
                  icon={<FaGlobe className="w-6 h-6" />}
                  title="Gestión de Sitios"
                  description="Administra los sitios web creados"
                  color="from-yellow-500 to-orange-600"
                  stats={`${stats.siti} sitios`}
                />
              </div>
            </motion.div>
          </div>

          {/* Actividad reciente */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-200/50"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Actividad Reciente</h3>
              <div className="space-y-4">
                <AnimatePresence>
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50/50 transition-all duration-200"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                        <activity.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 pt-4 border-t border-gray-200/50"
              >
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50/50 rounded-2xl transition-all duration-200">
                  <FaEye className="w-4 h-4" />
                  Ver toda la actividad
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Card estadística animada
function StatCard({ icon, value, label, color, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.2 }}
      className={`bg-gradient-to-br ${color} rounded-3xl shadow-lg p-6 text-white relative overflow-hidden group hover:scale-105 transition-all duration-300`}
    >
      <div className="absolute right-4 top-4 opacity-20 text-4xl group-hover:opacity-30 transition-opacity duration-300">
        {icon}
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
          {value}
        </div>
        <div className="text-white/90 font-medium">{label}</div>
      </div>
    </motion.div>
  );
}

// Card per le azioni di gestione
function ManageCard({ href, icon, title, description, color, stats }) {
  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group cursor-pointer"
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-600 text-sm mt-1 mb-3">{description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">{stats}</span>
              <FaArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
} 