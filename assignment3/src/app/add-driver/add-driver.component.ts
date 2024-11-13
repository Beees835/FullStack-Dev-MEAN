import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../database.service';  // Assuming you have this service
import { Router } from '@angular/router';

// Assuming you have a Driver model similar to your Car model
import { Driver } from '../models/driver';

@Component({
  selector: 'app-add-driver',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-driver.component.html',
  styleUrl: './add-driver.component.css'
})
export class AddDriverComponent {

  driver: Driver = new Driver();  // Initialize an empty Driver object
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private db: DatabaseService, private router: Router) { }

  addDriver() {
    console.log('Adding driver', this.driver);
    this.db.addDriver(this.driver).subscribe({
      next: (data: any) => {
        console.log('Driver added successfully', data);
        this.successMessage = 'Driver added successfully!';
        this.router.navigate(['list-drivers']);  // Navigate to the list of drivers after adding
      },
      error: (err) => {
        console.error('Error adding driver', err);
        this.errorMessage = 'Failed to add driver: ' + err.error.message;
      }
    });
  }
}
