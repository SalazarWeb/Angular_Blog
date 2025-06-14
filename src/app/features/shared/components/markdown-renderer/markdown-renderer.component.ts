import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-markdown-renderer',
  templateUrl: './markdown-renderer.component.html',
  styleUrls: ['./markdown-renderer.component.css']
})
export class MarkdownRendererComponent implements OnInit {
  @Input() content: string = '';

  constructor() { }

  ngOnInit(): void {}
}
