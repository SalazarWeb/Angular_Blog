import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { MarkdownRendererComponent } from './features/shared/components/markdown-renderer/markdown-renderer.component';
import { PostListComponent } from './features/post/post-list/post-list.component';
import { PostDetailComponent } from './features/post/post-detail/post-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    MarkdownRendererComponent,
    PostListComponent,
    PostDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: PostListComponent },
      { path: 'post/:id', component: PostDetailComponent },
      { path: '**', redirectTo: '' }
    ]),
    MarkdownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
