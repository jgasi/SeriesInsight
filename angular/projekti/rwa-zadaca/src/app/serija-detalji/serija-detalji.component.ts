import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PocetnaService } from '../servisi/pocetna.service';
import { SerijaService } from '../servisi/serije.service';
import { CookieService } from 'ngx-cookie-service';
import { AutentifikacijaService } from '../servisi/autentifikacija.service';

@Component({
  selector: 'app-serija-detalji',
  templateUrl: './serija-detalji.component.html',
  styleUrls: ['./serija-detalji.component.scss'],
})
export class SerijaDetaljiComponent implements OnInit {
  detaljiSerije: any;
  githubKorisnik: any;
  spremljeneSerije: any[] = [];
  spremljeneSezone: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private pocetnaService: PocetnaService,
    private serijaService: SerijaService,
    private cookieService: CookieService,
    private autentifikacijaService: AutentifikacijaService
  ) {}

  ngOnInit(): void {
    const idSerije = +this.route.snapshot.params['id'];
    console.log(idSerije);

    if (idSerije) {
      this.pocetnaService.dajDetaljeSerije(idSerije).subscribe((detalji) => {
        this.detaljiSerije = detalji;
      });
    } else {
      console.error('ID serije nije pravilno dohvaćen.');
    }
  }

  isKorisnikPrijavljen(): boolean {
    if (this.autentifikacijaService.jePrijavljen()) {
      return true;
    } else if (this.jeGitHubPrijavljen()) {
      return true;
    } else {
      return false;
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

  private dohvatiKorisnickoImeIzKolacica(): string | null {
    const korisnickoIme = this.cookieService.get('korimePrijave');
    return korisnickoIme || null;
  }

  spremiSeriju() {
    const spremiGumb = document.getElementById('spremiSerijuGumb');

    if (spremiGumb) {
      spremiGumb.innerText = 'Spremljeno!';

      setTimeout(() => {
        spremiGumb.innerText = 'Spremi';
      }, 2000);
    }
    if (this.jeGitHubPrijavljen()) {
      const podaciZaSpremanje = {
        name: this.detaljiSerije.name,
        overview: this.detaljiSerije.overview,
        number_of_seasons: this.detaljiSerije.number_of_seasons,
        number_of_episodes: this.detaljiSerije.number_of_episodes,
        popularity: this.detaljiSerije.popularity,
        poster_path: `https://image.tmdb.org/t/p/w500${this.detaljiSerije.poster_path}`,
        homepage: this.detaljiSerije.homepage,
        TMDB_id_serije: this.detaljiSerije.id,
      };

      const spremljeneSerije =
        JSON.parse(localStorage.getItem('serijePodaci')!) || [];

      spremljeneSerije.push(podaciZaSpremanje);

      localStorage.setItem('serijePodaci', JSON.stringify(spremljeneSerije));
      console.log('Serija spremljena u localStorage!');

      this.spremiSezone();
    } else {
      const korisnickoIme = this.dohvatiKorisnickoImeIzKolacica();
      if (this.detaljiSerije) {
        const podaciZaSpremanje = {
          naziv: this.detaljiSerije.name,
          opis: this.detaljiSerije.overview,
          broj_sezona: this.detaljiSerije.number_of_seasons,
          broj_epizoda: this.detaljiSerije.number_of_episodes,
          popularnost: this.detaljiSerije.popularity,
          slika: `https://image.tmdb.org/t/p/w500${this.detaljiSerije.poster_path}`,
          poveznica: this.detaljiSerije.homepage,
          TMDB_id_serije: this.detaljiSerije.id,
          korime: korisnickoIme,
        };

        this.serijaService
          .spremiSeriju(podaciZaSpremanje)
          .subscribe((response) => {
            console.log('Serija spremljena u bazu!', response);
            this.spremiSezone();
          });
      }
    }
  }

  spremiSezone() {
    if (this.jeGitHubPrijavljen()) {
      if (
        this.detaljiSerije &&
        this.detaljiSerije.seasons &&
        Array.isArray(this.detaljiSerije.seasons)
      ) {
        const podaciZaSpremanjeSezone = this.detaljiSerije.seasons.map(
          (sezona: any) => ({
            name: sezona.name,
            overview: sezona.overview,
            episode_count: sezona.episode_count,
            poster_path: `https://image.tmdb.org/t/p/w500${sezona.poster_path}`,
            serija_id: this.detaljiSerije.id,
          })
        );

        const spremljeneSezone =
          JSON.parse(localStorage.getItem('sezonePodaci')!) || [];

        spremljeneSezone.push(...podaciZaSpremanjeSezone);

        localStorage.setItem('sezonePodaci', JSON.stringify(spremljeneSezone));
        console.log('Sezone spremljene u localStorage!');
      } else {
        console.error('Nema informacija o sezonama u odgovoru.');
      }
    } else {
      if (
        this.detaljiSerije &&
        this.detaljiSerije.seasons &&
        Array.isArray(this.detaljiSerije.seasons)
      ) {
        this.detaljiSerije.seasons.forEach((sezona: any) => {
          const podaciZaSpremanjeSezone = {
            naziv: sezona.name,
            opis: sezona.overview,
            broj_epizoda: sezona.episode_count,
            slika: `https://image.tmdb.org/t/p/w500${sezona.poster_path}`,
            serija_id: this.detaljiSerije.id,
          };

          this.serijaService.spremiSezone(podaciZaSpremanjeSezone).subscribe(
            (response) => {
              console.log('Sezona spremljena u bazu!', response);
              // Dodajte logiku ili poruke prema potrebi
            },
            (error) => {
              console.error('Greška pri spremanju podataka o sezonama.', error);
            }
          );
        });
      } else {
        console.error('Nema informacija o sezonama u odgovoru.');
      }
    }
  }
}
