import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Post, PostMetadata } from '../interfaces/post.interface';

// Declaramos front-matter como any para evitar problemas de tipado
declare const require: any;

@Injectable({
  providedIn: 'root'
})
export class MarkdownLoaderService {
  private frontMatter: any;

  constructor(private http: HttpClient) {
    // Carga dinámica de front-matter
    this.frontMatter = require('front-matter');
  }

  /**
   * Obtiene el contenido crudo de un archivo markdown
   */
  getPostContent(fileName: string): Observable<string> {
    return this.http.get(`/assets/markdown/${fileName}`, {
      responseType: 'text'
    }).pipe(
      catchError(error => {
        console.error(`Error cargando archivo ${fileName}:`, error);
        return of('');
      })
    );
  }

  /**
   * Obtiene un post completo con metadatos y contenido
   */
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
            author: metadata.author || 'Anónimo'
          };
        } catch (error) {
          console.error(`Error parseando front-matter en ${fileName}:`, error);
          // Retornar post básico sin metadatos en caso de error
          return {
            id: fileName.replace('.md', ''),
            fileName,
            content: content,
            title: fileName.replace('.md', '').replace(/-/g, ' '),
            date: new Date().toISOString(),
            summary: 'Contenido sin metadatos disponibles',
            tags: [],
            author: 'Anónimo'
          };
        }
      }),
      catchError(error => {
        console.error(`Error completo cargando post ${fileName}:`, error);
        return of({
          id: fileName.replace('.md', ''),
          fileName,
          content: 'Error cargando contenido',
          title: 'Error',
          date: new Date().toISOString(),
          summary: 'No se pudo cargar el post',
          tags: [],
          author: 'Sistema'
        } as Post);
      })
    );
  }

  /**
   * Lista todos los posts disponibles (requiere configuración manual)
   */
  getAllPostsMetadata(): Post[] {
    // Por ahora retornamos una lista estática
    // En producción, esto podría venir de un archivo JSON o API
    return [
      {
        id: 'introduccion',
        title: 'Bienvenido al Mundo del Desarrollo Web Moderno',
        date: '2025-06-15',
        summary: 'Una introducción apasionante al universo del desarrollo web y las tecnologías que están transformando la manera en que construimos aplicaciones',
        fileName: 'introduccion.md'
      },
      {
        id: 'angular-tips',
        title: '5 Tips Esenciales para Dominar Angular como un Pro',
        date: '2025-06-14',
        summary: 'Descubre los secretos que todo desarrollador Angular debería conocer para escribir código más limpio, eficiente y mantenible',
        fileName: 'angular-tips.md'
      },
      {
        id: 'mi-primer-hackathon',
        title: 'Mi Primer Hackathon: 48 Horas que Cambiaron mi Carrera',
        date: '2025-06-13',
        summary: 'La historia de cómo un fin de semana de programación intensiva me enseñó más sobre desarrollo y colaboración que meses de estudio solitario',
        fileName: 'mi-primer-hackathon.md'
      },
      {
        id: 'css-grid-vs-flexbox',
        title: 'CSS Grid vs Flexbox: La Batalla Definitiva (Spoiler: Ambos Ganan)',
        date: '2025-06-12',
        summary: 'Descubre cuándo usar cada herramienta de layout y por qué la combinación de ambas es el superpoder que todo frontend developer necesita',
        fileName: 'css-grid-vs-flexbox.md'
      }
    ];
  }
}