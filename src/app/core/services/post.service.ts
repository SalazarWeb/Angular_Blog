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
 
  getPostById(id: string): Observable<Post | null> {
    return this.apiPostService.getPostById(id).pipe(
      catchError(error => {
        console.error(`Error buscando post ${id}:`, error);
        return of(null);
      })
    );
  }
 
  exists(id: string): Observable<boolean> {
    return this.apiPostService.getAllPosts().pipe(
      map(posts => posts.some(post => post.id === id)),
      catchError(error => {
        console.error(`Error verificando existencia del post ${id}:`, error);
        return of(false);
      })
    );
  }
 
  searchPosts(searchTerm: string, page: number = 1, limit: number = 6): Observable<ApiResponse<Post>> {
    return this.apiPostService.searchPosts(searchTerm, page, limit);
  }

  getPostsByCategory(category: string): Observable<Post[]> {
    return this.apiPostService.getPostsByCategory(category);
  }
 
  getCurrentMode(): 'api' | 'local' {
    return 'api';
  }
 
  clearAllCaches(): Observable<any> {
    return this.apiPostService.clearBackendCache();
  }

  getPostsPaginated(page: number = 1, limit: number = 6): Observable<ApiResponse<Post>> {
    return this.apiPostService.getPostsPaginated(page, limit);
  }
}