import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Post } from '../../../core/interfaces/post.interface';
import { PostService } from '../../../core/services/post.service';
import { FilterService } from '../../../core/services/filter.service';
import { ApiResponse } from '../../../core/services/api-post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // Estados para la paginación
  posts: Post[] = [];
  loading = false;
  loadingMore = false;
  hasMore = false;
  currentPage = 1;
  totalPosts = 0;
  
  // Estados para filtros y búsqueda
  searchTerm: string = '';
  currentCategory: string = 'todos';
  isSearchMode = false;
  
  private subscription: Subscription = new Subscription();

  constructor(
    private postService: PostService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.currentCategory = this.filterService.getSelectedCategory();
    this.loadInitialPosts();
     
    const filterSubscription = this.filterService.selectedCategory$.subscribe(category => {
      if (this.currentCategory !== category) {
        this.currentCategory = category;
         
        if (this.searchTerm.trim()) {
          this.searchTerm = '';
        }
         
        if (category === 'todos') {
          this.resetAndLoadPosts();
        } else {
          this.filterPostsByCategory(category);
        }
      }
    });
    this.subscription.add(filterSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
 
  loadInitialPosts(): void {
    if (this.isSearchMode) return;
    
    this.loading = true;
    this.currentPage = 1;
    
    // Usar paginación para cargar los primeros 6 posts
    this.postService.getPostsPaginated(1, 6).subscribe({
      next: (response: ApiResponse<Post>) => {
        this.posts = response.posts || [];
        this.hasMore = response.hasMore || false;
        this.totalPosts = response.total || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando posts iniciales:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Carga más posts (4 adicionales)
   */
  loadMorePosts(): void {
    if (this.loadingMore || !this.hasMore || this.isSearchMode) return;
    
    this.loadingMore = true;
    
    let nextPage: number;
    if (this.posts.length === 6) { 
      nextPage = 2;
    } else { 
      nextPage = Math.floor((this.posts.length - 6) / 4) + 3;
    }
     
    this.postService.getPostsPaginated(nextPage, 4).subscribe({
      next: (response: ApiResponse<Post>) => {
        if (response.posts && response.posts.length > 0) {
          this.posts = [...this.posts, ...response.posts];
          this.hasMore = response.hasMore || false;
          this.totalPosts = response.total || this.totalPosts;
        } else {
          this.hasMore = false;
        }
        
        this.loadingMore = false;
      },
      error: (error) => {
        console.error('Error cargando más posts:', error);
        this.loadingMore = false;
      }
    });
  }

  /**
   * Resetea la paginación y carga posts desde el inicio
   */
  resetAndLoadPosts(): void {
    this.posts = [];
    this.currentPage = 1;
    this.hasMore = false;
    this.isSearchMode = false;
    this.loadInitialPosts();
  }

  /**
   * Maneja la búsqueda de posts
   */
  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.isSearchMode = true;
      this.loading = true;
      
      this.postService.searchPosts(this.searchTerm).subscribe({
        next: (posts: Post[]) => {
          this.posts = posts;
          this.hasMore = false; // No hay paginación en búsqueda
          this.loading = false;
        },
        error: (error) => {
          console.error('Error en búsqueda:', error);
          this.loading = false;
        }
      });
    } else {
      this.resetAndLoadPosts();
    }
  }

  /**
   * Filtra posts por categoría
   */
  filterPostsByCategory(category: string): void {
    if (this.searchTerm.trim()) return;
    
    this.currentCategory = category;
    this.isSearchMode = false;
    this.loading = true;
    
    if (category === 'todos') {
      this.resetAndLoadPosts();
    } else {
      // Para filtros por categoría, cargar todos los posts de esa categoría
      this.postService.getPostsByCategory(category).subscribe({
        next: (posts: Post[]) => {
          this.posts = posts;
          this.hasMore = false; 
          this.loading = false;
        },
        error: (error) => {
          console.error('Error filtrando por categoría:', error);
          this.loading = false;
        }
      });
    }
  }
  
  /**
   * Maneja clic en tags
   */
  onTagClick(tag: string): void {
    this.isSearchMode = true;
    this.loading = true;
    this.searchTerm = `tag:${tag}`;
    
    this.postService.getPostsByTag(tag).subscribe({
      next: (posts: Post[]) => {
        this.posts = posts;
        this.hasMore = false; // No hay paginación en filtros por tag
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtrando por tag:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Limpia la búsqueda y vuelve al estado inicial
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.currentCategory = 'todos';
    this.filterService.setSelectedCategory('todos');
    this.resetAndLoadPosts();
  }

  /**
   * Calcula el tiempo de lectura
   */
  getReadingTime(post: Post): number {
    if (!post.content) return 1;
    const wordsPerMinute = 200;
    const textContent = post.content.replace(/<[^>]*>/g, '');
    const words = textContent.split(/\s+/).filter(word => word.length > 0).length;
    return Math.ceil(words / wordsPerMinute);
  }

  /**
   * Función de tracking para ngFor para mejorar rendimiento
   */
  trackByPostId(index: number, post: Post): string {
    return post.id;
  }
}
