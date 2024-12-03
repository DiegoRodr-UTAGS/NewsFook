import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsApiService } from '../../services/news-api.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  article: any;
  loading: boolean = true;
  detailsData: any;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsApiService
  ) {}

  ngOnInit() {
    // Cargar datos almacenados en localStorage
    const cachedData = localStorage.getItem('detailsData');
    if (cachedData) {
      this.detailsData = JSON.parse(cachedData);
    } else {
      this.detailsData = { message: 'No hay datos disponibles.' };
    }

    

    // Obtener el parámetro "query" de la URL
    this.route.queryParams.subscribe(params => {
      const query = params['query']; // Extraer el valor del parámetro

      if (query) {
        // Llamar a la API para obtener los detalles
        this.newsService.getArticleDetails(query).subscribe(
          response => {
            if (response?.articles && response.articles.length > 0) {
              this.article = response.articles[0]; // Obtener el primer resultado
            } else {
              console.warn('No se encontraron artículos para la consulta:', query);
              this.article = null; // Manejar el caso de no encontrar artículos
            }
            this.loading = false;
          },
          error => {
            console.error('Error en la llamada a la API:', error);
            this.loading = false;
          }
        );
      } else {
        console.warn('No se recibió parámetro de consulta.');
        this.loading = false;
      }
    });
  }

  saveData(data: any) {
    // Guarda los datos en localStorage para offline
    localStorage.setItem('detailsData', JSON.stringify(data));
  }
}


