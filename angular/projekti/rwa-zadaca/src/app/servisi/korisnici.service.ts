import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Korisnik } from './KorisniciI';

@Injectable({
  providedIn: 'root',
})
export class KorisniciService {
  private restServis = environment.restServis;

  constructor(private http: HttpClient) {}

  dohvatiKorisnike(): Observable<any[]> {
    const url = `${this.restServis}/baza/korisnici`;
    return this.http.get<any[]>(url);
  }

  prijaviKorisnika(korisnickoIme: string, lozinka: string): Observable<any> {
    const url = `${this.restServis}/prijava/${korisnickoIme}/${lozinka}`;
    return this.http.post(url, null, { responseType: 'text' });
  }

  dohvatiKorisnika(korisnickoIme: string): Observable<any> {
    const url = `${this.restServis}/baza/korisnici/${korisnickoIme}`;
    return this.http.get<any>(url);
  }

  azurirajKorisnika(korisnickoIme: string, podaci: any): Observable<any> {
    const url = `${this.restServis}/baza/korisnici/${korisnickoIme}`;
    return this.http.put(url, podaci);
  }

  registracijaKorisnika(tijelo: any): Observable<any> {
    return this.http.post<any>(`${this.restServis}/registracija`, tijelo);
  }

  obrisiKorisnika(korime: string): Observable<any> {
    const url = `${this.restServis}/baza/korisnici/${korime}`;
    return this.http.delete(url);
  }

  provjeriTOTP(korisnickoIme: any, totp: any): Observable<any> {
    const url = `${this.restServis}/provjeri-totp`;
    const body = { korisnickoIme, totp };

    return this.http.post(url, body);
  }
}
