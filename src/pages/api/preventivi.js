const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const fetchWithAuth = async (url, options = {}) => {
    // Verificar si estamos en el navegador antes de acceder a localStorage
    let token = '';
    let isAdmin = false;
    
    // Solo acceder a localStorage si estamos en el navegador (no en SSR)
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
        console.log('Token obtenido de localStorage:', token ? 'Token presente' : 'Token ausente', 'Longitud:', token?.length || 0);
        
        // Verificar que el token tenga formato JWT válido
        if (!token || token.split('.').length !== 3 || token.length < 20) {
            console.warn('Token inválido o faltante en localStorage:', token);
            
            // Intentar recuperar token del objeto usuario
            try {
                const storedUser = localStorage.getItem('userData');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    isAdmin = userData.role === 'admin';
                    if (userData.token && userData.token.split('.').length === 3) {
                        console.log('Usando token recuperado de datos de usuario');
                        token = userData.token;
                        console.log('Token recuperado, longitud:', token.length);
                        // Restaurar el token en localStorage para futuras peticiones
                        localStorage.setItem('token', token);
                        
                        // Verificar que se haya guardado correctamente
                        const savedToken = localStorage.getItem('token');
                        console.log('Token guardado correctamente:', savedToken === token, 'Longitud:', savedToken?.length || 0);
                    }
                }
            } catch (e) {
                console.error('Error al parsear datos de usuario:', e);
            }
        } else {
            // Verificar si el usuario es admin
            try {
                const storedUser = localStorage.getItem('userData');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    isAdmin = userData.role === 'admin';
                }
            } catch (e) {
                console.error('Error al verificar rol de usuario:', e);
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
        'Authorization': token ? `Bearer ${token.substring(0, 10)}... (longitud total: ${token.length})` : 'No token'
    });

    // Verificar que el token se está enviando completo
    if (token) {
        console.log('Verificación del token enviado:', 
                   'Longitud correcta:', token.length > 20, 
                   'Formato JWT (3 partes):', token.split('.').length === 3);
    }

    const response = await fetch(url, { ...options, headers });
    
    try {
        const data = await response.json();
        
        if (!response.ok) {
            // Si hay un error de autenticación, podrían haber problemas con el token
            if (response.status === 401) {
                console.error('Error de autenticación - posible token inválido');
                if (typeof window !== 'undefined') {
                    // Redirigir a login si estamos en el cliente
                    window.location.href = '/auth/login';
                }
            }
            // Si hay un error de autorización (acceso denegado)
            if (response.status === 403) {
                console.error('Error de autorización - acceso denegado');
                if (!isAdmin) {
                    throw new Error('Acceso denegado: solo los administradores pueden realizar esta operación');
                }
            }
            throw new Error(data.message || 'Error en la petición');
        }
        
        return data;
    } catch (error) {
        console.error('Error procesando respuesta:', error);
        throw error;
    }
};

// Obtener todos los preventivos (solo admin)
const getPreventivi = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL}/preventivo`);
        return response;
    } catch (error) {
        console.error('Error al obtener preventivos:', error);
        // Verificar si es un error de acceso denegado
        if (error.message.includes('Acceso denegado')) {
            return {
                success: false,
                data: [],
                message: 'Solo los administradores pueden ver todos los preventivos'
            };
        }
        throw error;
    }
};

// Obtener un preventivo por ID
const getPreventivo = async (id) => {
    try {
        const response = await fetchWithAuth(`${API_URL}/preventivo/${id}`);
        return response;
    } catch (error) {
        console.error('Error al obtener preventivo:', error);
        // Verificar si es un error de acceso denegado
        if (error.message.includes('Acceso denegado') || error.message.includes('No tienes permiso')) {
            return {
                success: false,
                data: null,
                message: 'No tienes permiso para ver este preventivo'
            };
        }
        throw error;
    }
};

// Crear un nuevo preventivo
const createPreventivo = async (data) => {
    const response = await fetchWithAuth(`${API_URL}/preventivo`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response;
};

// Actualizar un preventivo
const updatePreventivo = async (id, data) => {
    try {
        const response = await fetchWithAuth(`${API_URL}/preventivo/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        console.error('Error al actualizar preventivo:', error);
        // Verificar si es un error de acceso denegado
        if (error.message.includes('Acceso denegado') || error.message.includes('No tienes permiso')) {
            return {
                success: false,
                data: null,
                message: 'No tienes permiso para actualizar este preventivo'
            };
        }
        throw error;
    }
};

// Eliminar un preventivo (solo admin)
const deletePreventivo = async (id) => {
    try {
        const response = await fetchWithAuth(`${API_URL}/preventivo/${id}`, {
            method: 'DELETE',
        });
        return response;
    } catch (error) {
        console.error('Error al eliminar preventivo:', error);
        // Verificar si es un error de acceso denegado
        if (error.message.includes('Acceso denegado')) {
            return {
                success: false,
                message: 'Solo los administradores pueden eliminar preventivos'
            };
        }
        throw error;
    }
};

export {
    getPreventivi,
    getPreventivo,
    createPreventivo,
    updatePreventivo,
    deletePreventivo
};
