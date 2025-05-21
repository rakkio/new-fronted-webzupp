/**
 * Decodifica un token JWT y obtiene su payload
 * @param {string} token - Token JWT a decodificar
 * @returns {object|null} - Payload del token o null si no es válido
 */
export const decodeToken = (token) => {
  // Verificar entradas
  if (!token) {
    console.error('Token JWT no proporcionado');
    return null;
  }
  
  if (typeof token !== 'string') {
    console.error('Token JWT debe ser una cadena, se recibió:', typeof token);
    return null;
  }
  
  // Verificar formato (tres partes separadas por puntos)
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.error(`Token JWT inválido: formato incorrecto (tiene ${parts.length} partes en lugar de 3)`);
    console.error('Token recibido:', token.length > 20 ? token.substring(0, 20) + '...' : token);
    return null;
  }
  
  try {
    // Obtener la parte del payload (segunda parte del token)
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar token JWT:', error.message);
    return null;
  }
};

/**
 * Verifica si un token JWT ha expirado
 * @param {string} token - Token JWT a verificar
 * @returns {boolean} - true si ha expirado, false si es válido
 */
export const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  
  // exp está en segundos, Date.now() en milisegundos
  return Date.now() >= payload.exp * 1000;
};

/**
 * Obtiene el rol del usuario desde el token JWT
 * @param {string} token - Token JWT
 * @returns {string} - Rol del usuario o 'user' por defecto
 */
export const getRoleFromToken = (token) => {
  const payload = decodeToken(token);
  if (!payload) return 'user';
  
  return payload.role || 'user';
};

/**
 * Extrae información relevante del token JWT
 * @param {string} token - Token JWT
 * @returns {object} - Información del token
 */
export const getTokenInfo = (token) => {
  // Verificación rápida de formato antes de intentar decodificar
  if (!token || typeof token !== 'string' || !token.includes('.') || token.split('.').length !== 3) {
    console.error('Token con formato inválido en getTokenInfo:', 
                 token ? (token.length > 20 ? token.substring(0, 20) + `... (longitud: ${token.length})` : token) : 'null o undefined');
    return {
      valid: false,
      expired: true,
      role: 'user',
      id: null,
      exp: null
    };
  }
  
  const payload = decodeToken(token);
  if (!payload) {
    return {
      valid: false,
      expired: true,
      role: 'user',
      id: null,
      exp: null
    };
  }
  
  return {
    valid: true,
    expired: isTokenExpired(token),
    role: payload.role || 'user',
    id: payload.id || null,
    exp: payload.exp ? new Date(payload.exp * 1000) : null
  };
}; 