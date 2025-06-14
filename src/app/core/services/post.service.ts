import { Injectable } from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';
import { Post } from '../interfaces/post.interface';
import { MarkdownLoaderService } from './markdown-loader.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private markdownLoader: MarkdownLoaderService) { }

  /**
   * Obtiene todos los posts con metadatos
   */
  getAllPosts(): Observable<Post[]> {
    try {
      const posts = this.markdownLoader.getAllPostsMetadata();
      // Ordenar por fecha (más recientes primero)
      return of(posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Error obteniendo metadatos de posts:', error);
      return of([]);
    }
  }

  /**
   * Obtiene un post específico por ID
   */
  getPostById(id: string): Observable<Post | null> {
    try {
      const posts = this.markdownLoader.getAllPostsMetadata();
      const post = posts.find(p => p.id === id);
      
      if (!post) {
        return of(null);
      }

      return this.markdownLoader.getPost(post.fileName).pipe(
        catchError(error => {
          console.error(`Error cargando post ${id}:`, error);
          return of(null);
        })
      );
    } catch (error) {
      console.error(`Error buscando post ${id}:`, error);
      return of(null);
    }
  }

  /**
   * Verifica si un post existe
   */
  exists(id: string): boolean {
    try {
      const posts = this.markdownLoader.getAllPostsMetadata();
      return posts.some(p => p.id === id);
    } catch (error) {
      console.error(`Error verificando existencia del post ${id}:`, error);
      return false;
    }
  }

  /**
   * Busca posts por término
   */
  searchPosts(searchTerm: string): Observable<Post[]> {
    if (!searchTerm || searchTerm.trim() === '') {
      return this.getAllPosts();
    }

    return this.getAllPosts().pipe(
      map(posts => posts.filter(post => {
        const term = searchTerm.toLowerCase();
        return post.title.toLowerCase().includes(term) ||
               post.summary.toLowerCase().includes(term) ||
               (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term))) ||
               (post.author && post.author.toLowerCase().includes(term));
      })),
      catchError(error => {
        console.error('Error buscando posts:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene posts por tag
   */
  getPostsByTag(tag: string): Observable<Post[]> {
    if (!tag || tag.trim() === '') {
      return this.getAllPosts();
    }

    return this.getAllPosts().pipe(
      map(posts => posts.filter(post => 
        post.tags && post.tags.includes(tag)
      )),
      catchError(error => {
        console.error(`Error obteniendo posts por tag ${tag}:`, error);
        return of([]);
      })
    );
  }
}