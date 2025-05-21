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
  
  try {
    // Intentar obtener el token de diferentes fuentes para mayor resiliencia
    const directToken = localStorage.getItem('token');
    const backupToken = localStorage.getItem('token_backup');
    const userData = getStoredUser();
    
    // Registrar información de diagnóstico
    if (directToken) {
      console.log(`Token directo encontrado (longitud: ${directToken.length})`);
    }
    if (backupToken && backupToken !== directToken) {
      console.log(`Token de respaldo encontrado (longitud: ${backupToken.length})`);
    }
    
    // 1. Priorizar el token directo si existe y parece válido
    if (directToken && directToken.split('.').length === 3) {
      return directToken;
    }
    
    // 2. Intentar usar el token de respaldo
    if (backupToken && backupToken.split('.').length === 3) {
      console.log('Usando token de respaldo que parece tener formato válido');
      // Restaurar el token principal desde el respaldo
      localStorage.setItem('token', backupToken);
      return backupToken;
    }
    
    // 3. Intentar extraer token del objeto usuario
    if (userData && userData.token) {
      console.log('Usando token extraído del objeto usuario');
      localStorage.setItem('token', userData.token);
      return userData.token;
    }
    
    // 4. Devolver el token directo aunque sea inválido como último recurso
    return directToken;
  } catch (e) {
    console.error('Error al obtener token:', e);
    return null;
  }
};

