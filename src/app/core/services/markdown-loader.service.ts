import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Post, PostMetadata } from '../interfaces/post.interface';
import { EnvironmentService } from './environment.service';

declare const require: any;

@Injectable({
  providedIn: 'root'
})
export class MarkdownLoaderService {
  private frontMatter: any;
  private postsCache: Post[] | null = null;
  private http = inject(HttpClient);
  private envService = inject(EnvironmentService);

  constructor() {
    this.frontMatter = require('front-matter');
  }

  getPostContent(fileName: string): Observable<string> {
    return this.http.get(`/assets/markdown/${fileName}`, {
      responseType: 'text'
    }).pipe(
      catchError(error => {
        this.envService.errorLog(`Error cargando archivo ${fileName}:`, error);
        return of('');
      })
    );
  }

  getPost(fileName: string): Observable<Post> {
    return this.getPostContent(fileName).pipe(
      map(content => {
        if (!content) {
          throw new Error(`No se pudo cargar el contenido del archivo ${fileName}`);
        }

        try {
          const parsed = this.frontMatter(content);
          const metadata = parsed.attributes as PostMetadata;
          
          return {
            id: fileName.replace('.md', ''),
            fileName,
            content: parsed.body,
            title: metadata.title || 'Sin título',
            date: metadata.date || new Date().toISOString(),
            summary: metadata.summary || '',
            tags: metadata.tags || [],
            author: metadata.author || 'Anónimo',
            category: metadata.category || '',
            subcategory: metadata.subcategory || '',
            coverImage: metadata.coverImage || ''
          };
        } catch (error) {
          this.envService.errorLog(`Error parseando front-matter en ${fileName}:`, error);
          
          return {
            id: fileName.replace('.md', ''),
            fileName,
            content: content,
            title: fileName.replace('.md', '').replace(/-/g, ' '),
            date: new Date().toISOString(),
            summary: 'Contenido sin metadatos disponibles',
            tags: [],
            author: 'Anónimo',
            category: '',
            subcategory: '',
            coverImage: ''
          };
        }
      }),
      catchError(error => {
        this.envService.errorLog(`Error completo cargando post ${fileName}:`, error);
        // Retornar post fallback con datos básicos
        return of(this.getFallbackPost(fileName));
      })
    );
  }

  /**
   * Sistema robusto que combina el índice JSON con fallbacks manuales
   */
  getAllPostsMetadata(): Observable<Post[]> {
    if (this.postsCache) {
      this.envService.devLog('Devolviendo posts desde caché');
      return of(this.postsCache);
    }

    this.envService.devLog('Cargando posts desde el índice JSON...');
    
    // Intentar cargar desde el índice JSON primero
    return this.http.get<{id: string, fileName: string}[]>('/assets/posts-index.json').pipe(
      map(indexData => {
        this.envService.devLog('Datos del índice JSON cargados:', indexData);
        
        // Convertir el índice en metadatos básicos
        const posts: Post[] = indexData.map(item => ({
          id: item.id,
          fileName: item.fileName,
          title: this.getTitleFromId(item.id),
          date: this.getDateFromId(item.id),
          summary: this.getSummaryFromId(item.id),
          tags: this.getTagsFromId(item.id),
          author: 'Tu Nombre',
          category: this.getCategoryFromId(item.id),
          subcategory: this.getSubcategoryFromId(item.id),
          coverImage: '',
          content: '' // Se carga dinámicamente cuando se necesita
        }));
        
        this.postsCache = posts;
        this.envService.devLog(`Posts cargados exitosamente: ${posts.length} posts`);
        return posts;
      }),
      catchError(error => {
        this.envService.errorLog('Error cargando posts-index.json, usando fallback manual:', error);
        // Fallback al sistema manual si falla la carga del JSON
        const fallbackPosts = this.getManualPostsMetadata();
        this.envService.devLog(`Usando datos de fallback: ${fallbackPosts.length} posts`);
        return of(fallbackPosts);
      })
    );
  }

