import React, { useState } from 'react'
import Layout from '@/components/Layout'
import { FaArrowRight, FaArrowLeft, FaCheck, FaGlobe, FaShoppingCart, FaMobile, FaPaintBrush, FaCog, FaStar } from 'react-icons/fa'
import { createPreventivo } from '@/pages/api/preventivi'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'

export default function Preventivo() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Paso 1: Información básica
    name: '',
    email: '',
    phone: '',
    company: '',
    
    // Paso 2: Tipo de proyecto
    projectType: '',
    budget: '',
    timeline: '',
    
    // Paso 3: Detalles específicos
    features: [],
    responsive: true,
    seo: true,
    
    // Paso 4: Información adicional
    message: '',
    reference: '',
    howFound: ''
  })

  const projectTypes = [
    { id: 'website', icon: FaGlobe, label: 'Sito Web' },
    { id: 'ecommerce', icon: FaShoppingCart, label: 'E-commerce' },
    { id: 'webapp', icon: FaMobile, label: 'Web App' },
    { id: 'redesign', icon: FaPaintBrush, label: 'Redesign' },
    { id: 'other', icon: FaCog, label: 'Altro' }
  ]

  const budgets = [
    { id: 'small', label: 'Piccolo (€1.000 - €5.000)' },
    { id: 'medium', label: 'Medio (€5.000 - €15.000)' },
    { id: 'large', label: 'Grande (€15.000 - €30.000)' },
    { id: 'enterprise', label: 'Enterprise (>€30.000)' }
  ]

  const timelines = [
    { id: 'urgent', label: 'Urgente (< 1 mese)' },
    { id: 'normal', label: 'Normale (1-3 mesi)' },
    { id: 'flexible', label: 'Flessibile (3-6 mesi)' },
    { id: 'planning', label: 'In fase di pianificazione' }
  ]

  const features = [
    'cms',
    'blog',
    'newsletter',
    'multilingual',
    'analytics',
    'payment',
    'chat',
    'social'
  ]

  const featureLabels = {
    cms: 'Login utenti',
    blog: 'Blog',
    payment: 'Integrazione pagamenti',
    newsletter: 'Newsletter',
    multilingual: 'Multilingua',
    analytics: 'API personalizzate',
    chat: 'Chat',
    social: 'Integrazione CRM'
  }

  // Validar email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Validar número de teléfono
  const validatePhone = (phone) => {
    if (!phone) return true; // No es obligatorio
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(phone);
  }

  // Limpiar y sanitizar inputs
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    let sanitizedValue = type === 'checkbox' ? checked : sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }))
  }

  const handleFeatureToggle = (feature) => {
    console.log('Toggle feature:', feature); // Debug log
    setFormData(prev => {
      const newFeatures = prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature];
      console.log('Nuevas features:', newFeatures); // Debug log
      return {
        ...prev,
        features: newFeatures
      };
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Solo permitir submit si estamos en el paso 4
    if (step !== 4) {
      // No hacer nada si no es el paso 4
      return;
    }

    // Este es un envío explícito desde el paso 4
    // Validaciones finales antes de enviar
    if (!formData.name || !formData.email || !formData.projectType || !formData.budget || !formData.timeline) {
      toast.error('Per favore, completa tutti i campi obbligatori')
      return
    }

    // Validar formato de email
    if (!validateEmail(formData.email)) {
      toast.error('Inserisci un indirizzo email valido')
      return
    }

    // Validar teléfono si se proporcionó
    if (formData.phone && !validatePhone(formData.phone)) {
      toast.error('Inserisci un numero di telefono valido')
      return
    }

    // Validar URL de referencia si se proporcionó
    if (formData.reference && !formData.reference.startsWith('http')) {
      toast.error('Inserisci un URL valido per il sito di riferimento')
      return
    }

    try {
      setSubmitting(true)
      
      // Preparar datos para enviar - sanitizar todos los campos de texto
      const sanitizedData = {
        ...formData,
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        phone: sanitizeInput(formData.phone),
        company: sanitizeInput(formData.company),
        message: sanitizeInput(formData.message),
        reference: sanitizeInput(formData.reference),
        howFound: sanitizeInput(formData.howFound)
      };
      
      // Enviar datos al backend
      const response = await createPreventivo(sanitizedData)
      
      // Mostrar mensaje de éxito
      toast.success('Richiesta inviata con successo!')
      
      // Redireccionar a página de agradecimiento
      router.push('/grazie')
    } catch (error) {
      console.error('Error al enviar el formulario:', error)
      toast.error('Si è verificato un errore. Riprova più tardi.')
    } finally {
      setSubmitting(false)
    }
  }

  const nextStep = (e) => {
    // Asegurar que no se envíe el formulario automáticamente
    if (e) e.preventDefault();
    
    console.log('nextStep - Step actual:', step); // Debug log
    console.log('Features actuales:', formData.features); // Debug log
    
    // Validación básica antes de avanzar
    if (step === 1) {
      if (!formData.name || !formData.email) {
        toast.error('Compila i campi obbligatori')
        return
      }
      
      if (!validateEmail(formData.email)) {
        toast.error('Inserisci un indirizzo email valido')
        return
      }
      
      if (formData.phone && !validatePhone(formData.phone)) {
        toast.error('Inserisci un numero di telefono valido')
        return
      }
    }
    
    if (step === 2 && (!formData.projectType || !formData.budget || !formData.timeline)) {
      toast.error('Seleziona tutte le opzioni richieste')
      return
    }
    
    // Para el paso 3, requerimos al menos una característica
    if (step === 3) {
      console.log('Validando paso 3...'); // Debug log
      if (!formData.features || formData.features.length === 0) {
        console.log('No hay features seleccionadas'); // Debug log
        toast.error('Seleziona almeno una funzionalità')
        return
      }
      console.log('Features válidas:', formData.features); // Debug log
    }
    
    // No avanzar más allá del paso 4
    if (step < 4) {
      console.log('Avanzando al paso:', step + 1); // Debug log
      setStep(prev => prev + 1)
    }
  }
  
  const prevStep = () => setStep(prev => prev - 1)

  // Estilos CSS mejorados
  const inputClasses = "w-full px-4 py-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 transition-all duration-200 shadow-sm text-black bg-white placeholder-gray-400"
  const labelClasses = "block text-sm font-medium text-indigo-900 mb-2"
  const buttonClasses = "w-full flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-200"
  const primaryButtonClasses = "px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
  const secondaryButtonClasses = "px-6 py-3 border border-indigo-400 text-indigo-700 rounded-xl hover:bg-indigo-50 transition-colors"
  const featureBoxClasses = "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-indigo-300 hover:shadow-md"
  const formTitleClass = "text-2xl font-semibold text-indigo-900 mb-6 flex items-center"
  const stepNumberClass = "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 transform"
  const textClasses = "text-gray-900 font-medium"

  // Estados para mostrar el resumen de datos
  const [showDebug, setShowDebug] = useState(false)

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-100 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-6">
              Richiedi un Preventivo
            </h1>
            <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
              Compila il form sottostante per ricevere un preventivo personalizzato per il tuo progetto.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
            {/* Progress Bar */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-4">
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`flex items-center ${
                      stepNumber < 4 ? 'flex-1' : ''
                    }`}
                  >
                    <div
                      className={`${stepNumberClass} ${
                        step >= stepNumber
                          ? 'bg-white text-indigo-600 shadow-md'
                          : 'bg-indigo-500 bg-opacity-50 text-white'
                      } ${step === stepNumber ? 'scale-110' : ''}`}
                    >
                      {step > stepNumber ? <FaCheck className="text-green-500" /> : stepNumber}
                    </div>
                    {stepNumber < 4 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                          step > stepNumber
                            ? 'bg-white'
                            : 'bg-indigo-400 bg-opacity-30'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form 
              onSubmit={(e) => {
                // Solo permitir envío cuando se hace clic en el botón de envío en el paso 4
                if (step !== 4 || !e.nativeEvent.submitter || e.nativeEvent.submitter.type !== 'submit') {
                  e.preventDefault();
                  return;
                }
                handleSubmit(e);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && step < 4) {
                  e.preventDefault();
                }
              }}
              className="p-8"
            >
              {/* Paso 1: Información básica */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className={formTitleClass}>
                    <FaStar className="text-indigo-500 mr-2" /> Informazioni di Base
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}>
                        Nome <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Il tuo nome"
                        className={inputClasses}
                        maxLength={50}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="La tua email"
                        className={inputClasses}
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>
                        Telefono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Il tuo numero di telefono"
                        className={inputClasses}
                        maxLength={20}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>
                        Azienda
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="La tua azienda"
                        className={inputClasses}
                        maxLength={100}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 2: Tipo de proyecto */}
              {step === 2 && (
                <div className="space-y-8">
                  <h2 className={formTitleClass}>
                    <FaStar className="text-indigo-500 mr-2" /> Tipo di Progetto
                  </h2>
                  
                  {/* Tipo de proyecto */}
                  <div>
                    <label className={labelClasses + " mb-4"}>
                      Tipo di Progetto <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {projectTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, projectType: type.id }))}
                          className={`${buttonClasses} ${
                            formData.projectType === type.id
                              ? 'border-indigo-500 bg-indigo-50 shadow-md'
                              : 'border-gray-300 hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${formData.projectType === type.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-700'}`}>
                              <type.icon className="w-6 h-6" />
                            </div>
                            <span className={`block text-sm font-medium ${formData.projectType === type.id ? 'text-indigo-700' : 'text-gray-900'}`}>
                              {type.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Presupuesto */}
                  <div>
                    <label className={labelClasses + " mb-4"}>
                      Budget <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      {budgets.map((budget) => (
                        <label
                          key={budget.id}
                          className={`${featureBoxClasses} ${
                            formData.budget === budget.id
                              ? 'border-indigo-500 bg-indigo-50 shadow-md'
                              : 'border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="budget"
                            value={budget.id}
                            checked={formData.budget === budget.id}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className={`ml-3 ${formData.budget === budget.id ? 'text-indigo-700' : textClasses}`}>{budget.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className={labelClasses + " mb-4"}>
                      Tempistica <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      {timelines.map((timeline) => (
                        <label
                          key={timeline.id}
                          className={`${featureBoxClasses} ${
                            formData.timeline === timeline.id
                              ? 'border-indigo-500 bg-indigo-50 shadow-md'
                              : 'border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="timeline"
                            value={timeline.id}
                            checked={formData.timeline === timeline.id}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className={`ml-3 ${formData.timeline === timeline.id ? 'text-indigo-700' : textClasses}`}>{timeline.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 3: Detalles específicos */}
              {step === 3 && (
                <div className="space-y-8">
                  <h2 className={formTitleClass}>
                    <FaStar className="text-indigo-500 mr-2" /> Funzionalità Richieste
                  </h2>

                  {/* Features */}
                  <div>
                    <label className={labelClasses + " mb-4"}>
                      Seleziona le funzionalità necessarie <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {features.map((feature) => (
                        <label
                          key={feature}
                          className={`${featureBoxClasses} ${
                            formData.features.includes(feature)
                              ? 'border-indigo-500 bg-indigo-50 shadow-md'
                              : 'border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.features.includes(feature)}
                            onChange={() => handleFeatureToggle(feature)}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className={`ml-3 ${formData.features.includes(feature) ? 'text-indigo-700' : textClasses}`}>
                            {featureLabels[feature] || feature}
                          </span>
                        </label>
                      ))}
                    </div>
                    {formData.features.length === 0 && (
                      <p className="text-red-500 text-sm mt-2">Seleziona almeno una funzionalità per procedere</p>
                    )}
                  </div>

                  {/* Opciones adicionales */}
                  <div className="space-y-4 mt-8">
                    <h3 className="text-lg font-medium text-indigo-900 mb-4">Opzioni aggiuntive</h3>
                    <label className={`${featureBoxClasses} ${formData.responsive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}>
                      <input
                        type="checkbox"
                        name="responsive"
                        checked={formData.responsive}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className={`ml-3 ${formData.responsive ? 'text-indigo-700' : textClasses}`}>Design Responsive</span>
                    </label>
                    <label className={`${featureBoxClasses} ${formData.seo ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}>
                      <input
                        type="checkbox"
                        name="seo"
                        checked={formData.seo}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className={`ml-3 ${formData.seo ? 'text-indigo-700' : textClasses}`}>Ottimizzazione SEO</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Paso 4: Información adicional */}
              {step === 4 && (
                <div className="space-y-8">
                  <h2 className={formTitleClass}>
                    <FaStar className="text-indigo-500 mr-2" /> Informazioni Aggiuntive
                  </h2>

                  {/* Mensaje */}
                  <div>
                    <label className={labelClasses}>
                      Messaggio
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      className={inputClasses}
                      placeholder="Descrivi il tuo progetto in dettaglio..."
                      maxLength={1000}
                    />
                  </div>

                  {/* Referencia */}
                  <div>
                    <label className={labelClasses}>
                      Sito di Riferimento
                    </label>
                    <input
                      type="url"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="https://..."
                      maxLength={255}
                    />
                  </div>

                  {/* Cómo nos encontró */}
                  <div>
                    <label className={labelClasses}>
                      Come ci hai trovato?
                    </label>
                    <select
                      name="howFound"
                      value={formData.howFound}
                      onChange={handleInputChange}
                      className={inputClasses}
                    >
                      <option value="">Seleziona...</option>
                      <option value="google">Google</option>
                      <option value="social">Social Media</option>
                      <option value="referral">Referral</option>
                      <option value="other">Altro</option>
                    </select>
                  </div>

                  {/* Resumen de datos */}
                  <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-black">
                    <h3 className="text-lg font-medium text-indigo-900 mb-4">Riepilogo della richiesta</h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span className="font-medium">Nome:</span> 
                        <span>{formData.name}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium">Email:</span> 
                        <span>{formData.email}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium">Tipo di progetto:</span>
                        <span>{projectTypes.find(t => t.id === formData.projectType)?.label || formData.projectType}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium">Budget:</span>
                        <span>{budgets.find(b => b.id === formData.budget)?.label || formData.budget}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium">Tempistica:</span>
                        <span>{timelines.find(t => t.id === formData.timeline)?.label || formData.timeline}</span>
                      </p>
                      {formData.features.length > 0 && (
                        <div>
                          <span className="font-medium">Funzionalità:</span>
                          <ul className="list-disc list-inside mt-1 ml-2">
                            {formData.features.map(feature => (
                              <li key={feature}>{featureLabels[feature] || feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-10 flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className={secondaryButtonClasses}
                  >
                    <FaArrowLeft className="mr-2" />
                    Indietro
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className={`ml-auto ${primaryButtonClasses}`}
                  >
                    Avanti
                    <FaArrowRight className="ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    name="submitButton"
                    disabled={submitting}
                    className={`ml-auto ${primaryButtonClasses} ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {submitting ? 'Invio in corso...' : 'Invia Richiesta'}
                    {!submitting && <FaArrowRight className="ml-2" />}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  )
} 