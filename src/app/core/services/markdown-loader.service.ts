import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import frontMatter from 'front-matter';
import { Post, PostMetadata } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root'
})
export class MarkdownLoaderService {

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el contenido crudo de un archivo markdown
   */
  getPostContent(fileName: string): Observable<string> {
    return this.http.get(`/assets/markdown/${fileName}`, {
      responseType: 'text'
    });
  }

  /**
   * Obtiene un post completo con metadatos y contenido
   */
  getPost(fileName: string): Observable<Post> {
    return this.getPostContent(fileName).pipe(
      map(content => {
        const parsed = frontMatter(content);
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