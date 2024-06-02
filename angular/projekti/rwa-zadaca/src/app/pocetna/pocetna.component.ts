import { Component, OnInit } from '@angular/core';
import { PocetnaService } from '../servisi/pocetna.service';
import { Router } from '@angular/router';
import {
  OAuthService,
  OAuthResourceServerConfig,
  OAuthEvent,
} from 'angular-oauth2-oidc';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.scss'],
})
export class PocetnaComponent implements OnInit {
  serije: any[] = [];
  filter: string = '';
  stranica: number = 1;
  ukupno: number = 1;

  constructor(
    private pocetnaService: PocetnaService,
    private router: Router,
    private oauthService: OAuthService
  ) {}

  ngOnInit(): void {
    this.dohvatiSerije();
  }

  pretrazi() {
    if (this.filter.length >= 3) {
      this.dohvatiSerije();
    } else {
      this.serije = [];
    }
  }

  dohvatiSerije() {
    if (this.filter.length < 3) {
      return;
    }

    this.pocetnaService
      .dajSerije(this.stranica, this.filter)
      .subscribe((podaci) => {
        this.serije = podaci.results;
        this.ukupno = podaci.total_pages;
      });
  }

  promijeniStranicu(novaStranica: number) {
    if (novaStranica > 0 && novaStranica <= this.ukupno) {
      this.stranica = novaStranica;
      this.dohvatiSerije();
    }
  }

  prikaziSerijaDetaljiStranicu(idSerije: number) {
    this.router.navigate(['/detalji-serije', idSerije]);
  }
}
