import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../../core/interfaces/post.interface';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts$: Observable<Post[]>;
  searchTerm: string = '';

  constructor(private postService: PostService) {
    this.posts$ = this.postService.getAllPosts();
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.posts$ = this.postService.getAllPosts();
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.posts$ = this.postService.searchPosts(this.searchTerm);
    } else {
      this.loadPosts();
    }
  }

  onTagClick(tag: string): void {
    this.posts$ = this.postService.getPostsByTag(tag);
    this.searchTerm = `tag:${tag}`;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadPosts();
  }
}
