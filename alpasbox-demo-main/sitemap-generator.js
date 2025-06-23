import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define all your routes
const routes = [
  '/',
  '/login',
  '/signup',
  '/profile',
  '/invitation-Video',
  '/all-cards',
  '/all-stationaries',
  '/invitation-collections',
  '/cart-item',
  '/custo-rev',
  '/faq',
  '/aboutut',
  '/contact',
  '/about',
  '/terms-con',
  '/privacy',
  '/thank-you',
  '/process',
  '/vendor-plan',
  '/vendor-login',
  '/vendor-verify',
  '/vendor-pro',
  '/contact-Deli'
];

// Define dynamic routes with their parameters
const dynamicRoutes = {
  '/invitation-Video/:category_id/:category_name': [
    { category_id: '1', category_name: 'wedding' },
    { category_id: '2', category_name: 'birthday' }
  ],
  '/blog/:id': [
    { id: '1' },
    { id: '2' }
  ],
  '/Stasubcategory/:subcategory_id/:subcategoryName': [
    { subcategory_id: '1', subcategoryName: 'cards' },
    { subcategory_id: '2', subcategoryName: 'stationary' }
  ],
  '/subcategory/:subcategory_id/:subcategoryName': [
    { subcategory_id: '1', subcategoryName: 'cards' },
    { subcategory_id: '2', subcategoryName: 'stationary' }
  ],
  '/:maincat_name/:category_id/:category_name': [
    { maincat_name: 'invitation-video', category_id: '1', category_name: 'wedding' },
    { maincat_name: 'invitation-card', category_id: '2', category_name: 'birthday' },
    { maincat_name: 'stationary', category_id: '3', category_name: 'general' }
  ]
};

// Generate URLs for dynamic routes
Object.entries(dynamicRoutes).forEach(([route, params]) => {
  params.forEach(param => {
    let url = route;
    Object.entries(param).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
    routes.push(url);
  });
});

// Generate sitemap XML
const generateSitemap = () => {
  const baseUrl = 'https://urbantyohar.com';
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  routes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route}</loc>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
};

// Write sitemap to file
try {
  const sitemap = generateSitemap();
  fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
} catch (error) {
  console.error('Error generating sitemap:', error);
}