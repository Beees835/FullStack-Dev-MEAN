import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../database.service';  // Import your service
import { Package } from '../models/package';  // Import the Package model
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Driver } from '../models/driver';

@Component({
  standalone: true,
  selector: 'app-add-package',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.css']
})

export class AddPackageComponent {
  package: Package = new Package();  // Initialize an empty Package object
  drivers: Driver[] = [];  // Array to hold the list of drivers
  successMessage: string = '';  // Success message after adding the package
  errorMessage: string = '';  // Error message in case of failure

  constructor(private dbService: DatabaseService, private router: Router) {}

  ngOnInit(): void {
    this.loadDrivers();  // Fetch drivers when component initializes
  }

  // Fetch drivers from the API
  loadDrivers(): void {
    this.dbService.getDrivers().subscribe({
      next: (data: any) => {
        if (data && data.drivers) {
          this.drivers = data.drivers;  // Extract the drivers from the response
        }
      },
      error: (err) => {
        console.error('Error fetching drivers:', err);
        this.errorMessage = 'Failed to load drivers';
      }
    });
  }

  // Method to handle form submission
  addPackage() {
    if (this.package.package_title && this.package.package_weight && this.package.package_destination) {
      this.dbService.addPackage(this.package).subscribe({
        next: (response) => {
          this.successMessage = 'Package added successfully!';
          this.router.navigate(['/list-packages']);  // Redirect to package list on success
        },
        error: (err) => {
          console.error('Error adding package:', err);
          this.errorMessage = 'Failed to add package: ' + (err.error.message || err.message);
        }
      });
    } else {
      this.errorMessage = 'All fields are required';
    }
  }
}