  /**
   * Datos de fallback basados en los archivos conocidos
   */
  private getManualPostsMetadata(): Post[] {
    const manualPosts: Post[] = [
      {
        id: 'post-de-prueba',
        title: 'Del Síndrome del Impostor a Mentor: Mi Transformación en 2 Años',
        date: '2025-06-16',
        summary: 'Cómo pasé de sentir que no merecía estar en tech a ayudar a otros desarrolladores a encontrar su camino en la industria.',
        fileName: 'post-de-prueba.md',
        tags: ['experiencias', 'carrera', 'mentoring'],
        author: 'Tu Nombre',
        category: 'experiencias',
        subcategory: 'desarrollo-personal',
        coverImage: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=400&fit=crop',
        content: ''
      },
      {
        id: 'post-de-prueba2',
        title: 'React vs Vue: La Batalla Épica que Todo Frontend Developer Debe Conocer',
        date: '2025-06-15',
        summary: 'Una comparación honesta y práctica entre React y Vue desde la perspectiva de alguien que ha trabajado profesionalmente con ambos frameworks.',
        fileName: 'post-de-prueba2.md',
        tags: ['react', 'vue', 'javascript', 'desarrollo frontend', 'comparación frameworks'],
        author: 'Tu Nombre',
        category: 'tecnologia',
        subcategory: 'frameworks frontend',
        coverImage: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=400&fit=crop',
        content: ''
      },
      {
        id: 'introduccion',
        title: 'Bienvenido al Mundo del Desarrollo Web Moderno',
        date: '2025-06-15',
        summary: 'Una introducción apasionante al universo del desarrollo web y las tecnologías que están transformando la manera en que construimos aplicaciones.',
        fileName: 'introduccion.md',
        tags: ['introducción', 'web', 'desarrollo'],
        author: 'Tu Nombre',
        category: 'tecnologia',
        subcategory: 'fundamentos',
        coverImage: '',
        content: ''
      },
      {
        id: 'angular-tips',
        title: '5 Tips Esenciales para Dominar Angular como un Pro',
        date: '2025-06-14',
        summary: 'Descubre los secretos que todo desarrollador Angular debería conocer para escribir código más limpio, eficiente y mantenible.',
        fileName: 'angular-tips.md',
        tags: ['angular', 'tips', 'desarrollo'],
        author: 'Tu Nombre',
        category: 'desarrollo-web',
        subcategory: 'frameworks',
        coverImage: '',
        content: ''
      },
      {
        id: 'mi-primer-hackathon',
        title: 'Mi Primer Hackathon: 48 Horas que Cambiaron mi Carrera',
        date: '2025-06-13',
        summary: 'La historia de cómo un fin de semana de programación intensiva me enseñó más sobre desarrollo y colaboración que meses de estudio solitario.',
        fileName: 'mi-primer-hackathon.md',
        tags: ['hackathon', 'experiencias', 'aprendizaje'],
        author: 'Tu Nombre',
        category: 'experiencias',
        subcategory: 'eventos',
        coverImage: '',
        content: ''
      },
      {
        id: 'css-grid-vs-flexbox',
        title: 'CSS Grid vs Flexbox: La Batalla Definitiva (Spoiler: Ambos Ganan)',
        date: '2025-06-12',
        summary: 'Descubre cuándo usar cada herramienta de layout y por qué la combinación de ambas es el superpoder que todo frontend developer necesita.',
        fileName: 'css-grid-vs-flexbox.md',
        tags: ['css', 'grid', 'flexbox', 'layout'],
        author: 'Tu Nombre',
        category: 'desarrollo-web',
        subcategory: 'css',
        coverImage: '',
        content: ''
      }
    ];

    this.postsCache = manualPosts;
    return manualPosts;
  }

