import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsApiService } from '../../services/news-api.service'
import { query } from '@angular/animations';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})

export class IndexPage implements OnInit {

  articles: any[] = [];

  constructor(
    private router: Router,
    private newsServices : NewsApiService
  ) { }

  async ngOnInit() {
    // Cargar datos almacenados localmente
    const cachedArticles = await this.loadCachedArticles();
    if (cachedArticles) {
      this.articles = cachedArticles;
    } else {
      // Si no hay datos en el caché, realiza la solicitud al servicio
      this.newsServices.getTopHeadlines().subscribe(response => {
        this.articles = response.articles;
        // Guarda los datos en el almacenamiento local
        this.saveArticlesToCache(this.articles);
      });
    }
  }

  search(event: any) {
    const query = event.target.value.toLowerCase();
    if (query === '') {
      // Si el campo de búsqueda está vacío, mostrar las noticias principales
      this.newsServices.getTopHeadlines().subscribe(response => {
        this.articles = response.articles;
        // Opcional: puedes actualizar el caché si es necesario
        this.saveArticlesToCache(this.articles);
      });
    } else {
      // Si hay un término de búsqueda, realizar la búsqueda
      this.newsServices.searchNews(query).subscribe(response => {
        this.articles = response.articles;
        // Opcional: puedes actualizar el caché si es necesario
        this.saveArticlesToCache(this.articles);
      });
    }
  }

  goView(article: any){
    const query = article.title.split(' ').slice(0, 5).join(' '); // Primeras 5 palabras del título
    this.router.navigate(['/details'], { queryParams: { query } });
  }

  // Función para cargar datos del almacenamiento local
  async loadCachedArticles(): Promise<any[] | null> {
    const cachedData = localStorage.getItem('cachedArticles'); // O utiliza un servicio de almacenamiento
    return cachedData ? JSON.parse(cachedData) : null;
  }

  // Función para guardar datos en el almacenamiento local
  saveArticlesToCache(articles: any[]): void {
    localStorage.setItem('cachedArticles', JSON.stringify(articles)); // O utiliza un servicio de almacenamiento
  }

}
