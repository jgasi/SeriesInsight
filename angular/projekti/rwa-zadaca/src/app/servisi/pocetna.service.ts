import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PocetnaService {
  private restServis = environment.restServis;

  constructor(private http: HttpClient) {}

  dajSerije(stranica: number, trazi: string): Observable<any> {
    const url = `${this.restServis}/pocetna?stranica=${stranica}&trazi=${trazi}`;
    return this.http.post(url, {});
  }

  dajDetaljeSerije(idSerije: number): Observable<any> {
    const url = `${this.restServis}/detalji-serije/${idSerije}`;
    return this.http.get(url);
  }
}
