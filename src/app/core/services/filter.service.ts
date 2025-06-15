import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private selectedCategorySubject = new BehaviorSubject<string>('todos');
  public selectedCategory$: Observable<string> = this.selectedCategorySubject.asObservable().pipe(
    distinctUntilChanged() // Evita emisiones duplicadas
  );

  constructor() { }

  setSelectedCategory(category: string): void {
    // Validar que la categoría sea válida
    const validCategories = ['todos', 'tecnologia', 'experiencias', 'desarrollo-web'];
    const normalizedCategory = category?.toLowerCase()?.trim() || 'todos';
    
    if (validCategories.includes(normalizedCategory)) {
      this.selectedCategorySubject.next(normalizedCategory);
    } else {
      // Si la categoría no es válida, usar 'todos' por defecto
      this.selectedCategorySubject.next('todos');
    }
  }

  getSelectedCategory(): string {
    return this.selectedCategorySubject.value;
  }

  // Método para resetear el filtro
  resetFilter(): void {
    this.selectedCategorySubject.next('todos');
  }
}
