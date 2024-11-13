import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { UppercasePipe } from '../uppercase.pipe';  // Import the custom pipe
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-drivers',
  standalone: true,
  imports: [UppercasePipe, CommonModule],  // Import the pipe here
  templateUrl: './list-drivers.component.html',
  styleUrls: ['./list-drivers.component.css']
})
export class ListDriversComponent implements OnInit {

  drivers: any[] = [];
  errorMessage: string = '';
  selectedDriverPackages: any[] | null = null;  // Holds the packages for the selected driver
  selectedDriverId: string = '';  // The driver currently selected to show packages
  noPackagesMessage: string = '';  // Message when no packages are found

  constructor(private dbService: DatabaseService) { }

  ngOnInit(): void {
    // Fetch the drivers when the component loads
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

  // Fetch packages for a driver
  fetchDriverPackages(driverId: string): void {
    this.selectedDriverId = driverId;  // Set the selected driver ID
    this.dbService.getPackagesByDriverId(driverId).subscribe({
      next: (packages: any[]) => {
        this.selectedDriverPackages = packages;  // Show the packages
        this.noPackagesMessage = '';  // Clear any previous message
      },
      error: (err) => {
        if (err.status === 404) {
          this.noPackagesMessage = 'No Packages Found';
          this.selectedDriverPackages = null;  // No packages to show
        } else {
          this.errorMessage = 'Failed to load packages: ' + (err.error.message || err.message);
        }
      }
    });
  }

  // Reset the view
  resetPackagesView(): void {
    this.selectedDriverPackages = null;
    this.noPackagesMessage = '';
    this.selectedDriverId = '';
  }
}
