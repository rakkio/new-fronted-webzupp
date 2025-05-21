import axios from 'axios';

// Configuración global de Axios
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejo centralizado de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Puedes personalizar el manejo de errores aquí
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Función para enviar mensajes de contacto
export const sendContactMessage = async (messageData) => {
  try {
    console.log('Enviando mensaje a:', `${API_URL}/api/messages`);
    const response = await api.post('/api/messages', messageData);
    return response.data;
  } catch (error) {
    console.error('Error al enviar mensaje:', error.response?.status, error.response?.statusText);
    throw error;
  }
};

// Función para obtener todos los mensajes (solo admin)
export const getAllMessages = async (token) => {
  try {
    const response = await api.get('/api/messages', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener un mensaje específico (solo admin)
export const getMessage = async (messageId, token) => {
  try {
    const response = await api.get(`/api/messages/${messageId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para actualizar el estado de un mensaje (solo admin)
export const updateMessageStatus = async (messageId, status, token) => {
  try {
    const response = await api.patch(
      `/api/messages/${messageId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para eliminar un mensaje (solo admin)
export const deleteMessage = async (messageId, token) => {
  try {
    await api.delete(`/api/messages/${messageId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export default api; 