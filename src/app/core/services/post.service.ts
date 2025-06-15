import { Injectable } from '@angular/core';
import { Observable, of, map, catchError, switchMap } from 'rxjs';
import { Post } from '../interfaces/post.interface';
import { MarkdownLoaderService } from './markdown-loader.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private markdownLoader: MarkdownLoaderService) { }

  getAllPosts(): Observable<Post[]> {
    return this.markdownLoader.getAllPostsMetadata().pipe(
      map((posts: Post[]) => posts.sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime())),
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
    return this.markdownLoader.getAllPostsMetadata().pipe(
      switchMap((posts: Post[]) => {
        const post = posts.find((p: Post) => p.id === id);
        
        if (!post) {
          return of(null);
        }

        return this.markdownLoader.getPost(post.fileName).pipe(
          catchError(error => {
            console.error(`Error cargando post ${id}:`, error);
            return of(null);
          })
        );
      }),
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
    return this.markdownLoader.getAllPostsMetadata().pipe(
      map((posts: Post[]) => posts.some((p: Post) => p.id === id)),
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
    return this.getAllPosts().pipe(
      map((posts: Post[]) => {
        const term = searchTerm.toLowerCase();
        return posts.filter((post: Post) => 
          post.title.toLowerCase().includes(term) ||
          post.summary.toLowerCase().includes(term) ||
          (post.tags && post.tags.some((tag: string) => tag.toLowerCase().includes(term)))
        );
      })
    );
  }

  /**
   * Obtiene posts por tag
   */
  getPostsByTag(tag: string): Observable<Post[]> {
    return this.getAllPosts().pipe(
      map((posts: Post[]) => posts.filter((post: Post) => 
        post.tags && post.tags.includes(tag.toLowerCase())
      ))
    );
  }

  /**
   * Obtiene posts por categoría
   */
  getPostsByCategory(category: string): Observable<Post[]> {
    if (category === 'todos') {
      return this.getAllPosts();
    }
    
    return this.getAllPosts().pipe(
      map((posts: Post[]) => posts.filter((post: Post) => 
        post.category === category
      ))
    );
  }
}