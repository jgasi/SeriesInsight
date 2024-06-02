import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FavoritiService {
  private restServis = environment.restServis;

  constructor(private http: HttpClient) {}

  dohvatiFavoritZaKorisnika(korisnickoIme: string): Observable<any[]> {
    const url = `${this.restServis}/baza/favoritii/${korisnickoIme}`;
    return this.http.get<any[]>(url);
  }

  getDetaljiFavorita(favoritId: number): Observable<any> {
    const url = `${this.restServis}/baza/favoriti/${favoritId}`;
    return this.http.get<any>(url);
  }
}
