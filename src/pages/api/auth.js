// URL base del backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

/**
 * Función para iniciar sesión
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const authLogin = async (email, password) => {
  try {
    console.log('Enviando solicitud de login a:', `${API_URL}/auth/login`);
    
    // Configuración básica de la solicitud
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    };
    
    console.log('Opciones de la solicitud:', {
      url: `${API_URL}/auth/login`,
      method: requestOptions.method,
      headers: { ...requestOptions.headers },
    });
    
    const response = await fetch(`${API_URL}/auth/login`, requestOptions);
    
    console.log('Respuesta del servidor:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers]),
    });
    
    if (!response.ok) {
      console.error('Error de respuesta:', response.status, response.statusText);
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    console.log('Datos recibidos:', {
      success: data.success,
      message: data.message,
      userReceived: !!data.data?.user,
      tokenReceived: !!data.data?.token,
      tokenId: data.data?.tokenId
    });
    
    // Verificar token completo
    if (data?.data?.token) {
      const token = data.data.token;
      console.log('Token completo recibido:', {
        longitud: token.length,
        formatoValido: token.split('.').length === 3,
        primeros20: token.substring(0, 20),
        ultimos20: token.substring(token.length - 20),
        partes: token.split('.').length,
        longitudPartes: token.split('.').map(part => part.length)
      });
      
      // Guardar token sin truncar
      if (typeof window !== 'undefined') {
        try {
          // Limpiar cualquier token anterior
          localStorage.removeItem('token');
          // Guardar el token completo
          localStorage.setItem('token', token);
          // Guardar copia de backup
          localStorage.setItem('token_complete', token);
          localStorage.setItem('token_length', token.length.toString());
          
          // Verificar si se guardó correctamente
          const storedToken = localStorage.getItem('token');
          const backupToken = localStorage.getItem('token_complete');
          
          console.log('Verificación de token guardado:', {
            original: token.length,
            guardado: storedToken?.length,
            backup: backupToken?.length,
            tokenCompleto: token === storedToken && token === backupToken
          });
        } catch (err) {
          console.error('Error al guardar token en localStorage:', err);
        }
      }
      
      // Verificar que no haya caracteres extraños o espacios
      if (token.includes(' ')) {
        console.warn('⚠️ El token contiene espacios que pueden causar problemas');
      }
      
      if (!/^[A-Za-z0-9-_=+/]+\.[A-Za-z0-9-_=+/]+\.[A-Za-z0-9-_=+/]*$/.test(token)) {
        console.warn('⚠️ El token contiene caracteres inválidos o formato incorrecto');
      }
    } else {
      console.warn('No se encontró token en la respuesta o está incompleto');
    }
    
    return data;
  } catch (error) {
    console.error('Error en la autenticación:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor: ' + (error.message || 'Desconocido')
    };
  }
};

/**
 * Función para registrar un nuevo usuario
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @param {string} username - Nombre de usuario
 * @param {string} name - Nombre real del usuario
 * @param {string} lastname - Apellido del usuario
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const authRegister = async (email, password, username, name, lastname) => {
  try {
    console.log('Enviando solicitud de registro a:', `${API_URL}/auth/register`);
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        username,
        name,
        lastname,
      }),
    };
    
    const response = await fetch(`${API_URL}/auth/register`, requestOptions);
    
    console.log('Respuesta del servidor:', {
      status: response.status,
      statusText: response.statusText,
    });
    
    if (!response.ok) {
      console.error('Error de respuesta:', response.status, response.statusText);
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    console.log('Datos recibidos:', data);
    return data;
  } catch (error) {
    console.error('Error en el registro:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor: ' + (error.message || 'Desconocido')
    };
  }
};

/**
 * Función para obtener el perfil del usuario
 * @param {string} token - Token JWT del usuario
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const getProfile = async (token) => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return {
      success: false,
      message: 'Error al obtener información del perfil: ' + (error.message || 'Desconocido')
    };
  }
};

/**
 * Función para actualizar el perfil del usuario
 * @param {object} userData - Datos del usuario a actualizar
 * @param {string} token - Token JWT del usuario
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const updateProfile = async (userData, token) => {
  try {
    const response = await fetch(`${API_URL}/users/profile/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return {
      success: false,
      message: 'Error al actualizar información del perfil: ' + (error.message || 'Desconocido')
    };
  }
};

/**
 * Función para obtener un token completo usando su ID
 * @param {string} tokenId - ID del token a recuperar
 * @returns {Promise} - Promesa con el token recuperado o error
 */
export const getFullToken = async (tokenId) => {
  try {
    console.log(`Recuperando token completo con ID: ${tokenId}`);
    
    const response = await fetch(`${API_URL}/auth/token/${tokenId}`);
    
    if (!response.ok) {
      console.error('Error al recuperar token:', response.status, response.statusText);
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    
    if (data.success && data.data && data.data.token) {
      const token = data.data.token;
      
      console.log('Token completo recuperado:', {
        longitud: token.length,
        formatoJWT: token.split('.').length === 3,
        primeros20: token.substring(0, 20),
        ultimos20: token.substring(token.length - 20)
      });
      
      // Guardar el token recuperado automáticamente
      if (typeof window !== 'undefined') {
        try {
          // Limpiar posibles tokens anteriores
          localStorage.removeItem('token');
          
          // Guardar el token completo y verificarlo
          localStorage.setItem('token', token);
          
          // Guardar una copia de seguridad
          localStorage.setItem('token_backup_full', token);
          localStorage.setItem('token_length_full', String(token.length));
          
          // Verificar si se guardó correctamente
          const storedToken = localStorage.getItem('token');
          
          console.log('Verificación de token guardado:', {
            longitud: storedToken?.length,
            coincide: storedToken === token
          });
          
          if (!storedToken || storedToken !== token) {
            console.error('Error: El token no se guardó correctamente');
          }
        } catch (storageError) {
          console.error('Error al guardar token en localStorage:', storageError);
        }
      }
      
      return {
        success: true,
        data: {
          token
        }
      };
    } else {
      console.error('Formato de respuesta inválido o token no encontrado');
      return {
        success: false,
        message: 'Token no encontrado o formato de respuesta inválido'
      };
    }
  } catch (error) {
    console.error('Error al recuperar token completo:', error);
    return {
      success: false,
      message: 'Error al recuperar token: ' + (error.message || 'Desconocido')
    };
  }
};

/**
 * Función para solicitar restablecimiento de contraseña
 * @param {string} email - Correo electrónico del usuario
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const requestPasswordReset = async (email) => {
  try {
    console.log('Solicitando restablecimiento de contraseña para:', email);
    
    const response = await fetch(`${API_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      console.error('Error en la solicitud de restablecimiento:', response.status);
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al solicitar restablecimiento de contraseña:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor: ' + (error.message || 'Desconocido')
    };
  }
};

/**
 * Función para restablecer la contraseña con un token
 * @param {string} token - Token de restablecimiento
 * @param {string} userId - ID del usuario
 * @param {string} password - Nueva contraseña
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const resetPassword = async (token, userId, password) => {
  try {
    console.log('Enviando solicitud para restablecer contraseña');
    
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        userId,
        password
      }),
    });
    
    if (!response.ok) {
      console.error('Error en el restablecimiento:', response.status);
      return {
        success: false, 
        message: `Error del servidor: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor: ' + (error.message || 'Desconocido')
    };
  }
};
