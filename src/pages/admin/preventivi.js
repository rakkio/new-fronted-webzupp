import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaFileInvoice, FaUser, FaEnvelope, FaEye, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { getPreventivi, deletePreventivo } from '@/pages/api/preventivi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useUser } from '../../../context/UserContext';
import { useRouter } from 'next/router';

export default function AdminPreventivi() {
  const [preventivi, setPreventivi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAdmin } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Verificar que el usuario sea administrador
    if (user && !isAdmin()) {
      setError('Acceso denegado: solo los administradores pueden ver esta página');
      setLoading(false);
      return;
    }
    
    fetchPreventivi();
  }, [user]);

  const fetchPreventivi = async () => {
    try {
      setLoading(true);
      const response = await getPreventivi();
      
      if (!response.success) {
        setError(response.message || 'Error al cargar los preventivos');
        toast.error(response.message || 'Error al cargar los preventivos');
        setPreventivi([]);
        return;
      }
      
      setPreventivi(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar preventivi:', err);
      setError('Error al cargar los preventivos');
      toast.error('Error al cargar los preventivos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin()) {
      toast.error('Solo los administradores pueden eliminar preventivos');
      return;
    }
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este preventivo?')) {
      try {
        const response = await deletePreventivo(id);
        
        if (!response.success) {
          toast.error(response.message || 'Error al eliminar el preventivo');
          return;
        }
        
        toast.success('Preventivo eliminado correctamente');
        fetchPreventivi(); // Recargar la lista
      } catch (error) {
        console.error('Error al eliminar preventivo:', error);
        toast.error('Error al eliminar el preventivo');
      }
    }
  };

  // Formato de fecha legible
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Si el usuario no es administrador, mostrar mensaje de acceso denegado
  if (user && !isAdmin()) {
    return (
      <AdminLayout>
        <section className="max-w-5xl mx-auto py-10 px-4">
          <div className="bg-red-100 p-6 rounded-xl shadow-lg text-center">
            <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-700 mb-2">Acceso Denegado</h1>
            <p className="text-red-600 mb-4">Solo los administradores pueden acceder a la gestión de preventivos.</p>
            <button 
              onClick={() => router.push('/admin')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Volver al panel de administración
            </button>
          </div>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-green-700 mb-8 flex items-center gap-2"><FaFileInvoice className="text-green-500" /> Gestione Preventivi</h1>
        <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
          {loading ? (
            <div className="text-center text-gray-500 py-20">Cargando preventivos...</div>
          ) : error ? (
            <div className="bg-red-100 p-6 rounded-lg text-center">
              <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-2" />
              <p className="text-red-600">{error}</p>
            </div>
          ) : preventivi.length === 0 ? (
            <div className="text-center text-gray-500 py-20">No hay preventivos disponibles</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tipo Progetto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Budget</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stato</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Data</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Azioni</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {preventivi.map(item => (
                  <tr key={item._id} className="hover:bg-green-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2"><FaUser className="text-indigo-400" /> {item.name}</td>
                    <td className="px-4 py-3 text-gray-700 flex items-center gap-2"><FaEnvelope className="text-indigo-400" /> {item.email}</td>
                    <td className="px-4 py-3 text-gray-700">{item.projectType}</td>
                    <td className="px-4 py-3 text-gray-700">{item.budget}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'approved' ? 'bg-green-100 text-green-700' : item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(item.data_creazione || item.date)}</td>
                    <td className="px-4 py-3 flex items-center gap-3 justify-center">
                      <Link href={`/admin/preventivi/${item._id}`}>
                        <button className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700 transition" title="Visualizza">
                          <FaEye />
                        </button>
                      </Link>
                      <button 
                        className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition" 
                        title="Elimina"
                        onClick={() => handleDelete(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </AdminLayout>
  );
} 