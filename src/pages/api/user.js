const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const fetchWithAuth = async (url, options = {}) => {
  // Verificar si estamos en el navegador antes de acceder a localStorage
  let token = '';
  
  // Solo acceder a localStorage si estamos en el navegador (no en SSR)
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
    
    // Verificar que el token tenga formato JWT válido
    if (!token || token.split('.').length !== 3 || token.length < 20) {
      console.warn('Token inválido o faltante en localStorage:', token);
      
      // Intentar recuperar token del objeto usuario
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.token && userData.token.split('.').length === 3) {
            console.log('Usando token recuperado de datos de usuario');
            token = userData.token;
            // Restaurar el token en localStorage para futuras peticiones
            localStorage.setItem('token', token);
          }
        }
      } catch (e) {
        console.error('Error al parsear datos de usuario:', e);
      }
    }
  }
  
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

  console.log('Haciendo petición autenticada a:', url);
  console.log('Con cabeceras:', {
    ...headers,
    'Authorization': token ? `Bearer ${token.substring(0, 10)}...` : 'No token'
  });

    const response = await fetch(url, { ...options, headers });
  
  try {
    const data = await response.json();

    if (!response.ok) {
      // Si hay un error de autenticación, podrían haber problemas con el token
      if (response.status === 401) {
        console.error('Error de autenticación - posible token inválido');
      }
        throw new Error(data.message || 'Error en la petición');
    }

    return data;
  } catch (error) {
    console.error('Error procesando respuesta:', error);
    throw error;
  }
};

const getUsers = async () => {
    const response = await fetchWithAuth(`${API_URL}/users/admin`);
    return response;
};

// Obtener un usuario por ID
const getUser = async (id) => {
    const response = await fetchWithAuth(`${API_URL}/users/admin/${id}`);
    return response;
};

// Actualizar un usuario
const updateUser = async (id, userData) => {
    const response = await fetchWithAuth(`${API_URL}/users/admin/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
    });
    return response;
};

// Eliminar un usuario
const deleteUser = async (id) => {
    const response = await fetchWithAuth(`${API_URL}/users/admin/${id}`, {
        method: 'DELETE'
    });
    return response;
};

export { 
    getUsers, 
    getUser,
    updateUser,
    deleteUser
};    
