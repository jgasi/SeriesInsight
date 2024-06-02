import { Component, OnInit } from '@angular/core';
import { FavoritiService } from '../servisi/favoriti.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AutentifikacijaService } from '../servisi/autentifikacija.service';

@Component({
  selector: 'app-favoriti',
  templateUrl: './favoriti.component.html',
  styleUrls: ['./favoriti.component.scss'],
})
export class FavoritiComponent implements OnInit {
  favoriti: any[] = [];
  githubKorisnik: any;

  constructor(
    private favoritiService: FavoritiService,
    private cookieService: CookieService,
    private router: Router,
    private autentifikacijaService: AutentifikacijaService
  ) {}

  ngOnInit(): void {
    if (this.jeGitHubPrijavljen()) {
      const spremljeneSerije =
        JSON.parse(localStorage.getItem('serijePodaci')!) || [];
      this.favoriti = spremljeneSerije;
    } else if (this.autentifikacijaService.jePrijavljen()) {
      const korisnickoIme = this.dohvatiKorisnickoImeIzKolacica();
      if (korisnickoIme) {
        this.favoritiService.dohvatiFavoritZaKorisnika(korisnickoIme).subscribe(
          (data) => {
            this.favoriti = data;
          },
          (error) => {
            console.error('Greška prilikom dohvaćanja favorita:', error);
          }
        );
      }
    } else {
      alert('Niste prijavljeni.');
      this.router.navigate(['/pocetna']);
    }
  }

  private dohvatiKorisnickoImeIzKolacica(): string | null {
    const korisnickoIme = this.cookieService.get('korimePrijave');
    return korisnickoIme || null;
  }

  private jeGitHubPrijavljen(): boolean {
    const spremljeniPodaci = localStorage.getItem('korisnikPodaci');
    if (spremljeniPodaci) {
      this.githubKorisnik = JSON.parse(spremljeniPodaci);
      return true;
    } else {
      return false;
    }
  }

  navigirajNaDetalje(favoritId: number | undefined): void {
    if (favoritId !== undefined) {
      this.router.navigate(['/favorit-detalji', favoritId]);
    } else {
      console.error('ID favorita nije pravilno postavljen.');
    }
  }
}
