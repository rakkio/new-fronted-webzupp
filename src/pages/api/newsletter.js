// URL base del backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Función para suscribirse a la newsletter
 * @param {Object} subscriberData - Datos del suscriptor (email, nombre, etc.)
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const subscribeToNewsletter = async (subscriberData) => {
  try {
    console.log('Enviando solicitud de suscripción a newsletter:', `${API_URL}/api/v1/api/newsletter/subscribe`);
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriberData),
    };
    
    const response = await fetch(`${API_URL}/api/v1/api/newsletter/subscribe`, requestOptions);
    
    if (!response.ok) {
      console.error('Error de respuesta:', response.status, response.statusText);
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la suscripción a newsletter:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor: ' + (error.message || 'Desconocido')
    };
  }
};

/**
 * Función para verificar la suscripción a la newsletter
 * @param {string} token - Token de verificación
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const verifyNewsletterSubscription = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/api/newsletter/verify?token=${token}`);
    
    if (!response.ok) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la verificación de suscripción:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor: ' + (error.message || 'Desconocido')
    };
  }
};

/**
 * Función para cancelar la suscripción a la newsletter
 * @param {string} email - Email del suscriptor
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const unsubscribeFromNewsletter = async (email) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la cancelación de suscripción:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor: ' + (error.message || 'Desconocido')
    };
  }
}; 