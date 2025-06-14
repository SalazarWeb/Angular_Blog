import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AngularBlog';
  selectedCategory = 'all';

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // Establecer el título fijo de la aplicación
    this.titleService.setTitle('AngularBlog');
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    console.log('Categoría seleccionada:', category);
  }
}
