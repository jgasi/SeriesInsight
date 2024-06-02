import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, Routes } from '@angular/router';
import { KorisniciComponent } from './korisnici/korisnici.component';
import { KorisniciService } from './servisi/korisnici.service';
import { PrijavaComponent } from './prijava/prijava.component';
import { OdjavaComponent } from './odjava/odjava.component';
import { FavoritiComponent } from './favoriti/favoriti.component';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ProfilComponent } from './profil/profil.component';
import { FavoritiService } from './servisi/favoriti.service';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { PocetnaService } from './servisi/pocetna.service';
import { SerijaDetaljiComponent } from './serija-detalji/serija-detalji.component';
import { SerijaService } from './servisi/serije.service';
import { FavoritDetaljiComponent } from './favorit-detalji/favorit-detalji.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { UlogeGuard } from './guards/uloge-auth.guard';
import { AutentifikacijaService } from './servisi/autentifikacija.service';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from '../environments/environment';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TotpProvjeraComponent } from './totp-provjera/totp-provjera.component';
import { GitHubPrijavaComponent } from './github-prijava/github-prijava.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';
import { DnevnikComponent } from './dnevnik/dnevnik.component';

const routes: Routes = [
  { path: '', redirectTo: 'pocetna', pathMatch: 'full' },
  { path: 'prijava', component: PrijavaComponent },
  { path: 'odjava', component: OdjavaComponent },
  { path: 'favoriti', component: FavoritiComponent },
  { path: 'profil', component: ProfilComponent },
  { path: 'pocetna', component: PocetnaComponent },
  { path: 'detalji-serije/:id', component: SerijaDetaljiComponent },
  { path: 'favorit-detalji/:id', component: FavoritDetaljiComponent },
  {
    path: 'registracija',
    component: RegistracijaComponent,
    canActivate: [UlogeGuard],
  },
  {
    path: 'korisnici',
    component: KorisniciComponent,
    canActivate: [UlogeGuard],
  },
  { path: 'dokumentacija', component: DokumentacijaComponent },
  { path: 'totp-provjera', component: TotpProvjeraComponent },
  { path: 'github-prijava', component: GitHubPrijavaComponent },
  { path: 'dnevnik', component: DnevnikComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    KorisniciComponent,
    PrijavaComponent,
    OdjavaComponent,
    FavoritiComponent,
    ProfilComponent,
    PocetnaComponent,
    SerijaDetaljiComponent,
    FavoritDetaljiComponent,
    RegistracijaComponent,
    DokumentacijaComponent,
    TotpProvjeraComponent,
    GitHubPrijavaComponent,
    DnevnikComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    CommonModule,
    FormsModule,
    RecaptchaV3Module,
    NgxCaptchaModule,
    OAuthModule.forRoot(),
  ],
  providers: [
    KorisniciService,
    CookieService,
    FavoritiService,
    PocetnaService,
    SerijaService,
    AutentifikacijaService,
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptchaSiteKey,
    },
    { provide: authConfig, useValue: authConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
