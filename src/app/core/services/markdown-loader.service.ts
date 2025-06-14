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
        title: 'Introducción al Blog',
        date: '2024-01-01',
        summary: 'Bienvenidos a mi blog técnico',
        fileName: 'introduccion.md'
      },
      {
        id: 'angular-tips',
        title: 'Tips de Angular',
        date: '2024-01-15',
        summary: 'Consejos útiles para desarrollar con Angular',
        fileName: 'angular-tips.md'
      }
    ];
  }
}