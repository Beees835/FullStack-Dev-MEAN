import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { ActivatedRoute } from '@angular/router';  // To retrieve the package_id from the route
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-update-package',
  templateUrl: './update-package.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./update-package.component.css']
})
export class UpdatePackageComponent implements OnInit {
  package_id: string = '';  // Package ID from route or form input
  package_destination: string = '';  // New destination to update
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private dbService: DatabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get package ID from the route params (if applicable)
    this.package_id = this.route.snapshot.paramMap.get('package_id') || '';
  }

  // Method to handle the form submission and update the package
  updatePackage(): void {
    if (this.package_id && this.package_destination) {
      this.dbService.updatePackage(this.package_id, this.package_destination).subscribe({
        next: (response) => {
          this.successMessage = 'Package updated successfully!';
          this.router.navigate(['/list-packages']);  // Redirect to the list of packages after update
        },
        error: (err) => {
          console.error('Error updating the package:', err);
          this.errorMessage = 'Failed to update the package: ' + (err.error.message || err.message);
        }
      });
    } else {
      this.errorMessage = 'Please provide a valid package ID and destination.';
    }
  }
}
