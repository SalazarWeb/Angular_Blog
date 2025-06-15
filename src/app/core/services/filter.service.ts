import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private selectedCategorySubject = new BehaviorSubject<string>('todos');
  public selectedCategory$: Observable<string> = this.selectedCategorySubject.asObservable();

  constructor() { }

  setSelectedCategory(category: string): void {
    this.selectedCategorySubject.next(category);
  }

  getSelectedCategory(): string {
    return this.selectedCategorySubject.value;
  }
}
