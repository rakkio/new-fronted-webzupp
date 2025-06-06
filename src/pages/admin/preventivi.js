import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaFileInvoice, FaUser, FaEnvelope, FaEye, FaTrash, FaExclamationTriangle, FaSpinner, FaClock, FaMoneyBillWave, FaClipboardList } from 'react-icons/fa';
import { getPreventivi, deletePreventivo } from '@/pages/api/preventivi';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
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
        fetchPreventivi();
      } catch (error) {
        toast.error('Error al eliminar el preventivo');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return 'Aprobado';
      case 'pending': return 'Pendiente';
      case 'rejected': return 'Rechazado';
      default: return status;
    }
  };

  if (user && !isAdmin()) {
    return (
      <AdminLayout title="Acceso Denegado">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl text-center border border-gray-200/50"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaExclamationTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Acceso Denegado</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">Solo los administradores pueden acceder a la gestión de preventivos.</p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
            >
              Volver al panel de administración
            </motion.button>
          </motion.div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestión de Preventivos">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaFileInvoice className="w-5 h-5 text-white" />
              </div>
              Gestión de Preventivos
            </h1>
            <p className="text-gray-600">Administra las solicitudes de presupuesto</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-medium">{preventivi.length} solicitudes</span>
          </div>
        </motion.div>

        {/* Lista de preventivi */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 overflow-hidden"
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FaSpinner className="w-8 h-8 text-white animate-spin" />
                </div>
                <p className="text-gray-600 font-medium">Cargando preventivos...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar</h3>
              <p className="text-red-600">{error}</p>
            </div>
          ) : preventivi.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClipboardList className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay preventivos disponibles</h3>
              <p className="text-gray-600">Las nuevas solicitudes aparecerán aquí</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Proyecto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Presupuesto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  <AnimatePresence>
                    {preventivi.map((item, index) => (
                      <motion.tr 
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-green-50/30 transition-all duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <FaUser className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                              {item.company && (
                                <div className="text-xs text-gray-500">{item.company}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{item.email}</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">{item.projectType}</span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FaMoneyBillWave className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{item.budget}</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaClock className="w-4 h-4 text-gray-400" />
                            {formatDate(item.data_creazione || item.date)}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Link href={`/admin/preventivi/${item._id}`}>
                                <div className="p-2 rounded-xl bg-green-100 hover:bg-green-200 text-green-600 transition-all duration-200 cursor-pointer" title="Visualizar">
                                  <FaEye className="w-4 h-4" />
                                </div>
                              </Link>
                            </motion.div>
                            
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-200" 
                              title="Eliminar"
                              onClick={() => handleDelete(item._id)}
                            >
                              <FaTrash className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
} 