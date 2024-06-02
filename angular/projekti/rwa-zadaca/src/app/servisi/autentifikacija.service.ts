import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { KorisniciService } from './korisnici.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AutentifikacijaService {
  constructor(
    private cookieService: CookieService,
    private korisniciService: KorisniciService
  ) {}

  jePrijavljen(): boolean {
    return this.cookieService.check('korimePrijave');
  }

  isAdmin(): Observable<boolean> {
    const korisnickoIme = this.dohvatiKorisnickoImeIzKolacica();

    if (!korisnickoIme) {
      return of(false);
    }

    return this.korisniciService.dohvatiKorisnika(korisnickoIme).pipe(
      map((korisnik) => korisnik.tip_korisnika_id === 2),
      catchError(() => of(false))
    );
  }

  private dohvatiKorisnickoImeIzKolacica(): string | null {
    const korisnickoIme = this.cookieService.get('korimePrijave');
    return korisnickoIme || null;
  }
}
