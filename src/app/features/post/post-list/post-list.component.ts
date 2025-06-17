import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
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
  posts: Post[] = [];
  loading = false;
  loadingMore = false;
  hasMore = false;
  currentPage = 1;
  totalPosts = 0;
  searchTerm: string = '';
  currentCategory: string = 'todos';
  isSearchMode = false; 
  searchCurrentPage = 1;
  searchHasMore = false;
  searchTotalPosts = 0;
  
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

  loadMorePosts(): void {
    if (this.loadingMore) return;
    
    if (this.isSearchMode) {
      this.loadMoreSearchResults();
    } else {
      this.loadMoreNormalPosts();
    }
  }

  private loadMoreNormalPosts(): void {
    if (!this.hasMore) return;
    
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
          
          console.log(`Cargando más posts - Página ${nextPage}, Posts actuales: ${this.posts.length}`);
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

  private loadMoreSearchResults(): void {
    if (!this.searchHasMore || !this.searchTerm.trim()) return;
    
    this.loadingMore = true;
    
    // Calcular la siguiente página para búsqueda
    let nextPage: number;
    if (this.posts.length === 6) {
      nextPage = 2;
    } else {
      nextPage = Math.floor((this.posts.length - 6) / 4) + 3;
    }
    
    this.postService.searchPosts(this.searchTerm, nextPage, 4).subscribe({
      next: (response: ApiResponse<Post>) => {
        if (response.posts && response.posts.length > 0) {
          this.posts = [...this.posts, ...response.posts];
          this.searchHasMore = response.hasMore || false;
          this.searchTotalPosts = response.total || this.searchTotalPosts;
          
          console.log(`🔍 Cargando más resultados de búsqueda - Página ${nextPage}, Resultados actuales: ${this.posts.length}`);
        } else {
          this.searchHasMore = false;
        }
        
        this.loadingMore = false;
      },
      error: (error) => {
        console.error('Error cargando más resultados de búsqueda:', error);
        this.loadingMore = false;
      }
    });
  }
 
  resetAndLoadPosts(): void {
    this.posts = [];
    this.currentPage = 1;
    this.hasMore = false;
    this.isSearchMode = false;
    this.loadInitialPosts();
  }
 
  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.isSearchMode = true;
      this.loading = true;
      this.searchCurrentPage = 1;
      
      this.postService.searchPosts(this.searchTerm, 1, 6).subscribe({
        next: (response: ApiResponse<Post>) => {
          this.posts = response.posts || [];
          this.searchHasMore = response.hasMore || false;
          this.searchTotalPosts = response.total || 0;
          this.loading = false;
          
          console.log(`🔍 Búsqueda "${this.searchTerm}" - Encontrados ${this.posts.length} de ${this.searchTotalPosts} posts`);
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
 
  filterPostsByCategory(category: string): void {
    if (this.searchTerm.trim()) return;
    
    this.currentCategory = category;
    this.isSearchMode = false;
    this.loading = true;
    
    if (category === 'todos') {
      this.resetAndLoadPosts();
    } else { 
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
 
  clearSearch(): void {
    this.searchTerm = '';
    this.currentCategory = 'todos';
    this.filterService.setSelectedCategory('todos');
    this.resetAndLoadPosts();
  }

  trackByPostId(index: number, post: Post): string {
    return post.id;
  }
}
