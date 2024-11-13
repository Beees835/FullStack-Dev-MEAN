import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgOptimizedImage
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}  // Inject the Router

  onLogin() {
    this.authService.login(this.email, this.password)
      .then(() => {
        console.log('Logged in successfully');
        this.router.navigate(['/home']);  // Redirect to home page after login
      })
      .catch(err => {
        console.error('Login error:', err);
      });
  }
}
