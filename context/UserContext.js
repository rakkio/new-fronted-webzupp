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
      
      // Advertir si el formato no parece un JWT estándar
      if (!(typeof token === 'string' && token.includes('.') && token.split('.').length === 3)) {
        // Token no tiene formato JWT estándar
      }
    } catch (e) {
      // Error al guardar token
    }
  } else {
    localStorage.removeItem('token');
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

        // Verificar formato del token
        const isValidTokenFormat = token.includes('.') && token.split('.').length === 3;
        
        // Si el token no tiene formato válido y estamos en desarrollo, crear uno temporal
        if (!isValidTokenFormat && storedUser && process.env.NODE_ENV === 'development') {
          try {
            // Crear token JWT en formato correcto para entorno de desarrollo
            const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
            const payload = btoa(JSON.stringify({
              userId: storedUser._id,
              email: storedUser.email,
              role: storedUser.role || 'user',
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 horas
            }));
            const signature = btoa('development-signature-placeholder');
            
            // Crear token en formato JWT válido
            token = `${header}.${payload}.${signature}`;
            
            // Guardar el nuevo token
            localStorage.setItem('token', token);
            localStorage.setItem('token_backup', token);
            localStorage.setItem('token_length', String(token.length));
            
            // Ahora el token debería ser válido
            setUser(storedUser);
            setLoading(false);
            
            // En desarrollo, permitimos continuar sin verificar con el backend
            return;
          } catch (tokenError) {
            // Si hay error al crear token, continuar con flujo normal
          }
        }
        
        // Verificar con el servidor solo si el token parece válido
        if (isValidTokenFormat) {
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
        } else {
          // Token con formato inválido
          if (process.env.NODE_ENV !== 'development') {
            logout();
          }
        }
      } catch (error) {
        // Error general
      } finally {
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
      
      // Verificar si localStorage está disponible
      if (!isLocalStorageAvailable()) {
        setError('Tu navegador no permite almacenar la sesión. Habilita cookies y localStorage.');
        return { 
          success: false, 
          message: 'Tu navegador no permite almacenar la sesión. Habilita cookies y localStorage.' 
        };
      }
      
      // Limpiar cualquier token anterior para evitar conflictos
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('token_backup');
        localStorage.removeItem('token_length');
      } catch (clearError) {
        // Error al limpiar tokens anteriores
      }
      
      const response = await fetch(`${getApiUrl()}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (data.success) {
        // Guardar token primero para mantener coherencia
        try {
          // Asegurarse de que el token no es undefined o null
          if (!data.data.token) {
            setError('El servidor no devolvió un token válido');
            return {
              success: false,
              message: 'El servidor no devolvió un token válido'
            };
          }
          
          // Inicialmente, guardar el token recibido
          let token = data.data.token;
          
          // Verificar si el token tiene formato JWT válido
          const isValidTokenFormat = token.includes('.') && token.split('.').length === 3;
          
          // Si el token no tiene formato JWT válido, intentar recuperarlo o crear uno temporal
          if (!isValidTokenFormat) {
            // Si tenemos tokenId, intentar recuperar el token completo
            if (data.data.tokenId) {
              try {
                const tokenResponse = await fetch(`${getApiUrl()}/auth/token/${data.data.tokenId}`);
                
                if (tokenResponse.ok) {
                  const tokenData = await tokenResponse.json();
                  
                  if (tokenData.success && tokenData.data && tokenData.data.token) {
                    const recoveredToken = tokenData.data.token;
                    
                    // Si el token recuperado tiene formato JWT válido, usarlo
                    if (recoveredToken.includes('.') && recoveredToken.split('.').length === 3) {
                      token = recoveredToken;
                    } else if (process.env.NODE_ENV === 'development') {
                      // En desarrollo, crear un token temporal
                      token = createDevelopmentToken(data.data.user);
                    } else {
                      setError('No se pudo obtener un token con formato JWT válido');
                      return {
                        success: false,
                        message: 'No se pudo obtener un token con formato JWT válido'
                      };
                    }
                  }
                } else if (process.env.NODE_ENV === 'development') {
                  // En desarrollo, crear un token temporal
                  token = createDevelopmentToken(data.data.user);
                } else {
                  setError('No se pudo recuperar el token completo');
                  return {
                    success: false,
                    message: 'No se pudo recuperar el token completo'
                  };
                }
              } catch (tokenError) {
                if (process.env.NODE_ENV === 'development') {
                  // En desarrollo, crear un token temporal
                  token = createDevelopmentToken(data.data.user);
                } else {
                  setError('Error al recuperar token completo');
                  return {
                    success: false,
                    message: 'Error al recuperar token completo'
                  };
                }
              }
            } else if (process.env.NODE_ENV === 'development') {
              // En desarrollo, crear un token temporal si no hay tokenId
              token = createDevelopmentToken(data.data.user);
            } else {
              setError('Token con formato inválido');
              return {
                success: false,
                message: 'Token con formato inválido'
              };
            }
          }
          
          // Verificar que el token ahora tenga formato válido
          if (!(token.includes('.') && token.split('.').length === 3)) {
            setError('No se pudo obtener un token con formato JWT válido');
            return {
              success: false,
              message: 'No se pudo obtener un token con formato JWT válido'
            };
          }
          
          // Guardar el token en localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('token_backup', token);
          localStorage.setItem('token_length', String(token.length));
          
          // Verificar que se haya guardado
          const storedToken = localStorage.getItem('token');
          if (!storedToken) {
            setError('No se pudo guardar el token');
            return {
              success: false,
              message: 'No se pudo guardar el token'
            };
          }
          
          // Actualizar estado del usuario
          updateUserState(data.data.user);
          
          return { 
            success: true,
            data: {
              token: token,
              user: data.data.user
            }
          };
        } catch (storageError) {
          setError('Error al guardar la sesión. Comprueba que tu navegador permita cookies.');
          return {
            success: false,
            message: 'Error al guardar la sesión. Comprueba que tu navegador permite cookies.'
          };
        }
      } else {
        setError(data.message || 'Error al iniciar sesión');
        return { success: false, message: data.message };
      }
    } catch (error) {
      setError('Error de conexión al servidor');
      return { success: false, message: 'Error de conexión al servidor' };
    } finally {
      setLoading(false);
    }
  };
  
  // Función auxiliar para crear tokens de desarrollo
  const createDevelopmentToken = (user) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId: user._id,
      email: user.email,
      role: user.role || 'user',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 horas
    }));
    const signature = btoa('development-signature-placeholder');
    return `${header}.${payload}.${signature}`;
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
          
          // Verificar el formato del token
          let token = data.data.token;
          const isValidTokenFormat = token.includes('.') && token.split('.').length === 3;
          
          // Si el token no tiene formato válido y estamos en desarrollo, crear uno temporal
          if (!isValidTokenFormat && process.env.NODE_ENV === 'development') {
            token = createDevelopmentToken(data.data.user);
          } else if (!isValidTokenFormat) {
            setError('Token con formato inválido durante el registro');
            return {
              success: false,
              message: 'Token con formato inválido durante el registro'
            };
          }
          
          // Guardar el token
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
