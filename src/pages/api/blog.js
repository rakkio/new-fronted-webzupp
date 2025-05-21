// API para interactuar con el controlador de blog del backend

// Obtener la base URL de la API
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return window.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
};

// Obtener token de autenticación
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Función auxiliar para hacer peticiones
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Se requiere autenticación para realizar esta acción');
  }
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  }); 

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en la petición');
  }

  return response.json();
};


// Obtener todos los blogs con paginación y filtros
export const getBlogs = async (params = {}) => {
  try {
    const { page = 1, limit = 10, search = '', category = '', status = '' } = params;
    
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(category && { category }),
      ...(status && { status })
    }).toString();

    // Actualizamos la URL con el nuevo formato
    const url = `${getApiUrl()}/blogs?${queryParams}`;
    
    // Para el blog público no necesitamos autenticación
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la petición');
    }
    
    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al obtener blogs'
    };
  }
};

// Obtener un blog por ID
export const getBlog = async (id) => {
  try {
    if (!id) throw new Error('Se requiere un ID para obtener el blog');
    
    // Actualizado para usar el nuevo formato de URL
    const url = `${getApiUrl()}/blogs/${id}`;
    
    // Usar fetch normal para peticiones públicas
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la petición');
    }
    
    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al obtener blog'
    };
  }
};

// Crear un nuevo blog
export const createBlog = async (blogData) => {
  try {
    // Actualizado para usar el nuevo formato de URL
    const url = `${getApiUrl()}/blogs`;
    
    return await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(blogData)
    });
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al crear blog'
    };
  }
};

// Actualizar un blog existente
export const updateBlog = async (id, blogData) => {
  try {
    if (!id) throw new Error('Se requiere un ID para actualizar el blog');
    
    // Actualizado para usar el nuevo formato de URL
    const url = `${getApiUrl()}/blogs/${id}`;
    
    return await fetchWithAuth(url, {
      method: 'PUT',
      body: JSON.stringify(blogData)
    });
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al actualizar blog'
    };
  }
};

// Eliminar un blog
export const deleteBlog = async (id) => {
  try {
    if (!id) throw new Error('Se requiere un ID para eliminar el blog');
    
    // Actualizado para usar el nuevo formato de URL
    const url = `${getApiUrl()}/blogs/${id}`;
    
    return await fetchWithAuth(url, {
      method: 'DELETE'
    });
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al eliminar blog'
    };
  }
};

// Subir imagen para el blog
export const uploadBlogImage = async (imageFile) => {
  try {
    if (!imageFile) throw new Error('Se requiere un archivo para subir');

    const token = getAuthToken();
    if (!token) {
      throw new Error('Se requiere autenticación para subir imágenes');
    }

    // Crear FormData para enviar el archivo
    const formData = new FormData();
    formData.append('file', imageFile);

    // Ruta para subir imagen de blog según blogRoutes.js
    const url = `${getApiUrl()}/blogs/admin/upload/image`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al subir imagen');
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al subir imagen'
    };
  }
};

// Eliminar imagen del blog
export const deleteBlogImage = async (publicId) => {
  try {
    if (!publicId) throw new Error('Se requiere un ID público para eliminar la imagen');

    // Endpoint para eliminar archivos
    const url = `${getApiUrl()}/delete-file`;
    
    return await fetchWithAuth(url, {
      method: 'DELETE',
      body: JSON.stringify({ publicId })
    });
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al eliminar imagen'
    };
  }
};

// Dar like a un blog
export const likeBlog = async (id) => {
  try {
    if (!id) throw new Error('Se requiere un ID para dar like al blog');
    
    // Ruta corregida para dar like según blogController.js
    const url = `${getApiUrl()}/blogs/${id}/like`;
    
    return await fetchWithAuth(url, {
      method: 'POST'
    });
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al dar like al blog'
    };
  }
};

// Añadir comentario a un blog
export const addComment = async (id, content) => {
  try {
    if (!id) throw new Error('Se requiere un ID para comentar el blog');
    if (!content) throw new Error('Se requiere contenido para el comentario');
    
    // Ruta corregida para comentarios según blogController.js
    const url = `${getApiUrl()}/blogs/${id}/comments`;
    
    return await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al añadir comentario'
    };
  }
};
