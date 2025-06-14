import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
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
    const posts = this.markdownLoader.getAllPostsMetadata();
    // Ordenar por fecha (más recientes primero)
    return of(posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }

  /**
   * Obtiene un post específico por ID
   */
  getPostById(id: string): Observable<Post | null> {
    const posts = this.markdownLoader.getAllPostsMetadata();
    const post = posts.find(p => p.id === id);
    
    if (!post) {
      return of(null);
    }

    return this.markdownLoader.getPost(post.fileName);
  }

  /**
   * Verifica si un post existe
   */
  exists(id: string): boolean {
    const posts = this.markdownLoader.getAllPostsMetadata();
    return posts.some(p => p.id === id);
  }

  /**
   * Busca posts por término
   */
  searchPosts(searchTerm: string): Observable<Post[]> {
    return this.getAllPosts().pipe(
      map(posts => posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      ))
    );
  }

  /**
   * Obtiene posts por tag
   */
  getPostsByTag(tag: string): Observable<Post[]> {
    return this.getAllPosts().pipe(
      map(posts => posts.filter(post => 
        post.tags?.includes(tag)
      ))
    );
  }
}