import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, map, catchError, of } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { Post } from '../../../core/interfaces/post.interface';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post$: Observable<Post | null>;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private meta: Meta,
    private titleService: Title
  ) {
    this.post$ = this.route.params.pipe(
      switchMap(params => {
        const postId = params['id'];
        if (!postId) {
          this.router.navigate(['/']);
          return of(null);
        }
        
        this.loading = true;
        this.error = false;
        
        return this.postService.getPostById(postId).pipe(
          map(post => {
            this.loading = false;
            if (post) {
              this.updateMetaTags(post);
            } else {
              this.error = true;
            }
            return post;
          }),
          catchError(err => {
            console.error('Error cargando post:', err);
            this.loading = false;
            this.error = true;
            return of(null);
          })
        );
      })
    );
  }

  ngOnInit(): void {}

  private updateMetaTags(post: Post): void {
    this.titleService.setTitle('AngularBlog');
    
    // Actualizar meta tags
    this.meta.updateTag({ name: 'description', content: post.summary });
    this.meta.updateTag({ name: 'author', content: post.author || 'Anónimo' });
    
    // Open Graph tags para redes sociales
    this.meta.updateTag({ property: 'og:title', content: post.title });
    this.meta.updateTag({ property: 'og:description', content: post.summary });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    
    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: post.title });
    this.meta.updateTag({ name: 'twitter:description', content: post.summary });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  onTagClick(tag: string): void {
    this.router.navigate(['/'], { queryParams: { tag } });
  }
}
