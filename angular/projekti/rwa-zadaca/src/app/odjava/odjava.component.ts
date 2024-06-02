import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-odjava',
  template: '',
})
export class OdjavaComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.obrisiKolacic('korimePrijave');
    this.obrisiLocalStoragePodatke();

    this.router.navigate(['/prijava']);
  }

  obrisiKolacic(ime: string): void {
    document.cookie = `${ime}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  obrisiLocalStoragePodatke(): void {
    window.localStorage.removeItem('korisnikPodaci');
    window.localStorage.clear();
  }
}
