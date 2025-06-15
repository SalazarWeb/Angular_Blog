import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, forkJoin, switchMap } from 'rxjs';
import { Post, PostMetadata } from '../interfaces/post.interface';

declare const require: any;

interface PostIndex {
  id: string;
  fileName: string;
}

@Injectable({
  providedIn: 'root'
})
export class MarkdownLoaderService {
  private frontMatter: any;
  private postsCache: Post[] | null = null;
  private http = inject(HttpClient);

  constructor() {
    this.frontMatter = require('front-matter');
  }

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
          console.error(`Error parseando front-matter en ${fileName}:`, error);
          
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
        console.error(`Error completo cargando post ${fileName}:`, error);
        return of({
          id: fileName.replace('.md', ''),
          fileName,
          content: 'Error cargando contenido',
          title: 'Error',
          date: new Date().toISOString(),
          summary: 'No se pudo cargar el post',
          tags: [],
          author: 'Sistema',
          category: '',
          subcategory: '',
          coverImage: ''
        } as Post);
      })
    );
  }

  getAllPostsMetadata(): Observable<Post[]> {
    if (this.postsCache) {
      return of(this.postsCache);
    }

    // Cargar el índice de posts
    return this.http.get<PostIndex[]>('/assets/posts-index.json').pipe(
      switchMap(postsIndex => {
        // Crear observables para cargar los metadatos de cada post
        const postMetadataRequests = postsIndex.map(postInfo => 
          this.getPostContent(postInfo.fileName).pipe(
            map(content => {
              try {
                const parsed = this.frontMatter(content);
                const metadata = parsed.attributes as PostMetadata;
                
                return {
                  id: postInfo.id,
                  fileName: postInfo.fileName,
                  title: metadata.title || 'Sin título',
                  date: metadata.date || new Date().toISOString(),
                  summary: metadata.summary || '',
                  tags: metadata.tags || [],
                  author: metadata.author || 'Anónimo',
                  category: metadata.category || '',
                  subcategory: metadata.subcategory || '',
                  coverImage: metadata.coverImage || ''
                } as Post;
              } catch (error) {
                console.error(`Error parseando metadatos de ${postInfo.fileName}:`, error);
                return {
                  id: postInfo.id,
                  fileName: postInfo.fileName,
                  title: postInfo.fileName.replace('.md', '').replace(/-/g, ' '),
                  date: new Date().toISOString(),
                  summary: 'Error cargando metadatos',
                  tags: [],
                  author: 'Sistema',
                  category: '',
                  subcategory: '',
                  coverImage: ''
                } as Post;
              }
            }),
            catchError(error => {
              console.error(`Error cargando ${postInfo.fileName}:`, error);
              return of({
                id: postInfo.id,
                fileName: postInfo.fileName,
                title: 'Error',
                date: new Date().toISOString(),
                summary: 'No se pudo cargar el post',
                tags: [],
                author: 'Sistema',
                category: '',
                subcategory: '',
                coverImage: ''
              } as Post);
            })
          )
        );

        return forkJoin(postMetadataRequests);
      }),
      map(posts => {
        this.postsCache = posts;
        return posts;
      }),
      catchError(error => {
        console.error('Error cargando índice de posts:', error);
        const fallbackPosts = [
          {
            id: 'post-de-prueba',
            title: 'Del Síndrome del Impostor a Mentor: Mi Transformación en 2 Años',
            date: '2025-06-16',
            summary: 'Cómo pasé de sentir que no merecía estar en tech a ayudar a otros desarrolladores a encontrar su camino en la industria.',
            fileName: 'post-de-prueba.md'
          },
          {
            id: 'introduccion',
            title: 'Bienvenido al Mundo del Desarrollo Web Moderno',
            date: '2025-06-15',
            summary: 'Una introducción apasionante al universo del desarrollo web y las tecnologías que están transformando la manera en que construimos aplicaciones.',
            fileName: 'introduccion.md'
          },
          {
            id: 'angular-tips',
            title: '5 Tips Esenciales para Dominar Angular como un Pro',
            date: '2025-06-14',
            summary: 'Descubre los secretos que todo desarrollador Angular debería conocer para escribir código más limpio, eficiente y mantenible.',
            fileName: 'angular-tips.md'
          },
          {
            id: 'mi-primer-hackathon',
            title: 'Mi Primer Hackathon: 48 Horas que Cambiaron mi Carrera',
            date: '2025-06-13',
            summary: 'La historia de cómo un fin de semana de programación intensiva me enseñó más sobre desarrollo y colaboración que meses de estudio solitario.',
            fileName: 'mi-primer-hackathon.md'
          },
          {
            id: 'css-grid-vs-flexbox',
            title: 'CSS Grid vs Flexbox: La Batalla Definitiva (Spoiler: Ambos Ganan)',
            date: '2025-06-12',
            summary: 'Descubre cuándo usar cada herramienta de layout y por qué la combinación de ambas es el superpoder que todo frontend developer necesita.',
            fileName: 'css-grid-vs-flexbox.md'
          }
        ];
        this.postsCache = fallbackPosts;
        return of(fallbackPosts);
      })
    );
  }

  /**
   * Invalida la caché de posts para forzar una recarga
   */
  clearCache(): void {
    this.postsCache = null;
  }
}