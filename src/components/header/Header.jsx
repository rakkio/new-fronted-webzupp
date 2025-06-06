import React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FaBars, FaTimes, FaUser, FaCog, FaSignOutAlt, FaChevronDown, FaUserShield } from 'react-icons/fa'
import { useUser } from '../../../context/UserContext'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useUser()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [userAuth, setUserAuth] = useState(false)
  const [adminRole, setAdminRole] = useState(false)

  // Actualizar estado de autenticación
  useEffect(() => {
    const checkAuth = () => {
      // Ahora isAuthenticated es una propiedad booleana
      setUserAuth(isAuthenticated);
      
      // Verificar si el usuario es admin basándose en el rol
      setAdminRole(user?.role === 'admin');
      
      
    };
    
    // Verificar inmediatamente
    checkAuth();
  }, [user, isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  }

  const services = [
    {
      label: 'Sviluppo Web',
      href: '/services/web-development'
    },
    {
      label: 'E-commerce',
      href: '/services/ecommerce'
    },
    {
      label: 'CMS & Blog',
      href: '/services/cms'
    },
    {
      label: 'App Mobile',
      href: '/services/mobile-apps'
    },
    {
      label: 'SEO & Marketing',
      href: '/services/seo-marketing'
    },
    {
      label: 'Sicurezza & Manutenzione',
      href: '/services/maintenance'
    }
  ]

  const navItems = [ 
    {
      label: 'Home',
      href: '/'
    },
    {
      label: 'Blog',
      href: '/blog'
    },
    {
      label: 'Contatti',
      href: '/contact'
    }
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/70 backdrop-blur-md shadow-lg' 
        : 'bg-white/40 backdrop-blur-sm'
    }`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16 md:h-20'>
          <div className='flex items-center'>
            <Link href='/' className='text-indigo-600 text-2xl font-bold transition-colors hover:text-indigo-800'>
              <h1 className='text-2xl font-bold'>
                Web <span className='text-pink-500'>ZUPP</span>
              </h1>
        </Link>
          </div>
          
          <div className='hidden md:flex md:items-center md:space-x-6'>
            {navItems.map((item, index) => item.label && (
              <Link 
                key={index} 
                href={item.href} 
                className='text-gray-700 font-medium hover:text-indigo-600 transition-colors px-3 py-2 rounded-md hover:bg-indigo-50/50'
              >
                {item.label}
              </Link>
            ))}

            {/* Servizi Dropdown */}
            <div className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="flex items-center text-gray-700 font-medium hover:text-indigo-600 transition-colors px-3 py-2 rounded-md hover:bg-indigo-50/50"
              >
                Servizi
                <FaChevronDown className={`ml-2 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesOpen && (
                <div className="absolute right-0 mt-5 w-56 origin-top-right rounded-xl blur-card divide-y divide-gray-100 bg-white/50 backdrop-blur-md shadow-xl">
                  <div className="py-1">
                    {services.map((service, index) => (
                      <Link
                        key={index}
                        href={service.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        onClick={() => setServicesOpen(false)}
                      >
                        {service.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preventivo Button */}
            <Link 
              href="/preventivo" 
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
            >
              Richiedi Preventivo
            </Link>
            
            {userAuth ? (
              <div className='relative ml-4 pl-4 border-l border-gray-200'>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className='flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors focus:outline-none'
                >
                  <div className='w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600'>
                    {user?.name?.charAt(0) || <FaUser />}
                  </div>
                  <span className='font-medium'>{user?.name || 'Usuario'}</span>
                </button>

                {dropdownOpen && (
                  <div className='absolute right-0 mt-2 w-48 origin-top-right rounded-xl blur-card divide-y divide-gray-100 bg-white/50 backdrop-blur-md shadow-xl'>
                    <div className='px-4 py-3'>
                      <p className='text-sm text-gray-500'>Connesso come</p>
                      <p className='text-sm font-medium text-gray-900 truncate'>{user?.email}</p>
                      <p className='text-xs text-gray-500 mt-1'>Rol: {user?.role || 'usuario'}</p>
                    </div>
                    <div className='py-1'>
                      {adminRole && (
                        <Link
                          href='/admin/dashboard'
                          className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FaUserShield className='mr-2' /> Dashboard
                        </Link>
                      )}
                      <Link
                        href='/profile'
                        className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaCog className='mr-2' /> Impostazioni
                      </Link>
                    </div>
                    <div className='py-1'>
                      <button
                        onClick={handleLogout}
                        className='flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600'
                      >
                        <FaSignOutAlt className='mr-2' /> Esci
                      </button>
                    </div>
                  </div>
                )}
            </div>
          ) : (
              <div className='flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200'>
                <Link 
                  href='/auth/login' 
                  className='text-gray-700 font-medium hover:text-indigo-600 transition-colors'
                >
                  Sign in
                </Link>
                <Link 
                  href='/auth/register' 
                  className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md'
                >
                  Sign up
              </Link>
            </div>
          )}
          </div>
          
          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none'
            >
              <span className='sr-only'>Open main menu</span>
              {isOpen ? (
                <FaTimes className='block h-6 w-6' />
              ) : (
                <FaBars className='block h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className='blur-card px-2 pt-2 pb-3 space-y-1 sm:px-3'>
          {navItems.map((item, index) => item.label && (
            <Link 
              key={index}
              href={item.href}
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-between"
            >
              <span>Servizi</span>
              <FaChevronDown className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>

            {servicesOpen && (
              <div className="mt-2 pl-4 border-l-2 border-indigo-100 space-y-1">
                {services.map((service, index) => (
                  <Link
                    key={index}
                    href={service.href}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                    onClick={() => { setServicesOpen(false); setIsOpen(false); }}
                  >
                    {service.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link 
            href="/preventivo"
            className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => setIsOpen(false)}
          >
            Richiedi Preventivo
          </Link>

          {userAuth ? (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <div className='w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600'>
                    {user?.name?.charAt(0) || <FaUser />}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name || 'Usuario'}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {adminRole && (
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUserShield className="mr-2" /> Dashboard
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  onClick={() => setIsOpen(false)}
                >
                  <FaCog className="mr-2" /> Impostazioni
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt className="mr-2" /> Esci
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-200 pt-4 pb-3 space-y-1">
              <Link
                href="/auth/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                onClick={() => setIsOpen(false)}
              >
                Inizia Sessione
              </Link>
              <Link
                href="/auth/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                onClick={() => setIsOpen(false)}
              >
                Registrati
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
