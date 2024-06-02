import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-github-prijava',
  templateUrl: './github-prijava.component.html',
  styleUrls: ['./github-prijava.component.scss'],
})
export class GitHubPrijavaComponent {
  constructor(private oauthService: OAuthService) {}

  loginWithGitHub() {
    const clientId = '6b684f6388c4761878b1';
    const redirectUri = 'http://localhost:12012/';

    var uspjeh =
      (window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`);

    if (uspjeh) {
      this.obrisiKolacic('korimePrijave');
      this.localStoragePrijava();
    } else {
      console.log('GitHub prijava neuspješna!');
    }
  }

  public localStoragePrijava() {
    const prijavljeniKorisnik = { ime: 'Prijavljen', prezime: 'GitHub' };
    localStorage.setItem('korisnikPodaci', JSON.stringify(prijavljeniKorisnik));
  }

  obrisiKolacic(ime: string): void {
    document.cookie = `${ime}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
