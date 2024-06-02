import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AutentifikacijaService } from '../servisi/autentifikacija.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UlogeGuard implements CanActivate {
  constructor(
    private autentifikacijaService: AutentifikacijaService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.autentifikacijaService.isAdmin().pipe(
      map((isAdmin) => {
        if (isAdmin) {
          return true;
        } else {
          alert('Nemate pravo pristupa.');
          this.router.navigate(['/pocetna']);
          return false;
        }
      }),
      catchError(() => {
        alert('Greška prilikom provjere prava pristupa.');
        this.router.navigate(['/pocetna']);
        return of(false);
      })
    );
  }
}
