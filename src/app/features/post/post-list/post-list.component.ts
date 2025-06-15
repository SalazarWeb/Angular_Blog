import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../../core/interfaces/post.interface';
import { PostService } from '../../../core/services/post.service';
import { FilterService } from '../../../core/services/filter.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts$: Observable<Post[]>;
  searchTerm: string = '';
  currentCategory: string = 'todos';

  constructor(
    private postService: PostService,
    private filterService: FilterService
  ) {
    this.posts$ = this.postService.getAllPosts();
  }

  ngOnInit(): void {
    this.loadPosts();
    
    this.filterService.selectedCategory$.subscribe(category => {
      this.currentCategory = category;
      this.filterPostsByCategory(category);
    });
  }

  loadPosts(): void {
    this.posts$ = this.postService.getAllPosts();
  }

  filterPostsByCategory(category: string): void {
    if (this.searchTerm.trim()) {
      return;
    }
    
    if (category === 'todos') {
      this.posts$ = this.postService.getAllPosts();
    } else {
      this.posts$ = this.postService.getPostsByCategory(category);
    }
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.posts$ = this.postService.searchPosts(this.searchTerm);
    } else {
      this.filterPostsByCategory(this.currentCategory);
    }
  }

  onTagClick(tag: string): void {
    this.posts$ = this.postService.getPostsByTag(tag);
    this.searchTerm = `tag:${tag}`;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.posts$ = this.postService.getAllPosts();
    this.currentCategory = 'todos';
    this.filterService.setSelectedCategory('todos');
  }

  getReadingTime(post: Post): number {
    if (!post.content) return 1;
    const wordsPerMinute = 200;
    const words = post.content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  }
}
