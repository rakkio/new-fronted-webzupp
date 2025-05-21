import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { getPreventivo, updatePreventivo } from '@/pages/api/preventivi';
import { toast } from 'react-hot-toast';
import { FaFileInvoice, FaUser, FaEnvelope, FaPhone, FaCalendar, FaMoneyBillWave, FaTag, FaFlag, FaArrowLeft, FaSave, FaEdit, FaBuilding, FaClock, FaList, FaMobile, FaSearchDollar, FaCommentAlt, FaGlobe, FaInfoCircle, FaExclamationTriangle, FaLock } from 'react-icons/fa';
import Link from 'next/link';
import { useUser } from '../../../../context/UserContext';

export default function PreventivoDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAdmin } = useUser();

  const [preventivo, setPreventivo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // Lista de características disponibles para el selector
  const availableFeatures = [
    { id: 'cms', label: 'CMS' },
    { id: 'blog', label: 'Blog' },
    { id: 'newsletter', label: 'Newsletter' },
    { id: 'multilingual', label: 'Multilingual' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'payment', label: 'Payment' },
    { id: 'chat', label: 'Chat' },
    { id: 'social', label: 'Social Media' },
    { id: 'seo', label: 'SEO' },
    { id: 'responsive', label: 'Responsive' }
  ];

  useEffect(() => {
    // Verificar que el usuario sea administrador
    if (user && !isAdmin()) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }
    
    if (id) {
      fetchPreventivo(id);
    }
  }, [id, user]);

  const fetchPreventivo = async (preventivoId) => {
    try {
      setLoading(true);
      const response = await getPreventivo(preventivoId);
      
      if (!response.success) {
        // Verificar si es un error de permisos
        if (response.message && (response.message.includes('permiso') || response.message.includes('Acceso denegado'))) {
          setAccessDenied(true);
        } else {
          setError(response.message || 'Error al cargar los detalles del preventivo');
          toast.error(response.message || 'Error al cargar los detalles del preventivo');
        }
        return;
      }
      
      setPreventivo(response.data);
      setFormData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar el preventivo:', err);
      if (err.message && (err.message.includes('permiso') || err.message.includes('Acceso denegado'))) {
        setAccessDenied(true);
      } else {
        setError('Error al cargar los detalles del preventivo');
        toast.error('Error al cargar los detalles del preventivo');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Manejo especial para checkboxes
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Manejar cambios en las características (features)
  const handleFeatureChange = (featureId, checked) => {
    const currentFeatures = formData.features || [];
    let newFeatures;
    
    if (checked) {
      // Añadir característica si no existe
      newFeatures = [...currentFeatures, featureId];
    } else {
      // Eliminar característica
      newFeatures = currentFeatures.filter(id => id !== featureId);
    }
    
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar que el usuario sea administrador
    if (!isAdmin()) {
      toast.error('Solo los administradores pueden actualizar preventivos');
      return;
    }
    
    try {
      const response = await updatePreventivo(id, formData);
      
      if (!response.success) {
        toast.error(response.message || 'Error al actualizar el preventivo');
        return;
      }
      
      toast.success('Preventivo actualizado correctamente');
      setPreventivo(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Error al actualizar preventivo:', error);
      toast.error('Error al actualizar el preventivo');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="text-center text-gray-500 py-20">Cargando detalles del preventivo...</div>
        </div>
      </AdminLayout>
    );
  }

  if (accessDenied) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="bg-red-100 p-8 rounded-xl shadow-lg text-center">
            <FaLock className="text-red-500 text-5xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-700 mb-2">Acceso Denegado</h1>
            <p className="text-red-600 mb-4">No tienes permiso para ver este preventivo. Solo los administradores pueden acceder a esta información.</p>
            <Link href="/admin/preventivi">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Volver a la lista de preventivos
              </button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="bg-red-100 p-8 rounded-xl shadow-lg text-center">
            <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-700 mb-2">Error</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/admin/preventivi">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Volver a la lista de preventivos
              </button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin/preventivi" className="flex items-center text-green-600 hover:text-green-800 transition">
            <FaArrowLeft className="mr-2" /> Volver a la lista
          </Link>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              disabled={!isAdmin()}
            >
              <FaEdit /> Editar
            </button>
          ) : (
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-100 p-4 border-b border-green-200">
            <h1 className="text-2xl font-bold text-green-800 flex items-center gap-2">
              <FaFileInvoice className="text-green-600" /> 
              Preventivo #{preventivo?._id.substring(0, 8)}
            </h1>
          </div>

          {editMode ? (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna 1: Información del cliente */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">Información del cliente</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">¿Cómo nos encontró?</label>
                    <select
                      name="howFound"
                      value={formData.howFound || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="google">Google</option>
                      <option value="social">Redes Sociales</option>
                      <option value="referral">Recomendación</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                </div>

                {/* Columna 2: Detalles del proyecto */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">Detalles del proyecto</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de proyecto</label>
                    <select
                      name="projectType"
                      value={formData.projectType || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="website">Sitio web</option>
                      <option value="ecommerce">Comercio electrónico</option>
                      <option value="webapp">Aplicación web</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Presupuesto</label>
                    <select
                      name="budget"
                      value={formData.budget || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="small">Bajo (&lt; 1000€)</option>
                      <option value="medium">Medio (1000€ - 5000€)</option>
                      <option value="large">Alto (&gt; 5000€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plazo</label>
                    <select
                      name="timeline"
                      value={formData.timeline || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="urgent">Urgente</option>
                      <option value="normal">Normal</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                      name="status"
                      value={formData.status || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="pending">Pendiente</option>
                      <option value="approved">Aprobado</option>
                      <option value="rejected">Rechazado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sitio de referencia</label>
                    <input
                      type="text"
                      name="reference"
                      value={formData.reference || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="ej. www.ejemplo.com"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="responsive"
                      name="responsive"
                      checked={formData.responsive || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 rounded"
                    />
                    <label htmlFor="responsive" className="text-sm font-medium text-gray-700">Diseño Responsivo</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="seo"
                      name="seo"
                      checked={formData.seo || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 rounded"
                    />
                    <label htmlFor="seo" className="text-sm font-medium text-gray-700">Optimización SEO</label>
                  </div>
                </div>

                {/* Columna 3: Características */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">Características</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {availableFeatures.map(feature => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`feature-${feature.id}`}
                          checked={(formData.features || []).includes(feature.id)}
                          onChange={(e) => handleFeatureChange(feature.id, e.target.checked)}
                          className="h-4 w-4 text-green-600 rounded"
                        />
                        <label htmlFor={`feature-${feature.id}`} className="text-sm font-medium text-gray-700">
                          {feature.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje / Descripción</label>
                <textarea
                  name="message"
                  value={formData.message || ''}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              
              <div className="mt-6 text-right">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 ml-auto"
                >
                  <FaSave /> Guardar cambios
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna 1: Información del cliente */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Información del cliente</h2>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaUser className="text-green-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Nombre</p>
                        <p className="font-medium">{preventivo?.name || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaEnvelope className="text-green-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{preventivo?.email || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaPhone className="text-green-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Teléfono</p>
                        <p className="font-medium">{preventivo?.phone || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaBuilding className="text-green-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Empresa</p>
                        <p className="font-medium">{preventivo?.company || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaInfoCircle className="text-green-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">¿Cómo nos encontró?</p>
                        <p className="font-medium">{preventivo?.howFound || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Columna 2: Detalles del proyecto */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Detalles del proyecto</h2>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaTag className="text-green-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Tipo de proyecto</p>
                        <p className="font-medium">{preventivo?.projectType || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaMoneyBillWave className="text-green-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Presupuesto</p>
                        <p className="font-medium">{preventivo?.budget || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaClock className="text-green-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Plazo</p>
                        <p className="font-medium">{preventivo?.timeline || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaFlag className="text-green-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <p className="font-medium">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            preventivo?.status === 'approved' 
                              ? 'bg-green-100 text-green-700' 
                              : preventivo?.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-700' 
                                : 'bg-red-100 text-red-700'
                          }`}>
                            {preventivo?.status || 'N/A'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaGlobe className="text-green-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Sitio de referencia</p>
                        <p className="font-medium">{preventivo?.reference || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCalendar className="text-green-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Fecha de creación</p>
                        <p className="font-medium">{formatDate(preventivo?.data_creazione)}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaCalendar className="text-green-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Última modificación</p>
                        <p className="font-medium">{formatDate(preventivo?.data_modifica)}</p>
                      </div>
                    </div>

                    <div className="flex items-start mt-2">
                      <div className="font-medium flex gap-2 items-center">
                        <span className={`flex items-center ${preventivo?.responsive ? 'text-green-600' : 'text-gray-400'}`}>
                          <FaMobile className="mr-1" /> 
                          Diseño Responsivo {preventivo?.responsive ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="font-medium flex gap-2 items-center">
                        <span className={`flex items-center ${preventivo?.seo ? 'text-green-600' : 'text-gray-400'}`}>
                          <FaSearchDollar className="mr-1" /> 
                          Optimización SEO {preventivo?.seo ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna 3: Características */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Características</h2>
                  {preventivo?.features && preventivo.features.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {preventivo.features.map(feature => (
                        <div key={feature} className="flex items-center space-x-2 text-green-600">
                          <FaList className="text-green-500" />
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No se han especificado características</p>
                  )}
                </div>
              </div>
              
              {preventivo?.message && (
                <div className="mt-6 border-t pt-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FaCommentAlt className="text-green-500" /> Mensaje
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">{preventivo.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 