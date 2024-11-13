import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { Package } from '../models/package';
import { CommonModule } from '@angular/common';
import { KgToGramsPipe } from '../kg-to-grams.pipe';

@Component({
  selector: 'app-delete-package',
  standalone: true,
  imports: [CommonModule, KgToGramsPipe],  // Import the pipe and CommonModule
  templateUrl: './delete-package.component.html',
  styleUrls: ['./delete-package.component.css']
})
export class DeletePackageComponent implements OnInit {

  packages: Package[] = [];  // List of packages
  errorMessage: string = '';  // For error handling

  constructor(private dbService: DatabaseService, private router: Router) { }

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

  // Delete a package by its package_id
  deletePackage(_id: string): void {
    if (confirm('Are you sure you want to delete this package?')) {
      this.dbService.deletePackage(_id).subscribe({
        next: () => {
          this.loadPackages();  // Reload packages after deletion
        },
        error: (err) => {
          console.error('Error deleting package', err);
          this.errorMessage = 'Failed to delete package: ' + (err.error.message || err.message);
        }
      });
    }
  }

  // Redirect to the list of packages after deletion
  goToListPackages(): void {
    this.router.navigate(['/list-packages']);
  }
}
