import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-markdown-renderer',
  templateUrl: './markdown-renderer.component.html',
  styleUrls: ['./markdown-renderer.component.css']
})
export class MarkdownRendererComponent implements OnInit {
  @Input() content: string = '';
  sanitizedHtml: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.updateContent();
  }

  ngOnChanges(): void {
    this.updateContent();
  }

  private updateContent(): void {
    if (this.content) {
      this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(this.content);
    }
  }
}
