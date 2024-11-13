import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Package } from '../models/package';  // Import the Package model
import { Driver } from '../models/driver';    // Import the Driver model
import { CommonModule } from '@angular/common';
import { KgToGramsPipe } from '../kg-to-grams.pipe';

@Component({
  standalone: true,
  selector: 'app-list-packages',
  templateUrl: './list-packages.component.html',
  imports: [CommonModule, KgToGramsPipe],  // Import the pipe and CommonModule
  styleUrls: ['./list-packages.component.css']
})
export class ListPackagesComponent implements OnInit {

  packages: Package[] = [];  // Array to store fetched packages
  selectedDriver: Driver | null = null; // Driver details of the selected package
  errorMessage: string = '';  // Error handling for packages
  driverErrorMessage: string = ''; // Error handling for driver details
  package: any;

  constructor(private dbService: DatabaseService) {}

  ngOnInit(): void {
    this.loadPackages();  // Load packages when the component initializes
  }

  // Fetch all packages
  loadPackages(): void {
    this.dbService.getPackages().subscribe({
      next: (data: any) => {
        this.packages = data;
      },
      error: (err) => {
        console.error('Error fetching packages', err);
        this.errorMessage = 'Failed to load packages: ' + (err.error.message || err.message);
      }
    });
  }

  // Fetch driver details for a specific package
  fetchDriverDetails(driverId: string): void {
    // Reset previous driver data
    this.selectedDriver = null;
    this.driverErrorMessage = '';

    if (driverId) {
      this.dbService.getDriverById(driverId).subscribe({
        next: (data: any) => {
          this.selectedDriver = data;
        },
        error: (err) => {
          console.error('Error fetching driver details', err);
          this.driverErrorMessage = 'Failed to load driver details: ' + (err.error.message || err.message);
        }
      });
    } else {
      this.driverErrorMessage = 'No driver assigned to this package.';
    }
  }
}
