import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {FormsModule} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    NgOptimizedImage
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onSignup() {
    this.authService.signup(this.email, this.password)
      .then(() => alert('SignUp Successfully!'))
      .catch(err => console.error('Signup error:', err));
  }
}
