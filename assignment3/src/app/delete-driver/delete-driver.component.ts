import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { Driver } from '../models/driver';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-driver',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-driver.component.html',
  styleUrls: ['./delete-driver.component.css']
})
export class DeleteDriverComponent implements OnInit {

  drivers: Driver[] = [];  // List of drivers
  errorMessage: string = '';  // For error handling

  constructor(private dbService: DatabaseService, private router: Router) { }

  ngOnInit(): void {
    this.loadDrivers();  // Load drivers when the component initializes
  }

  // Fetch the list of drivers
  loadDrivers(): void {
    this.dbService.getDrivers().subscribe({
      next: (data: any) => {
        if (data && data.drivers) {
          this.drivers = data.drivers;  // Extract the drivers from the response
        } else {
          this.errorMessage = 'No drivers found';
        }
      },
      error: (err) => {
        console.error('Error fetching drivers', err);
        this.errorMessage = 'Failed to load drivers: ' + (err.error.message || err.message);
      }
    });
  }

  // Delete a driver by its driver_id
  deleteDriver(_id: string): void {
    if (confirm('Are you sure you want to delete this driver and their associated packages?')) {
      this.dbService.deleteDriver(_id).subscribe({
        next: () => {
          this.loadDrivers();  // Reload drivers after deletion
          this.goToDriverList()
        },
        error: (err) => {
          console.error('Error deleting driver', err);
          this.errorMessage = 'Failed to delete driver: ' + (err.error.message || err.message);
        }
      });
    }
  }

  // Navigate back to the driver list
  goToDriverList(): void {
    this.router.navigate(['/list-drivers']);
  }
}
