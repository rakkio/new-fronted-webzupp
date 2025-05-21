import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGlobe, FaExclamationCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { sendContactMessage } from '@/utils/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error al modificar un campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e) => {
    setPrivacyConsent(e.target.checked);
    if (!e.target.checked && errors.privacy) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.privacy;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'Il nome è obbligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Il nome deve contenere almeno 2 caratteri';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Il nome non può superare i 50 caratteri';
    }
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è obbligatoria';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Inserisci un indirizzo email valido';
    }
    
    // Validar asunto
    if (!formData.subject.trim()) {
      newErrors.subject = 'L\'oggetto è obbligatorio';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'L\'oggetto deve contenere almeno 3 caratteri';
    } else if (formData.subject.trim().length > 100) {
      newErrors.subject = 'L\'oggetto non può superare i 100 caratteri';
    }
    
    // Validar mensaje
    if (!formData.message.trim()) {
      newErrors.message = 'Il messaggio è obbligatorio';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Il messaggio deve contenere almeno 10 caratteri';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Il messaggio non può superare i 1000 caratteri';
    }
    
    // Validar consentimiento de privacidad
    if (!privacyConsent) {
      newErrors.privacy = 'È necessario accettare la Privacy Policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Validar el formulario
    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Enviar datos al backend usando nuestra función de utilidad
      const response = await sendContactMessage(formData);
      
      setSubmitStatus({
        success: true,
        message: response.message || 'Messaggio inviato con successo! Ti risponderemo al più presto.'
      });
      
      // Resetear el formulario después de enviar
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setPrivacyConsent(false);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      setSubmitStatus({
        success: false,
        message: error.response?.data?.message || 'Si è verificato un errore durante l\'invio del messaggio. Riprova più tardi.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Contatti | WebZUPP</title>
        <meta name="description" content="Contatta il team di WebZUPP per informazioni sui nostri servizi di sviluppo web e marketing digitale" />
      </Head>

      <div className="max-w-7xl mt-10 mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero section */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Contattaci
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Siamo qui per rispondere a tutte le tue domande. Compila il modulo sottostante o contattaci direttamente.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact info section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informazioni di contatto</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <FaGlobe className="text-indigo-600 text-xl mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">La nostra presenza</h3>
                  <p className="text-gray-700 mt-1">
                  Per discutere le tue esigenze relative alle pagine web, le consulenze avvengono telefonicamente o via email. Siamo qui per comprendere le tue problematiche e trovare insieme le soluzioni migliori.

                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaPhone className="text-indigo-600 text-xl mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Telefono</h3>
                  <p className="text-gray-700 mt-1">
                    <a href="tel:+39351555296" className="hover:text-indigo-600 transition-colors">
                      +39 351 555 2988
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaEnvelope className="text-indigo-600 text-xl mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-700 mt-1">
                    <a href="mailto:info@webzupp.com" className="hover:text-indigo-600 transition-colors">
                      info@webzupp.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Seguici sui social</h3>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-full text-blue-600 hover:bg-blue-50 transition-colors shadow-sm">
                  <FaFacebook size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-full text-blue-400 hover:bg-blue-50 transition-colors shadow-sm">
                  <FaTwitter size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-full text-pink-600 hover:bg-pink-50 transition-colors shadow-sm">
                  <FaInstagram size={20} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-full text-blue-700 hover:bg-blue-50 transition-colors shadow-sm">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
            
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Orari di disponibilità</h3>  
              <p className="text-gray-700">
              Siamo disponibili per chiamate dal lunedì al venerdì, dalle 9:00 alle 18:00. Per le richieste via email, ci impegniamo a rispondere entro 24 ore lavorative.
              </p>

            </div>
          </motion.div>

          {/* Contact form section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3 bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Inviaci un messaggio</h2>
            
            {submitStatus && (
              <div className={`p-4 rounded-lg mb-6 ${submitStatus.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {submitStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome completo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full text-black px-4 py-3 border ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-lg bg-white/80`}
                      placeholder="Il tuo nome"
                    />
                    {errors.name && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <FaExclamationCircle className="text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full text-black px-4 py-3 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-lg bg-white/80`}
                      placeholder="La tua email"
                    />
                    {errors.email && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <FaExclamationCircle className="text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Oggetto
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full text-black px-4 py-3 border ${errors.subject ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-lg bg-white/80`}
                    placeholder="Oggetto del messaggio"
                  />
                  {errors.subject && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaExclamationCircle className="text-red-500" />
                    </div>
                  )}
                </div>
                {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Messaggio
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className={`w-full text-black px-4 py-3 border ${errors.message ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-lg bg-white/80`}
                    placeholder="Scrivi il tuo messaggio qui..."
                  ></textarea>
                  {errors.message && (
                    <div className="absolute top-3 right-0 flex items-start pr-3 pointer-events-none">
                      <FaExclamationCircle className="text-red-500" />
                    </div>
                  )}
                </div>
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.message.length}/1000 caratteri
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="privacy-policy"
                    name="privacy-policy"
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={handleCheckboxChange}
                    className={`h-4 w-4 text-black ${errors.privacy ? 'text-red-600 border-red-300 focus:ring-red-500' : 'text-indigo-600 border-gray-300 focus:ring-indigo-500'} rounded`}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="privacy-policy" className={`text-sm ${errors.privacy ? 'text-red-700' : 'text-gray-700'}`}>
                    Acconsento al trattamento dei miei dati come indicato nella <a href="/privacy-policy" className="text-indigo-600 hover:text-indigo-800">Privacy Policy</a>
                  </label>
                  {errors.privacy && <p className="mt-1 text-sm text-red-600">{errors.privacy}</p>}
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
                >
                  {isSubmitting ? 'Invio in corso...' : 'Invia messaggio'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Remove map section and replace with more info about online operations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Come lavoriamo</h2>
          
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700 mb-6">
              WebZUPP opera completamente in modalità remota, permettendoci di servire clienti in tutta Italia e all'estero con la massima flessibilità.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <div className="bg-white/70 p-6 rounded-xl shadow-sm">
                <div className="bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <FaEnvelope className="text-indigo-600 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-black">Comunicazione</h3>
                <p className="text-gray-600">Utilizziamo strumenti di comunicazione moderni per garantire un dialogo costante e trasparente.</p>
              </div>
              
              <div className="bg-white/70 p-6 rounded-xl shadow-sm">
                <div className="bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-black">Incontri virtuali</h3>
                <p className="text-gray-600">Organizziamo videochiamate per discutere i progetti e mantenere un contatto personale.</p>
              </div>
              
              <div className="bg-white/70 p-6 rounded-xl shadow-sm">
                <div className="bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-black">Risultati</h3>
                <p className="text-gray-600">La nostra metodologia di lavoro remoto ci permette di offrire soluzioni efficienti e di alta qualità.</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* FAQ section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Domande frequenti</h2>
          
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quali servizi offrite?</h3>
              <p className="text-gray-700">
                Offriamo servizi di sviluppo web, app mobile, e-commerce, SEO, marketing digitale e grafica. Contattateci per maggiori dettagli sui nostri servizi.
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quanto tempo ci vuole per sviluppare un sito web?</h3>
              <p className="text-gray-700">
                I tempi di sviluppo variano in base alla complessità del progetto. Un sito web semplice può richiedere 2-3 settimane, mentre progetti più complessi possono richiedere 2-3 mesi.
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quali sono i costi per i vostri servizi?</h3>
              <p className="text-gray-700">
                I costi variano in base alle specifiche esigenze del cliente. Contattateci per ricevere un preventivo personalizzato gratuito e senza impegno.
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Offrite servizi di manutenzione dopo il lancio?</h3>
              <p className="text-gray-700">
                Sì, offriamo diversi pacchetti di manutenzione e supporto per garantire che il vostro sito rimanga sicuro, aggiornato e funzionante al meglio.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
} 