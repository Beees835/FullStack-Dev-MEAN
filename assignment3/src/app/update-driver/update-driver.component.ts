import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-update-driver',
  templateUrl: './update-driver.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./update-driver.component.css']
})
export class UpdateDriverComponent {
  _id: string = '';  // Input field for driver ID
  driverLicence: string = '';  // Input field for driver licence
  driverDepartment: string = '';  // Input field for driver department
  successMessage: string = '';  // Message to show on success
  errorMessage: string = '';  // Message to show on error

  constructor(private dbService: DatabaseService, private router: Router) {}

  updateDriver() {
    // Validate fields
    if (!this._id || !this.driverLicence || !this.driverDepartment) {
      this.errorMessage = 'All fields are required';
      return;
    }

    // Call the service to update the driver
    this.dbService.updateDriver(this._id, this.driverLicence, this.driverDepartment).subscribe({
      next: (response) => {
        this.successMessage = 'Driver updated successfully!';
        // Redirect to list-drivers after a successful update
        this.router.navigate(['/list-drivers']);
      },
      error: (err) => {
        console.error('Error updating driver:', err);
        this.errorMessage = 'Failed to update driver: ' + (err.error.message || err.message);
      }
    });
  }
}
