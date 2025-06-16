# Blog Frontend Angular

Aplicación Angular 16 que consume una API REST para mostrar contenido de blog.

## 🚀 Características

- **Angular 16** con TypeScript
- **Consumo de API REST** para obtener posts
- **Paginación inteligente** (6 posts iniciales + 4 en 4)
- **Búsqueda en tiempo real** de posts
- **Filtros por categoría y tags**
- **Responsive design** para todos los dispositivos
- **Markdown rendering** con HTML sanitizado
- **SEO optimizado** con meta tags dinámicos

## 📋 Requisitos

- Node.js 16+ 
- npm o yarn
- Angular CLI 16+

## ⚡ Inicio Rápido

```bash
# Instalar dependencias
npm install

# Desarrollo
ng serve
# o
npm start

# Build para producción
ng build --configuration production
```

La aplicación estará disponible en: **http://localhost:4200**

## 🔧 Configuración de API

El frontend espera que la API esté en:
- **Desarrollo**: `http://localhost:3000/api`
- **Producción**: Configurar en `src/app/core/services/api-post.service.ts`

Para cambiar la URL de la API:

```typescript
// src/app/core/services/api-post.service.ts
export class ApiPostService {
  private readonly baseUrl = 'https://tu-api-backend.com/api'; // 👈 Cambiar aquí
  // ...existing code...
}
```

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── interfaces/
│   │   │   │   └── post.interface.ts      # Interfaz Post
│   │   │   └── services/
│   │   │       ├── api-post.service.ts    # Conexión con API
│   │   │       ├── hybrid-post.service.ts # Lógica de negocio
│   │   │       ├── post.service.ts        # Servicio principal
│   │   │       └── filter.service.ts      # Filtros y búsqueda
│   │   ├── features/
│   │   │   ├── post/
│   │   │   │   ├── post-list/             # Lista de posts con paginación
│   │   │   │   └── post-detail/           # Vista individual de post
│   │   │   └── shared/
│   │   │       └── components/
│   │   │           └── markdown-renderer/ # Renderiza HTML sanitizado
│   │   ├── app.component.*                # Componente raíz
│   │   └── app.module.ts                  # Módulo principal
│   ├── assets/
│   │   └── images/                        # Imágenes estáticas
│   └── styles.css                         # Estilos globales
├── angular.json                           # Configuración Angular
├── package.json
└── README.md
```

## 🎯 Funcionalidades

### 📄 Lista de Posts
- **Carga inicial**: 6 posts más recientes
- **Botón "Cargar más"**: Agrega 4 posts adicionales
- **Búsqueda**: Por título, contenido, tags y categorías
- **Filtros**: Por categoría y tags
- **Responsive**: Adaptado a móviles y tablets

### 📖 Detalle de Post
- **Contenido completo**: HTML renderizado desde Markdown
- **Meta tags dinámicos**: SEO optimizado
- **Tiempo de lectura**: Calculado automáticamente
- **Navegación**: Botón para volver a la lista

### 🔍 Búsqueda y Filtros
- **Búsqueda en tiempo real**: Mientras escribes
- **Filtros por categoría**: Desarrollo, Tecnología, Experiencias
- **Filtros por tags**: Clickeables desde posts
- **Limpiar filtros**: Volver a vista completa

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm start                    # ng serve
npm run serve               # ng serve
npm run serve:prod          # ng serve --configuration production

# Build
npm run build               # ng build
npm run build:prod          # ng build --configuration production

# Testing
npm test                    # ng test
npm run test:coverage       # ng test --code-coverage

# Linting
npm run lint                # ng lint
npm run lint:fix            # ng lint --fix

# Análisis
npm run analyze             # webpack-bundle-analyzer
```

## 🌐 Despliegue

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Primer despliegue
vercel

# Despliegues posteriores
vercel --prod
```

### Netlify
```bash
# Build
npm run build:prod

# Arrastrar carpeta dist/blog-frontend a netlify.com
# O conectar repositorio de GitHub
```

### GitHub Pages
```bash
# Instalar herramienta
npm install -g angular-cli-ghpages

# Build y deploy
ng build --configuration production --base-href /nombre-repo/
npx angular-cli-ghpages --dir=dist/blog-frontend
```

### Firebase Hosting
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Inicializar
firebase init hosting

# Deploy
npm run build:prod
firebase deploy
```

## 🔧 Variables de Entorno

Para configuraciones específicas, puedes usar:

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://tu-api-backend.com/api',
  appName: 'Mi Blog'
};
```

## 📱 PWA (Opcional)

Para convertir en Progressive Web App:

```bash
ng add @angular/pwa
npm run build:prod
```

## 🎨 Personalización

### Colores y Estilos
Los colores principales están en variables CSS:

```css
/* src/styles.css */
:root {
  --azul-cielo-primario: #87CEEB;
  --verde-agua-tranquilo: #88C9A1;
  --azul-noche-suave: #3A506B;
  /* ...existing colors... */
}
```

### Componentes
Cada componente tiene su propio CSS scoped. Modifica los archivos `.css` correspondientes.

## 🔒 Seguridad

- **DomSanitizer**: HTML sanitizado por Angular
- **HttpClient**: Interceptors configurables
- **CORS**: Manejado por el backend
- **CSP**: Headers de seguridad configurables

## 📈 Rendimiento

- **OnPush Strategy**: En componentes clave
- **TrackBy functions**: Para *ngFor optimizados
- **Lazy loading**: Módulos bajo demanda
- **Caché HTTP**: Headers respetados del backend

## 🧪 Testing

```bash
# Tests unitarios
npm test

# Tests e2e (si configurados)
npm run e2e

# Coverage
npm run test:coverage
```

## 🐛 Debug

### Logs de Desarrollo
La aplicación muestra logs útiles en consola durante desarrollo:

```javascript
// Ejemplo de logs
🔄 Cargando más posts - Página 2, Posts actuales: 6
✅ Recibidos 4 posts adicionales
📊 Total posts ahora: 10, Hay más: false
```

### Network Tab
Revisa las llamadas a la API en Developer Tools > Network

## 📦 Dependencias Principales

- **@angular/core**: Framework Angular
- **@angular/common**: Pipes y directivas comunes
- **@angular/router**: Navegación
- **@angular/platform-browser**: DOM y sanitización
- **rxjs**: Programación reactiva
- **typescript**: Lenguaje de programación

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

## 🔗 API Backend

Este frontend requiere el backend API correspondiente. Ver documentación del backend para:
- Instalación y configuración
- Estructura de datos
- Endpoints disponibles
