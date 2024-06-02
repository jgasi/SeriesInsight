import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { KorisniciService } from '../servisi/korisnici.service';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.scss'],
})
export class PrijavaComponent implements OnInit {
  korisnickoIme: string = '';
  lozinka: string = '';
  greskaPoruka: string = '';
  korisnikk: any;
  dohvaceniKorisnik: any;

  constructor(
    private korisniciService: KorisniciService,
    private router: Router,
    private recaptchaV3Service: ReCaptchaV3Service,
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  public send(form: NgForm): void {
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }

    this.recaptchaV3Service
      .execute('importantAction')
      .subscribe((token: string) => {
        console.debug(`Token [${token}] generated`);

        this.posaljiRecaptchaTokenNaServer(token);

        this.prijavi();
      });
  }
  private posaljiRecaptchaTokenNaServer(token: string): void {
    const url = 'http://localhost:12012/provjeri-recaptcha';

    this.httpClient
      .post(
        url,
        { recaptchaToken: token },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .subscribe(
        (response) => {
          console.log('Uspješno poslan ReCAPTCHA token na server.', response);
        },
        (error) => {
          console.error(
            'Greška prilikom slanja ReCAPTCHA tokena na server.',
            error.error
          );
        }
      );
  }

  ngOnInit(): void {}

  prijavi(): void {
    this.korisniciService
      .prijaviKorisnika(this.korisnickoIme, this.lozinka)
      .subscribe(
        (rezultat) => {
          console.log('Tocni podaci.');

          this.obrisiLocalStoragePodatke();
          this.postaviTestniKolacic();

          this.korisniciService.dohvatiKorisnika(this.korisnickoIme).subscribe(
            (dohvaceniKorisnik) => {
              if (dohvaceniKorisnik.dvorazinskaAutentifikacija) {
                this.router.navigate(['/totp-provjera']);
              } else {
                this.postaviKolacic();
                this.router.navigate(['/pocetna']);
              }
            },
            (error) => {
              console.error('Greška prilikom dohvaćanja korisnika:', error);
            }
          );
        },
        (error) => {
          console.clear();
          console.log('Krivi podaci! (Unauthorized)');
          this.greskaPoruka = 'Netočni podaci';
        }
      );
  }

  postaviKolacic(): void {
    const datumIsteka = new Date();
    datumIsteka.setTime(datumIsteka.getTime() + 24 * 60 * 60 * 1000);

    document.cookie =
      'korimePrijave=' +
      this.korisnickoIme +
      '; expires=' +
      datumIsteka.toUTCString() +
      '; path=/';
    console.log('Kolačić postavljen!');
  }

  obrisiLocalStoragePodatke(): void {
    window.localStorage.removeItem('korisnikPodaci');
    window.localStorage.clear();
  }

  postaviTestniKolacic(): void {
    const datumIsteka = new Date();
    datumIsteka.setTime(datumIsteka.getTime() + 24 * 60 * 60 * 1000);

    document.cookie =
      'korimeProvjere=' +
      this.korisnickoIme +
      '; expires=' +
      datumIsteka.toUTCString() +
      '; path=/';
  }

  private dohvatiKorisnickoImeIzKolacica(): string | null {
    const korisnickoIme = this.cookieService.get('korimePrijave');
    return korisnickoIme || null;
  }

  public GithubLogin() {
    this.router.navigate(['/github-prijava']);
  }
}
