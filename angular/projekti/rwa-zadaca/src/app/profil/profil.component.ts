import { Component, OnInit } from '@angular/core';
import { KorisniciService } from '../servisi/korisnici.service';
import { CookieService } from 'ngx-cookie-service';
import { AutentifikacijaService } from '../servisi/autentifikacija.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  korisnik: any;
  selectedOption: boolean = true;

  imePattern = '[a-žA-Ž]+';
  prezimePattern = '[a-žA-Ž]+';
  lozinkaPattern = '[a-žA-Ž0-9]{3,}';
  adresaPattern = '[a-žA-Ž0-9\\s,.]+';
  drzavaPattern = '[a-žA-Ž]+';
  telefonPattern = '[0-9]+';

  imeValid = false;
  prezimeValid = false;
  lozinkaValid = false;
  adresaValid = false;
  drzavaValid = false;
  telefonValid = false;

  provjeriPattern(pattern: string, value: string) {
    return new RegExp(`^${pattern}$`).test(value);
  }

  provjeriIme() {
    if (this.korisnik.ime === '') {
      this.imeValid = true;
    } else {
      this.imeValid = this.provjeriPattern(this.imePattern, this.korisnik.ime);
      console.log(this.imeValid);
    }
  }

  provjeriPrezime() {
    if (this.korisnik.prezime === '') {
      this.prezimeValid = true;
    } else {
      this.prezimeValid = this.provjeriPattern(
        this.prezimePattern,
        this.korisnik.prezime
      );
    }
  }

  provjeriLozinku() {
    this.lozinkaValid = this.provjeriPattern(
      this.lozinkaPattern,
      this.korisnik.lozinka
    );
  }

  provjeriAdresu() {
    if (this.korisnik.adresa === '') {
      this.adresaValid = true;
    } else {
      this.adresaValid = this.provjeriPattern(
        this.adresaPattern,
        this.korisnik.adresa
      );
    }
  }

  provjeriDrzavu() {
    if (this.korisnik.drzava === '') {
      this.drzavaValid = true;
    } else {
      this.drzavaValid = this.provjeriPattern(
        this.drzavaPattern,
        this.korisnik.drzava
      );
    }
  }

  provjeriTelefon() {
    if (this.korisnik.telefon === '') {
      this.telefonValid = true;
    } else {
      this.telefonValid = this.provjeriPattern(
        this.telefonPattern,
        this.korisnik.telefon
      );
    }
  }

  provjeriRegexe(): boolean {
    if (
      this.imeValid &&
      this.prezimeValid &&
      this.lozinkaValid &&
      this.adresaValid &&
      this.drzavaValid &&
      this.telefonValid
    ) {
      return true;
    } else {
      return false;
    }
  }

  pozoviProvjere() {
    this.provjeriIme();
    this.provjeriPrezime();
    this.provjeriLozinku();
    this.provjeriAdresu();
    this.provjeriDrzavu();
    this.provjeriTelefon();
  }

  constructor(
    private korisniciService: KorisniciService,
    private cookieService: CookieService,
    private autentifikacijaService: AutentifikacijaService,
    private router: Router,
    private recaptchaV3Service: ReCaptchaV3Service,
    private httpClient: HttpClient
  ) {}

  public send(form: NgForm): void {
    if (this.korisnik.lozinka < 3) {
      alert('Unesite lozinku prije nego što ažurirate profil.');
      return;
    }
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

        this.azurirajProfil();
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

  ngOnInit(): void {
    if (this.autentifikacijaService.jePrijavljen()) {
      const korisnickoIme = this.dohvatiKorisnickoImeIzKolacica();
      if (korisnickoIme) {
        this.korisniciService.dohvatiKorisnika(korisnickoIme).subscribe(
          (data) => {
            this.korisnik = data;
            this.korisnik.lozinka = '';
          },
          (error) => {
            console.error('Greška prilikom dohvaćanja korisnika:', error);
          }
        );
      }
    } else {
      alert('Niste prijavljeni.');
      this.router.navigate(['/pocetna']);
    }
  }

  azurirajProfil(): void {
    this.pozoviProvjere();
    if (!this.provjeriRegexe()) {
      alert('Nepravilno uneseni podaci!');
      return;
    }
    const spremiGumb = document.getElementById('azurirajProfil');

    if (spremiGumb) {
      spremiGumb.innerText = 'Ažurirano!';

      setTimeout(() => {
        spremiGumb.innerText = 'Ažuriraj podatke';
      }, 2000);
    }
    const korisnickoIme = this.dohvatiKorisnickoImeIzKolacica();
    if (korisnickoIme) {
      if (
        this.korisnik.dvorazinskaAutentifikacija &&
        !this.korisnik.prikazanKljuc
      ) {
        this.prikaziTOTP();
      } else if (
        this.korisnik.dvorazinskaAutentifikacija &&
        this.korisnik.prikazanKljuc
      ) {
        console.log('Ukljucen 2FA / vec prikazan TOTP');
        this.korisniciService
          .azurirajKorisnika(korisnickoIme, this.korisnik)
          .subscribe(
            (data) => {
              console.log('Profil ažuriran uspješno:', data);
            },
            (error) => {
              console.error('Greška prilikom ažuriranja profila:', error);
            }
          );
      } else if (!this.korisnik.dvorazinskaAutentifikacija) {
        console.log('Iskljucen 2FA');
        this.korisniciService
          .azurirajKorisnika(korisnickoIme, this.korisnik)
          .subscribe(
            (data) => {
              console.log('Profil ažuriran uspješno:', data);
            },
            (error) => {
              console.error('Greška prilikom ažuriranja profila:', error);
            }
          );
      }
    }
  }

  private prikaziTOTP(): void {
    // Primjer upotrebe
    const tajniKljuc = this.generateRandomSecret();
    alert('Generirana nasumična tajna: ' + tajniKljuc);

    this.korisnik.TOTPkljuc = tajniKljuc;
    this.korisnik.prikazanKljuc = true;

    const korisnickoIme = this.dohvatiKorisnickoImeIzKolacica();
    if (korisnickoIme) {
      this.korisniciService
        .azurirajKorisnika(korisnickoIme, this.korisnik)
        .subscribe(
          (data) => {
            console.log('Profil ažuriran uspješno:', data);
          },
          (error) => {
            console.error('Greška prilikom ažuriranja profila:', error);
          }
        );
    }
  }
  availableSecrets = ['7befk', 'mpa62', 'bap7k', 'e26em', 'qcuhe'];

  private generateRandomSecret(): string {
    const randomIndex = Math.floor(
      Math.random() * this.availableSecrets.length
    );

    return this.availableSecrets[randomIndex];
  }

  private dohvatiKorisnickoImeIzKolacica(): string | null {
    const korisnickoIme = this.cookieService.get('korimePrijave');
    return korisnickoIme || null;
  }
}
