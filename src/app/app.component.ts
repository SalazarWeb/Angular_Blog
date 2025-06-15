import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FilterService } from './core/services/filter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'AngularBlog';
  selectedCategory = 'todos';
  isCategoryDropdownOpen = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private titleService: Title,
    private router: Router,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Dazaji Blog');
    
    // Sincronizar estado inicial
    this.selectedCategory = this.filterService.getSelectedCategory();
    
    // Suscribirse a cambios de categoría con gestión de suscripciones
    const categorySubscription = this.filterService.selectedCategory$.subscribe(category => {
      this.selectedCategory = category;
    });
    this.subscription.add(categorySubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleCategoryDropdown() {
    this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;
  }

  closeCategoryDropdown() {
    this.isCategoryDropdownOpen = false;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterService.setSelectedCategory(category);
    this.closeCategoryDropdown();
  }

  getCategoryDisplayName(category: string): string {
    const categoryNames: { [key: string]: string } = {
      'todos': 'Todos',
      'tecnologia': 'Tecnología',
      'experiencias': 'Experiencias',
      'desarrollo-web': 'Desarrollo Web'
    };
    return categoryNames[category] || 'Todos';
  }

  goToHome() {
    this.router.navigate(['/']);
    this.selectedCategory = 'todos';
    this.filterService.setSelectedCategory('todos');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.category-dropdown');

    if (!clickedInside) {
      this.closeCategoryDropdown();
    }
  }
}