const storeToken = (token) => {
  if (typeof window === 'undefined') return;
  
  if (token) {
    try {
      // Registrar información del token pero no validar su formato
      if (typeof token === 'string') {
        console.log(`Guardando token: ${token.substring(0, 15)}... (longitud: ${token.length})`);
      }
      
      localStorage.setItem('token', token);
      // Guardar una copia de respaldo para diagnóstico
      localStorage.setItem('token_backup', token);
      localStorage.setItem('token_length', String(token.length));
    } catch (e) {
      // Error al guardar token
      console.error('Error al guardar token en localStorage', e);
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
          if (token) {
            console.log(`Token encontrado en localStorage: ${token.substring(0, 15)}... (longitud: ${token.length})`);
          }
        } catch (e) {
          console.error('Error al obtener token de localStorage:', e);
          token = null;
        }
        
        // Obtener usuario almacenado
        const storedUser = getStoredUser();
        if (storedUser) {
          console.log('Usuario encontrado en localStorage:', {
            id: storedUser._id,
            email: storedUser.email,
            role: storedUser.role || 'no definido'
          });
        }
        
        // Si no hay token pero hay estado de usuario, MANTENER EL USUARIO
        // Esto es crucial para evitar pérdida de estado en administración
        if (!token && user) {
          console.warn('Estado inconsistente: Usuario sin token pero manteniendo sesión para evitar pérdidas');
          // NO limpiamos el usuario aquí para evitar problemas con el panel admin
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

        // Verificar con el servidor (solo en modo producción)
        // En desarrollo, confiamos completamente en el estado local
        if (process.env.NODE_ENV === 'production') {
          try {
            console.log('Verificando token con el servidor...');
            const response = await fetch(`${getApiUrl()}/auth/profile`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              console.log('Verificación exitosa, token válido');
              const data = await response.json();
              updateUserState(data.user || data.data);
            } else {
              console.error('Error en verificación con el servidor, pero manteniendo sesión local');
              console.log('Error detalle:', await response.text());
              // Mantener sesión a pesar del error para evitar pérdidas de estado
            }
          } catch (error) {
            console.error('Error al comunicar con el servidor, pero manteniendo sesión local:', error);
            // Mantenemos la sesión para evitar problemas
          }
        } else {
          console.log('Modo desarrollo: usando solo estado local sin verificar con backend');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setLoading(false);
      }
    };

    // Verificar estado de autenticación al cargar la página
    checkUserLoggedIn();
    
    // Evitar verificaciones innecesarias que podrían causar pérdida de estado
    // Solo verificar al cambiar de offline a online
    const handleOnline = () => {
      // Solo verificar si hay un cambio real en la conexión
      if (navigator.onLine) {
        console.log('Conexión recuperada, verificando estado del usuario');
        checkUserLoggedIn();
      }
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
      
      // Usar fetch directamente en lugar de axios para poder manejar las cabeceras
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      // Almacenar cabeceras importantes independientemente del resultado
      const userId = response.headers.get('X-User-ID');
      const userEmail = response.headers.get('X-User-Email');
      const userRole = response.headers.get('X-User-Role');
      const fullToken = response.headers.get('X-Auth-Token');
      
      // Registrar información de diagnóstico
      if (userId) console.log('Recibido ID de usuario en cabecera:', userId);
      if (userEmail) console.log('Recibido Email en cabecera:', userEmail);
      if (userRole) console.log('Recibido Role en cabecera:', userRole);
      if (fullToken) console.log('Recibido token completo en cabecera (longitud):', fullToken.length);
      
      // Almacenar estas cabeceras para identificación adicional
      if (userId) localStorage.setItem('user_id', userId);
      if (userEmail) localStorage.setItem('user_email', userEmail);
      if (userRole) localStorage.setItem('user_role', userRole);
      
      // Si recibimos el token completo en cabecera, usarlo directamente
      if (fullToken && fullToken.split('.').length === 3) {
        console.log('Usando token completo de cabecera, más confiable');
        localStorage.setItem('token', fullToken);
        localStorage.setItem('token_backup', fullToken);
        localStorage.setItem('token_length', String(fullToken.length));
      }
      
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
          
          // Verificar que exista un token, pero dar preferencia al token completo de la cabecera
          if (!token && !fullToken) {
            setError('El servidor no devolvió un token válido');
            return { success: false, message: 'Token no recibido' };
          }
          
          // Usar el token completo de cabecera con preferencia
          const bestToken = fullToken || token;
          
          // Para depuración: mostrar detalles del token
          console.log(`Token recibido: ${bestToken.substring(0, 20)}... (longitud: ${bestToken.length})`);
          
          // Guardar el token de manera redundante para mayor resiliencia
          localStorage.setItem('token', bestToken);
          localStorage.setItem('token_backup', bestToken);
          localStorage.setItem('token_length', String(bestToken.length));
          
          // También guardar el token en el objeto de usuario para respaldo
          const userData = data.data.user;
          if (userData) {
            userData.token = bestToken;
            localStorage.setItem('userData', JSON.stringify(userData));
          }
          
          // Verificar que el token se haya guardado
          const storedToken = localStorage.getItem('token');
          if (!storedToken) {
            setError('No se pudo guardar el token');
            return { success: false, message: 'No se pudo guardar el token' };
          }
          
          // Actualizar el estado del usuario
          updateUserState(userData);
          
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
          
          // Obtener el token
          let token = data.data.token;
          
          // Para depuración: mostrar detalles del token
          console.log(`Token recibido en registro: ${token.substring(0, 20)}... (longitud: ${token.length})`);
          
          // Guardar el token incluso si el formato no es 100% válido
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
    // Verificación robusta que no depende solo del estado actual
    // 1. Primero verificar en memoria (más rápido)
    if (user && user.role === 'admin') {
      return true;
    }
    
    // 2. Verificación desde localStorage como respaldo
    try {
      const storedUser = getStoredUser();
      if (storedUser && storedUser.role === 'admin') {
        return true;
      }
      
      // 3. Último intento en caso de que userData esté en otro formato
      const legacyUser = localStorage.getItem('user');
      if (legacyUser) {
        try {
          const parsedLegacyUser = JSON.parse(legacyUser);
          if (parsedLegacyUser && parsedLegacyUser.role === 'admin') {
            return true;
          }
        } catch (e) {
          console.error('Error al analizar datos de usuario legacy', e);
        }
      }
    } catch (e) {
      console.error('Error al verificar rol admin desde localStorage', e);
    }
    
    return false;
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
