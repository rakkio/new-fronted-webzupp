/**
 * Utilidades para manejar la sesión de forma global
 */

/**
 * Limpia completamente la sesión del usuario y fuerza un reinicio
 */
export const clearAllSessions = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpiar sessionStorage por si acaso
    sessionStorage.clear();
    
    // Mostrar mensaje
    console.log('Sesión limpiada completamente, redirigiendo a login...');
    
    // Redirigir a login
    window.location.href = '/auth/login';
  } catch (error) {
    console.error('Error al limpiar sesión:', error);
    alert('Error al cerrar sesión. Por favor, cierra el navegador e intenta de nuevo.');
  }
};

/**
 * Revisa si es necesario revalidar la sesión 
 * (token expirado o inválido pero datos de usuario presentes)
 */
export const checkSessionValidity = () => {
  if (typeof window === 'undefined') return;
  
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) return;
    
    // Verificar formato del token
    if (token.split('.').length !== 3) {
      console.warn('Token con formato inválido, limpiando sesión');
      clearAllSessions();
      return;
    }
    
    // Verificar expiración
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      
      // Si el token ha expirado, limpiar
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        console.warn('Token expirado, limpiando sesión');
        clearAllSessions();
        return;
      }
    } catch (e) {
      console.error('Error al verificar token:', e);
      clearAllSessions();
    }
  } catch (error) {
    console.error('Error al verificar validez de sesión:', error);
  }
}; 