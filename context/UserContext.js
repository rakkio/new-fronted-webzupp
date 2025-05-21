import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

const UserContext = createContext();

// Funciones auxiliares para manejar localStorage (fuera del componente para evitar renderizados innecesarios)
const isLocalStorageAvailable = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Intentar una operación de prueba con localStorage
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    // localStorage no está disponible
    return false;
  }
};

const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    // Error al recuperar datos de usuario
    return null;
  }
};

const storeUser = (userData) => {
  if (typeof window === 'undefined') return;
  
  try {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userData');
    }
  } catch (e) {
    // Error al almacenar datos de usuario
  }
};

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const storeToken = (token) => {
  if (typeof window === 'undefined') return;
  
  if (token) {
    try {
      localStorage.setItem('token', token);
      // Guardar una copia de respaldo para diagnóstico
      localStorage.setItem('token_backup', token);
      localStorage.setItem('token_length', String(token.length));
    } catch (e) {
      // Error al guardar token
      console.error('Error al guardar token en localStorage');
    }
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('token_backup');
    localStorage.removeItem('token_length');
  }
};

// Función para borrar todos los datos de la sesión (para recuperación de emergencia)
const clearAllSessionData = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Eliminar todos los datos relacionados con la sesión
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    
    // También eliminar cualquier otro dato de sesión que pudiera existir
    sessionStorage.clear();
    
    // Forzar recarga de la página para reiniciar completamente el estado
    window.location.href = '/auth/login';
  } catch (e) {
    // Error al limpiar datos de sesión
  }
};