  // Funciones auxiliares para extraer metadatos del ID
  private getTitleFromId(id: string): string {
    const titles: { [key: string]: string } = {
      'post-de-prueba': 'Del Síndrome del Impostor a Mentor: Mi Transformación en 2 Años',
      'post-de-prueba2': 'React vs Vue: La Batalla Épica que Todo Frontend Developer Debe Conocer',
      'introduccion': 'Bienvenido al Mundo del Desarrollo Web Moderno',
      'angular-tips': '5 Tips Esenciales para Dominar Angular como un Pro',
      'mi-primer-hackathon': 'Mi Primer Hackathon: 48 Horas que Cambiaron mi Carrera',
      'css-grid-vs-flexbox': 'CSS Grid vs Flexbox: La Batalla Definitiva (Spoiler: Ambos Ganan)'
    };
    return titles[id] || id.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  private getDateFromId(id: string): string {
    const dates: { [key: string]: string } = {
      'post-de-prueba': '2025-06-16',
      'post-de-prueba2': '2025-06-15',
      'introduccion': '2025-06-15',
      'angular-tips': '2025-06-14',
      'mi-primer-hackathon': '2025-06-13',
      'css-grid-vs-flexbox': '2025-06-12'
    };
    return dates[id] || new Date().toISOString().split('T')[0];
  }

  private getSummaryFromId(id: string): string {
    const summaries: { [key: string]: string } = {
      'post-de-prueba': 'Cómo pasé de sentir que no merecía estar en tech a ayudar a otros desarrolladores a encontrar su camino en la industria.',
      'post-de-prueba2': 'Una comparación honesta y práctica entre React y Vue desde la perspectiva de alguien que ha trabajado profesionalmente con ambos frameworks.',
      'introduccion': 'Una introducción apasionante al universo del desarrollo web y las tecnologías que están transformando la manera en que construimos aplicaciones.',
      'angular-tips': 'Descubre los secretos que todo desarrollador Angular debería conocer para escribir código más limpio, eficiente y mantenible.',
      'mi-primer-hackathon': 'La historia de cómo un fin de semana de programación intensiva me enseñó más sobre desarrollo y colaboración que meses de estudio solitario.',
      'css-grid-vs-flexbox': 'Descubre cuándo usar cada herramienta de layout y por qué la combinación de ambas es el superpoder que todo frontend developer necesita.'
    };
    return summaries[id] || 'Descripción no disponible';
  }

  private getTagsFromId(id: string): string[] {
    const tags: { [key: string]: string[] } = {
      'post-de-prueba': ['experiencias', 'carrera', 'mentoring'],
      'post-de-prueba2': ['react', 'vue', 'javascript', 'desarrollo frontend'],
      'introduccion': ['introducción', 'web', 'desarrollo'],
      'angular-tips': ['angular', 'tips', 'desarrollo'],
      'mi-primer-hackathon': ['hackathon', 'experiencias', 'aprendizaje'],
      'css-grid-vs-flexbox': ['css', 'grid', 'flexbox', 'layout']
    };
    return tags[id] || [];
  }

  private getCategoryFromId(id: string): string {
    const categories: { [key: string]: string } = {
      'post-de-prueba': 'experiencias',
      'post-de-prueba2': 'tecnologia',
      'introduccion': 'tecnologia',
      'angular-tips': 'desarrollo-web',
      'mi-primer-hackathon': 'experiencias',
      'css-grid-vs-flexbox': 'desarrollo-web'
    };
    return categories[id] || 'general';
  }

  private getSubcategoryFromId(id: string): string {
    const subcategories: { [key: string]: string } = {
      'post-de-prueba': 'desarrollo-personal',
      'post-de-prueba2': 'frameworks frontend',
      'introduccion': 'fundamentos',
      'angular-tips': 'frameworks',
      'mi-primer-hackathon': 'eventos',
      'css-grid-vs-flexbox': 'css'
    };
    return subcategories[id] || '';
  }

  private getFallbackPost(fileName: string): Post {
    const id = fileName.replace('.md', '');
    return {
      id,
      fileName,
      content: 'Error cargando contenido del post. Por favor, intenta más tarde.',
      title: this.getTitleFromId(id),
      date: this.getDateFromId(id),
      summary: 'No se pudo cargar el contenido del post',
      tags: this.getTagsFromId(id),
      author: 'Sistema',
      category: this.getCategoryFromId(id),
      subcategory: this.getSubcategoryFromId(id),
      coverImage: ''
    };
  }

  /**
   * Invalida la caché de posts para forzar una recarga
   */
  clearCache(): void {
    this.postsCache = null;
  }
}