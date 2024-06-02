import { Component, OnInit } from '@angular/core';
import { KorisniciService } from '../servisi/korisnici.service';

@Component({
  selector: 'app-korisnici',
  templateUrl: './korisnici.component.html',
  styleUrls: ['./korisnici.component.scss'],
})
export class KorisniciComponent implements OnInit {
  korisnici: any[] = [];
  zastavaId: any;

  constructor(private korisniciService: KorisniciService) {}

  ngOnInit(): void {
    this.dohvatiKorisnike();
  }

  dohvatiKorisnike(): void {
    this.korisniciService.dohvatiKorisnike().subscribe(
      (korisnici) => {
        this.korisnici = korisnici;
      },
      (error) => {
        console.error('Greška prilikom dohvaćanja korisnika:', error);
      }
    );
  }

  obrisiKorisnika(korisnik: any): void {
    if (korisnik.tip_korisnika_id === 2) {
      alert('Nije moguće obrisati admina.');
    } else {
      const potvrda = confirm(
        `Jeste li sigurni da želite obrisati korisnika ${korisnik.korime}?`
      );

      if (potvrda) {
        this.korisniciService.obrisiKorisnika(korisnik.korime).subscribe(
          () => {
            this.dohvatiKorisnike();
          },
          (error) => {
            console.error('Greška prilikom brisanja korisnika:', error);
          }
        );
      }
    }
  }
}