export const UserProvider = ({ children }) => {
  const router = useRouter();
  // Inicializar estado solo si hay token
  const [user, setUser] = useState(getStoredToken() ? getStoredUser() : null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionError, setSessionError] = useState(false);
  
  // Obtener la base URL de la API
  const getApiUrl = () => {
    if (typeof window !== 'undefined') {
      return window.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  };

  // Función para actualizar el estado del usuario persistiendo en localStorage
  const updateUserState = (userData) => {
    // Si hay usuario pero no hay token, esto es un estado inválido
    if (userData && !getStoredToken()) {
      console.error('INCONSISTENCIA CRÍTICA: Intentando establecer usuario sin token.');
      clearAllSessionData();
      return;
    }
    
    setUser(userData);
    storeUser(userData);
  };

  // Efecto para sincronizar los datos del usuario
  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();
    
    // Si hay inconsistencia entre token y usuario, corregir
    if ((!token && storedUser) || (token && !storedUser)) {
      console.error('Inconsistencia entre token y datos de usuario. Restableciendo sesión.');
      clearAllSessionData();
    }
    
    // Si hay token pero no hay usuario en estado, cargar el usuario desde localStorage
    if (token && !user) {
      updateUserState(storedUser);
    }
  }, [user]);

  // Efectos para comprobar el estado de autenticación al cargar
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        setLoading(true);
        setSessionError(false);
        
        // Verificar primero si localStorage está disponible
        if (!isLocalStorageAvailable()) {
          setError('Tu navegador no permite almacenar la sesión. Habilita cookies y localStorage.');
          setSessionError(true);
          setLoading(false);
          return;
        }
        
        // Obtener token almacenado directamente de localStorage
        let token;
        try {
          token = localStorage.getItem('token');
        } catch (e) {
          token = null;
        }
        
        // Obtener usuario almacenado
        const storedUser = getStoredUser();
        
        // Si no hay token pero hay estado de usuario, es inconsistente
        if (!token && user) {
          setUser(null);
          storeUser(null);
          setLoading(false);
          return;
        }
        
        // Si hay usuario almacenado, usarlo inicialmente
        if (storedUser && token) {
          setUser(storedUser);
        }
        
        // Si no hay token, no podemos verificar con el backend
        if (!token) {
          setLoading(false);
          return;
        }

        // Verificar con el servidor sin validar formato del token
        try {
          const response = await fetch(`${getApiUrl()}/auth/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            updateUserState(data.user || data.data);
          } else {
            // En producción debería cerrar sesión, en desarrollo podemos mantener para debugging
            if (process.env.NODE_ENV === 'development') {
              // Mantener sesión a pesar del error
            } else {
              logout();
            }
          }
        } catch (error) {
          // Error al verificar con backend - en desarrollo mantenemos sesión
          if (process.env.NODE_ENV !== 'development') {
            logout();
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setLoading(false);
      }
    };

    // Verificar estado de autenticación al cargar la página
    checkUserLoggedIn();
    
    // Agregar listener para reconexiones
    const handleOnline = () => {
      checkUserLoggedIn();
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = getApiUrl();
      
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (data.success) {
        try {
          let token = data.data?.token;
          
          // Si tenemos un tokenId en lugar de un token directo, intentar recuperarlo
          if (!token && data.data?.tokenId) {
            try {
              const tokenResponse = await fetch(`${apiUrl}/auth/token/${data.data.tokenId}`);
              const tokenData = await tokenResponse.json();
              
              if (tokenData.success && tokenData.data?.token) {
                token = tokenData.data.token;
              } else {
                throw new Error('No se pudo recuperar el token');
              }
            } catch (tokenError) {
              console.error('Error al recuperar token:', tokenError);
              setError('Error al recuperar el token de autenticación');
              return { success: false, message: 'Error al recuperar el token de autenticación' };
            }
          }
          
          // Verificar que exista un token
          if (!token) {
            setError('El servidor no devolvió un token válido');
            return { success: false, message: 'Token no recibido' };
          }
          
          // Guardar el token sin validar formato estrictamente
          localStorage.setItem('token', token);
          localStorage.setItem('token_backup', token);
          localStorage.setItem('token_length', String(token.length));
          
          // Verificar que el token se haya guardado
          const storedToken = localStorage.getItem('token');
          if (!storedToken) {
            setError('No se pudo guardar el token');
            return { success: false, message: 'No se pudo guardar el token' };
          }
          
          // Actualizar el estado del usuario
          updateUserState(data.data.user);
          
          return { success: true };
        } catch (storageError) {
          setError('Error al guardar la sesión. Comprueba que tu navegador permita cookies.');
          return {
            success: false,
            message: 'Error al guardar la sesión. Comprueba que tu navegador permita cookies.'
          };
        }
      } else {
        const errorMessage = data.message || 'Error al iniciar sesión';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      setError('Error de conexión al servidor');
      return { success: false, message: 'Error de conexión al servidor' };
    } finally {
      setLoading(false);
    }
  };
  
  // Función para registrarse
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = getApiUrl();
      
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        try {
          // Verificar que exista un token
          if (!data.data.token) {
            setError('El servidor no devolvió un token válido durante el registro');
            return {
              success: false,
              message: 'Token no recibido durante el registro'
            };
          }
          
          // Obtener el token, sin validación estricta de formato
          let token = data.data.token;
          
          // Guardar el token sin validar formato estrictamente
          localStorage.setItem('token', token);
          localStorage.setItem('token_backup', token);
          localStorage.setItem('token_length', String(token.length));
          
          // Verificar que el token se haya guardado
          const storedToken = localStorage.getItem('token');
          if (!storedToken) {
            setError('No se pudo guardar el token durante el registro');
            return {
              success: false,
              message: 'No se pudo guardar el token durante el registro'
            };
          }
          
          updateUserState(data.data.user);
          return { success: true };
        } catch (storageError) {
          setError('Error al guardar la sesión. Comprueba que tu navegador permita cookies.');
          return {
            success: false,
            message: 'Error al guardar la sesión. Comprueba que tu navegador permita cookies.'
          };
        }
      } else {
        setError(data.message || 'Error al registrarse');
        return { success: false, message: data.message };
      }
    } catch (error) {
      setError('Error de conexión al servidor');
      return { success: false, message: 'Error de conexión al servidor' };
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    storeToken(null);
    updateUserState(null);
    router.push('/auth/login'); // Corregir la ruta de login
  };
  
  // Función para verificar si el usuario es administrador
  const isAdmin = () => {
    return !!user && user.role === 'admin';
  };
  
  // Función para actualizar el perfil del usuario
  const updateProfile = (updatedData) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    updateUserState(updatedUser);
  };

  // Función para verificar email
  const verifyEmail = async (token, userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${getApiUrl()}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, userId })
      });

      const data = await response.json();
      
      if (data.success) {
        // Si el usuario está conectado, actualizar el estado
        if (user && user._id === userId) {
          const updatedUser = {
            ...user,
            emailVerified: true
          };
          updateUserState(updatedUser);
        }
      }
      
      return data;
    } catch (error) {
      return { 
        success: false, 
        message: 'Error de conexión al verificar email' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Función para reenviar email de verificación
  const resendVerificationEmail = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${getApiUrl()}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return { 
        success: false, 
        message: 'Error de conexión al reenviar verificación' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Comprobar si el email está verificado
  const isEmailVerified = () => {
    return user && user.emailVerified === true;
  };

  return (
    <UserContext.Provider value={{
      user, 
      loading,
      error,
      isAuthenticated: !!user,
      isEmailVerified,
      isAdmin,
      login,
      register,
      logout,
      verifyEmail,
      resendVerificationEmail,
      updateProfile,
      clearAllSessionData,
      sessionError
    }}>
      {children}
      {sessionError && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50">
          <p className="font-bold">Error de sesión detectado</p>
          <p className="text-sm mb-2">Se ha detectado un problema con tu sesión.</p>
          <button 
            onClick={clearAllSessionData}
            className="bg-white text-red-600 px-4 py-2 rounded font-bold text-sm hover:bg-gray-100"
          >
            Reiniciar sesión
          </button>
        </div>
      )}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useUser = () => useContext(UserContext);

export default UserContext;
