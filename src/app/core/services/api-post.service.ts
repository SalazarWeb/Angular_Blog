import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { Post } from '../interfaces/post.interface';

export interface ApiResponse<T> {
  posts: T[];
  total: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
  totalPages?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiPostService {
  private readonly baseUrl = 'https://backend-blog-pmt2.onrender.com/api';

  constructor(private http: HttpClient) { }

  checkApiHealth(): Observable<boolean> {
    return this.http.get<{status: string}>(`${this.baseUrl}/health`).pipe(
      map(response => response.status === 'OK'),
      catchError(error => {
        console.error('API del backend no disponible:', error);
        return of(false);
      })
    );
  }

  /**
   * Obtiene todos los posts desde la API del backend
   */
  getAllPosts(): Observable<Post[]> {
    return this.http.get<ApiResponse<Post>>(`${this.baseUrl}/posts`).pipe(
      map(response => response.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())),
      catchError(error => {
        console.error('Error obteniendo posts desde API:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene un post específico por ID desde la API
   */
  getPostById(id: string): Observable<Post | null> {
    return this.http.get<Post>(`${this.baseUrl}/posts/${id}`).pipe(
      catchError(error => {
        console.error(`Error obteniendo post ${id} desde API:`, error);
        return of(null);
      })
    );
  }

  getPostRaw(id: string): Observable<Post | null> {
    return this.http.get<Post>(`${this.baseUrl}/posts/${id}/raw`).pipe(
      catchError(error => {
        console.error(`Error obteniendo post raw ${id} desde API:`, error);
        return of(null);
      })
    );
  }

  /**
   * Busca posts por término con paginación
   */
  searchPosts(query: string, page: number = 1, limit: number = 6): Observable<ApiResponse<Post>> {
    if (!query.trim()) {
      return of({
        posts: [],
        total: 0,
        page: page,
        limit: limit,
        hasMore: false,
        totalPages: 0
      });
    }

    return this.http.get<ApiResponse<Post>>(`${this.baseUrl}/posts/search/${encodeURIComponent(query)}?page=${page}&limit=${limit}`).pipe(
      catchError(error => {
        console.error(`Error buscando posts con query "${query}":`, error);
        return of({
          posts: [],
          total: 0,
          page: page,
          limit: limit,
          hasMore: false,
          totalPages: 0
        });
      })
    );
  }
 
  getPostsByCategory(category: string): Observable<Post[]> {
    return this.http.get<ApiResponse<Post>>(`${this.baseUrl}/posts/category/${encodeURIComponent(category)}`).pipe(
      map(response => response.posts),
      catchError(error => {
        console.error(`Error obteniendo posts por categoría "${category}":`, error);
        return of([]);
      })
    );
  }

  clearBackendCache(): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.baseUrl}/cache/clear`, {}).pipe(
      catchError(error => {
        console.error('Error limpiando caché del backend:', error);
        return of({message: 'Error limpiando caché'});
      })
    );
  }

  getPostsPaginated(page: number = 1, limit: number = 6): Observable<ApiResponse<Post>> {
    return this.http.get<ApiResponse<Post>>(`${this.baseUrl}/posts?page=${page}&limit=${limit}`).pipe(
      catchError(error => {
        console.error('Error obteniendo posts paginados desde API:', error);
        return of({
          posts: [],
          total: 0,
          page: page,
          limit: limit,
          hasMore: false,
          totalPages: 0
        });
      })
    );
  }
}