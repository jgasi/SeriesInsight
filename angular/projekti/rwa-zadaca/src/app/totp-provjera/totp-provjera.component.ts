import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { KorisniciService } from '../servisi/korisnici.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-totp-provjera',
  templateUrl: './totp-provjera.component.html',
  styleUrls: ['./totp-provjera.component.scss'],
})
export class TotpProvjeraComponent implements OnInit {
  korisnickoIme: any;
  totp: any;
  poruka: any;

  constructor(
    private korisniciService: KorisniciService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.korisnickoIme = this.dohvatiKorisnickoImeIzKolacicaProvjere();
  }

  provjeriTOTP(form: NgForm): void {
    if (form.invalid) {
      this.poruka = 'Unesite ispravan TOTP.';
      return;
    }

    this.korisniciService.provjeriTOTP(this.korisnickoIme, this.totp).subscribe(
      (response) => {
        console.log(response);
        this.poruka = response.message;
        this.postaviKolacic();
        this.router.navigate(['/pocetna']);
      },
      (error) => {
        console.error(error);
        this.poruka = 'Došlo je do greške prilikom provjere TOTP-a.';
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

  private dohvatiKorisnickoImeIzKolacica(): string | null {
    const korisnickoIme = this.cookieService.get('korimePrijave');
    return korisnickoIme || null;
  }

  private dohvatiKorisnickoImeIzKolacicaProvjere(): string | null {
    const korisnickoIme = this.cookieService.get('korimeProvjere');
    return korisnickoIme || null;
  }
}
