import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { KorisniciService } from '../servisi/korisnici.service';
import { NgForm } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.scss'],
})
export class RegistracijaComponent {
  korisnik = {
    korime: '',
    ime: '',
    prezime: '',
    email: '',
    lozinka: '',
    adresa: '',
    drzava: '',
    telefon: '',
  };

  zastavica: boolean = true;

  korisnickoImePattern = '[a-žA-Ž0-9]{3,}';
  imePattern = '[a-žA-Ž]+';
  prezimePattern = '[a-žA-Ž]+';
  emailPattern = '[^\\s@]+@[^\\s@]+\\.[^\\s@]{1,}';
  lozinkaPattern = '[a-žA-Ž0-9]{3,}';
  adresaPattern = '[a-žA-Ž0-9\\s,.]+';
  drzavaPattern = '[a-žA-Ž]+';
  telefonPattern = '[0-9]+';

  korisnickoImeValid = false;
  imeValid = true;
  prezimeValid = true;
  emailValid = false;
  lozinkaValid = false;
  adresaValid = true;
  drzavaValid = true;
  telefonValid = true;

  provjeriPattern(pattern: string, value: string) {
    return new RegExp(`^${pattern}$`).test(value);
  }

  provjeriKorisnickoIme() {
    this.korisnickoImeValid = this.provjeriPattern(
      this.korisnickoImePattern,
      this.korisnik.korime
    );
  }

  provjeriIme() {
    if (this.korisnik.ime === '') {
      this.imeValid = true;
    } else {
      this.imeValid = this.provjeriPattern(this.imePattern, this.korisnik.ime);
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

  provjeriEmail() {
    this.emailValid = this.provjeriPattern(
      this.emailPattern,
      this.korisnik.email
    );
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
      this.korisnickoImeValid &&
      this.imeValid &&
      this.prezimeValid &&
      this.emailValid &&
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

  constructor(
    private korisniciService: KorisniciService,
    private router: Router,
    private httpClient: HttpClient,
    private recaptchaV3Service: ReCaptchaV3Service
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

        this.submitForm();
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

  submitForm(): void {
    if (this.provjeriRegexe()) {
      const tijelo = {
        korime: this.korisnik.korime,
        ime: this.korisnik.ime,
        prezime: this.korisnik.prezime,
        email: this.korisnik.email,
        lozinka: this.korisnik.lozinka,
        adresa: this.korisnik.adresa,
        drzava: this.korisnik.drzava,
        telefon: this.korisnik.telefon,
      };

      this.korisniciService.registracijaKorisnika(tijelo).subscribe(
        (rezultat) => {
          console.log('Uspješna registracija!');
        },
        (greska) => {
          console.log('Greška prilikom registracije!');
        }
      );
      if (this.zastavica) this.router.navigate(['/prijava']);
    } else {
      alert('Nepravilno uneseni podaci!');
    }
  }
}
