import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map(user => {
        if (user) {
          return true;  // Allow access if authenticated
        } else {
          this.router.navigate(['/login']);  // Redirect to login if not authenticated
          return false;
        }
      })
    );
  }
}
