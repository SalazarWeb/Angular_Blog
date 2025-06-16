import { Injectable } from '@angular/core';
import { Observable, of, catchError, map } from 'rxjs';
import { Post } from '../interfaces/post.interface';
import { ApiPostService, ApiResponse } from './api-post.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private apiPostService: ApiPostService) { }

  getAllPosts(): Observable<Post[]> {
    return this.apiPostService.getAllPosts().pipe(
      catchError(error => {
        console.error('Error obteniendo metadatos de posts:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene un post específico por ID
   */
  getPostById(id: string): Observable<Post | null> {
    return this.apiPostService.getPostById(id).pipe(
      catchError(error => {
        console.error(`Error buscando post ${id}:`, error);
        return of(null);
      })
    );
  }

  /**
   * Verifica si un post existe
   */
  exists(id: string): Observable<boolean> {
    return this.apiPostService.getAllPosts().pipe(
      map(posts => posts.some(post => post.id === id)),
      catchError(error => {
        console.error(`Error verificando existencia del post ${id}:`, error);
        return of(false);
      })
    );
  }

  /**
   * Busca posts por término
   */
  searchPosts(searchTerm: string): Observable<Post[]> {
    return this.apiPostService.searchPosts(searchTerm);
  }

  /**
   * Obtiene posts por tag
   */
  getPostsByTag(tag: string): Observable<Post[]> {
    return this.apiPostService.getPostsByTag(tag);
  }

  /**
   * Obtiene posts por categoría
   */
  getPostsByCategory(category: string): Observable<Post[]> {
    return this.apiPostService.getPostsByCategory(category);
  }

  /**
   * Obtiene el modo actual de operación
   */
  getCurrentMode(): 'api' | 'local' {
    return 'api';
  }

  /**
   * Limpia todas las cachés
   */
  clearAllCaches(): Observable<any> {
    return this.apiPostService.clearBackendCache();
  }

  /**
   * Obtiene posts con paginación
   */
  getPostsPaginated(page: number = 1, limit: number = 6): Observable<ApiResponse<Post>> {
    return this.apiPostService.getPostsPaginated(page, limit);
  }
}