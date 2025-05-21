import { getBlogs } from './api/blog';

// Función para generar el sitemap XML
const generateSitemap = (baseUrl, routes, blogs) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
  ${blogs
    .map(
      (blog) => `
  <url>
    <loc>${baseUrl}/blog/${blog._id}</loc>
    <lastmod>${new Date(blog.updatedAt || blog.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
</urlset>`;
};

// Lista de rutas estáticas del sitio
const routes = [
  '',
  '/blog',
  '/servizi',
  '/chi-siamo',
  '/contatti',
  '/portfolio'
];

class Sitemap {
  static async getInitialProps({ res }) {
    try {
      // Configuración base
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webzupp.com';
      
      // Obtener todos los blogs publicados
      const blogsResponse = await getBlogs({ status: 'published', limit: 1000 });
      const blogs = blogsResponse.success 
        ? (Array.isArray(blogsResponse.data) ? blogsResponse.data : blogsResponse.data.blogs || []) 
        : [];
      
      // Generar el XML
      const sitemap = generateSitemap(baseUrl, routes, blogs);
      
      // Configurar cabeceras y enviar respuesta
      if (res) {
        res.setHeader('Content-Type', 'text/xml');
        res.setHeader('Cache-Control', 'public, s-maxage=1200, stale-while-revalidate=600');
        res.write(sitemap);
        res.end();
      }
    } catch (error) {
      if (res) {
        res.statusCode = 500;
        res.write('Error generando el sitemap');
        res.end();
      }
    }
    
    return {
      props: {}
    };
  }
}

export default Sitemap; 