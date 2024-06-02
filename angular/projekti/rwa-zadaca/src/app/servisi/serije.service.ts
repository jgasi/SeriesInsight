import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SerijaService {
  private restServis = environment.restServis;

  constructor(private http: HttpClient) {}

  spremiSeriju(serijaData: any): Observable<any> {
    return this.http.post(`${this.restServis}/baza/favoriti`, serijaData);
  }

  async dohvatiSezone(idSerije: string): Promise<any> {
    return this.http
      .post(`${this.restServis}/serijaDetalji?id=${idSerije}`, {})
      .toPromise();
  }

  spremiSezone(podaci: any): Observable<any> {
    return this.http.post(`${this.restServis}/spremiSezone`, podaci);
  }
}
