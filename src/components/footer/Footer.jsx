import React from 'react'
import Link from 'next/link'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  // Enlaces principales
  const mainLinks = [
    { label: 'Home', href: '/' },
    { label: 'Servizi', href: '/services' },
    { label: 'Contatti', href: '/contact' }
  ]

  // Enlaces de servicios
  const serviceLinks = [
    { label: 'Web Design', href: '/services/web-development' },
    { label: 'E-commerce', href: '/services/ecommerce' },
    { label: 'Marketing Digitale', href: '/services/seo-marketing' }
  ]

  // Enlaces de recursos
  const resourceLinks = [
    { label: 'Blog', href: '/blog' },
    { label: 'Tutorial', href: '/tutorials' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Supporto', href: '/support' }
  ]

  // Redes sociales
  const socialLinks = [
    { icon: <FaFacebook className="w-5 h-5" />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <FaTwitter className="w-5 h-5" />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <FaInstagram className="w-5 h-5" />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <FaLinkedin className="w-5 h-5" />, href: 'https://linkedin.com', label: 'LinkedIn' }
  ]

  return (
    <footer className="bg-white/40 backdrop-blur-sm border-t border-gray-100 pt-12 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Acerca de */}
          <div>
            <div className="mb-4">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                Web<span className="text-pink-500">ZUPP</span>
              </Link>
            </div>
            <p className="text-gray-600 mb-4">
              Creiamo soluzioni digitali che portano il tuo business al livello successivo, con design moderno e tecnologia avanzata.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-indigo-600 transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Enlaces principales */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4 text-lg">Link</h3>
            <ul className="space-y-2">
              {mainLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            
            </ul>
          </div>

          {/* Columna 3: Servicios */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4 text-lg">Servizi</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4 text-lg">Contatti</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-600">
                  Via Ticino, Romentino (NO)
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-indigo-600 mr-3 flex-shrink-0" />
                <a href="tel:+123456789" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  +39 351 555 2988
                </a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-indigo-600 mr-3 flex-shrink-0" />
                <a href="mailto:contacto@webzupp.com" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  info@webzupp.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Sección inferior */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm mb-4 md:mb-0">
            © {currentYear} WebZUPP. Tutti i diritti riservati.
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">
              Termini di Servizio
            </Link>
            <Link href="/cookies" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">
              Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
