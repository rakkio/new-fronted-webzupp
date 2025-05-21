import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { FaUsers, FaBlog, FaFileInvoice, FaGlobe, FaCrown, FaArrowRight } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';

// MOCK: Dati demo, da collegare a backend/API
const mockStats = {
  utenti: 12,
  blog: 24,
  preventivi: 7,
  siti: 4
};

export default function Dashboard() {
  const [stats, setStats] = useState(mockStats);
  const { user } = useUser();

  useEffect(() => {
    // Qui si possono fare chiamate API per caricare i dati reali
    // setStats(...)
  }, []);

  return (
    <AdminLayout>
      <section className="max-w-6xl mx-auto py-10 px-4">
        {/* Benvenuto admin */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-4xl text-indigo-600 font-bold shadow-lg">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || 'A'
                )}
              </div>
              <span className="absolute -bottom-2 -right-2 bg-yellow-400 text-white rounded-full px-2 py-1 text-xs font-bold flex items-center shadow"><FaCrown className="mr-1" /> Admin</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-1">Ciao, {user?.name || 'Admin'}!</h1>
              <p className="text-gray-500 text-sm">({user?.email})</p>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-gray-400 text-sm mb-1">Ultimo accesso:</span>
            <span className="text-gray-700 font-medium">{new Date().toLocaleString('it-IT')}</span>
          </div>
        </div>

        {/* Statistiche animate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-14">
          <StatCard icon={<FaUsers className="w-8 h-8" />} value={stats.utenti} label="Utenti" color="indigo" />
          <StatCard icon={<FaBlog className="w-8 h-8" />} value={stats.blog} label="Blog" color="pink" />
          <StatCard icon={<FaFileInvoice className="w-8 h-8" />} value={stats.preventivi} label="Preventivi" color="green" />
          <StatCard icon={<FaGlobe className="w-8 h-8" />} value={stats.siti} label="Siti Web" color="yellow" />
        </div>

        {/* Link di gestione */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ManageCard
            href="/admin/users"
            icon={<FaUsers className="w-7 h-7 text-indigo-600" />}
            title="Gestione Utenti"
            description="Visualizza, modifica o elimina gli utenti registrati."
            color="indigo"
          />
          <ManageCard
            href="/admin/blog"
            icon={<FaBlog className="w-7 h-7 text-pink-500" />}
            title="Gestione Blog"
            description="Crea, modifica o elimina articoli del blog."
            color="pink"
          />
          <ManageCard
            href="/admin/preventivi"
            icon={<FaFileInvoice className="w-7 h-7 text-green-500" />}
            title="Gestione Preventivi"
            description="Visualizza e gestisci le richieste di preventivo ricevute."
            color="green"
          />
          <ManageCard
            href="/admin/websites"
            icon={<FaGlobe className="w-7 h-7 text-yellow-500" />}
            title="Gestione Siti Web"
            description="Gestisci i siti web creati e le loro impostazioni."
            color="yellow"
          />
        </div>
      </section>
    </AdminLayout>
  );
}

// Card statistica animata
function StatCard({ icon, value, label, color }) {
  const colorMap = {
    indigo: 'from-indigo-400 to-indigo-600 text-indigo-700',
    pink: 'from-pink-400 to-pink-600 text-pink-700',
    green: 'from-green-400 to-green-600 text-green-700',
    yellow: 'from-yellow-300 to-yellow-500 text-yellow-700',
  };
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} rounded-xl shadow-lg p-6 flex flex-col items-center text-white relative overflow-hidden`}>
      <div className="absolute right-2 top-2 opacity-10 text-6xl">
        {icon}
      </div>
      <div className="z-10 flex flex-col items-center">
        <div className="text-4xl font-extrabold mb-1 animate-pulse">{value}</div>
        <div className="uppercase tracking-wide text-sm font-semibold">{label}</div>
      </div>
    </div>
  );
}

// Card gestione sezione
function ManageCard({ href, icon, title, description, color }) {
  const colorMap = {
    indigo: 'hover:border-indigo-500',
    pink: 'hover:border-pink-500',
    green: 'hover:border-green-500',
    yellow: 'hover:border-yellow-500',
  };
  return (
    <Link href={href} className={`group block bg-white rounded-xl border border-transparent shadow p-6 transition-all duration-200 hover:shadow-xl ${colorMap[color]}`}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h2 className="text-lg font-bold text-gray-800 group-hover:underline">{title}</h2>
      </div>
      <p className="text-gray-500 mb-4">{description}</p>
      <span className={`inline-flex items-center text-sm font-semibold text-${color}-600 group-hover:underline`}>Gestisci <FaArrowRight className="ml-1" /></span>
    </Link>
  );
} 