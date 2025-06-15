import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FilterService } from './core/services/filter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AngularBlog';
  selectedCategory = 'todos';

  constructor(
    private titleService: Title,
    private router: Router,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Dazaji Blog');
    
    // Suscribirse a cambios de categoría
    this.filterService.selectedCategory$.subscribe(category => {
      this.selectedCategory = category;
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterService.setSelectedCategory(category);
    console.log('Categoría seleccionada:', category);
  }

  goToHome() {
    this.router.navigate(['/']);
    this.selectedCategory = 'todos';
    this.filterService.setSelectedCategory('todos');
  }
}
