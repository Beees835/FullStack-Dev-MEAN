import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { AuthService } from '../auth.service';  // Import AuthService
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {

  driverCount: number | null = null;
  packageCount: number | null = null;
  statsData: any = null;
  errorMessage: string = '';
  isAuthenticated: boolean = false;  // Track authenticated state

  constructor(private dbService: DatabaseService, private authService: AuthService) { }

  ngOnInit(): void {
    // Subscribe to the authentication state (now returning an observable)
    this.authService.isLoggedIn().subscribe(user => {
      this.isAuthenticated = !!user;  // Set authenticated state based on user presence
    });

    // Fetch the statistics when the component loads
    this.dbService.getStats().subscribe({
      next: (data: any) => {
        this.driverCount = data.driverCount;
        this.packageCount = data.packageCount;
        this.statsData = data;
      },
      error: (err) => {
        console.error('Error fetching stats:', err);
        this.errorMessage = 'Failed to load statistics. Please try again later.';
      }
    });
  }

  // SignOut method
  onSignOut() {
    this.authService.logout().then(() => {
      console.log('Logged out successfully');
    }).catch(err => {
      console.error('Logout error:', err);
    });
  }
}
