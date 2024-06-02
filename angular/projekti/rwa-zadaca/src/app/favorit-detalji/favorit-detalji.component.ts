import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FavoritiService } from '../servisi/favoriti.service';
import { AutentifikacijaService } from '../servisi/autentifikacija.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorit-detalji',
  templateUrl: './favorit-detalji.component.html',
  styleUrls: ['./favorit-detalji.component.scss'],
})
export class FavoritDetaljiComponent implements OnInit {
  favoritId: number | undefined;
  favorit: any;
  githubKorisnik: any;

  constructor(
    private route: ActivatedRoute,
    private favoritService: FavoritiService,
    private autentifikacijaService: AutentifikacijaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.jeGitHubPrijavljen()) {
      const idParam = this.route.snapshot.paramMap.get('id');

      if (idParam !== null) {
        this.favoritId = +idParam;

        const spremljeniPodaci = localStorage.getItem('serijePodaci');
        if (spremljeniPodaci) {
          const favoritiIzLocalStorage = JSON.parse(spremljeniPodaci);

          this.favorit = favoritiIzLocalStorage.find(
            (f: { TMDB_id_serije: number }) =>
              f.TMDB_id_serije === this.favoritId
          );

          if (!this.favorit) {
            console.error(
              `Nije pronađen favorit za TMDB_id_serije ${this.favoritId}`
            );
          } else {
            this.favorit.seasons = this.dohvatiSezoneZaSeriju(this.favoritId);
          }
        } else {
          console.error('Podaci o serijama nisu pronađeni u localStorage-u.');
        }
      } else {
        console.error('ID favorita nije pravilno postavljen u URL-u.');
      }
    } else if (this.autentifikacijaService.jePrijavljen()) {
      const idParam = this.route.snapshot.paramMap.get('id');

      if (idParam !== null) {
        this.favoritId = +idParam;

        this.favoritService.getDetaljiFavorita(this.favoritId).subscribe(
          (favorit) => {
            this.favorit = favorit;
          },
          (error) => {
            console.error('Greška prilikom dohvata detalja favorita', error);
          }
        );
      } else {
        console.error('ID favorita nije pravilno postavljen u URL-u.');
      }
    } else {
      alert('Niste prijavljeni.');
      this.router.navigate(['/pocetna']);
    }
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

  dohvatiSezoneZaSeriju(serijaId: number): any[] {
    const spremljeniPodaciSezone = localStorage.getItem('sezonePodaci');
    if (spremljeniPodaciSezone) {
      const sezone = JSON.parse(spremljeniPodaciSezone);
      return sezone.filter((sezona: any) => sezona.serija_id === serijaId);
    } else {
      console.error('Podaci o sezonama nisu pronađeni u localStorage-u.');
      return [];
    }
  }
}
