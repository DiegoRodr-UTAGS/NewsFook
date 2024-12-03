import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class NewsApiService {
  private apiKey = '8387188118074c75ba0099af0380e028';
  private apiURL = 'https://newsapi.org/v2';

  constructor(
    private http: HttpClient
  ) {}

  getTopHeadlines(): Observable<any> {
    return this.http.get(`${this.apiURL}/top-headlines?country=us&apiKey=${this.apiKey}`);
  }
  searchNews(query: string): Observable<any> {
    return this.http.get(`${this.apiURL}/everything?q=${query}&apiKey=${this.apiKey}`);
  }

  
  getArticleDetails(query: string): Observable<any> {
    return this.http.get(`${this.apiURL}/everything?q=${query}&apiKey=${this.apiKey}`)
  }
}


