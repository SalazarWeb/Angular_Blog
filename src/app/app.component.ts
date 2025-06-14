import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularBlog';
  selectedCategory = 'all';

  selectCategory(category: string) {
    this.selectedCategory = category;
    // Aquí puedes agregar lógica para filtrar posts por categoría
    console.log('Categoría seleccionada:', category);
  }
}
