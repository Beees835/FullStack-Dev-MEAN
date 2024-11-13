import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Package } from './models/package';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

const API_URL = '/api';


@Injectable({
  providedIn: 'root'  // This makes the service available across the app
})
export class DatabaseService {
  constructor(private http: HttpClient, private router: Router) {}

  // Fetch all the drivers from backend
  getDrivers() {
    return this.http.get(API_URL + '/drivers');
  }

  // Fetch statistics from backend
  getStats() {
    return this.http.get(API_URL + '/stats');
  }

  // Add a driver
  addDriver(driver: any): Observable<any> {
    return this.http.post(API_URL + '/add-driver', driver, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.router.navigate(['/invalid-data']); // Redirect to "Invalid Data" on 400 error
        }
        return throwError(() => new Error('An error occurred while adding the driver.'));
      })
    );
  }

  // Delete a driver by ID
  deleteDriver(_id: string): Observable<any> {
    return this.http.delete(`${API_URL}/delete-driver/${_id}`, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.router.navigate(['/invalid-data']); // Redirect to "Invalid Data" on 400 error
        }
        return throwError(() => new Error('An error occurred while deleting the driver.'));
      })
    );
  }


  // Update driver information
  updateDriver(_id: string, driverLicence: string, driverDepartment: string): Observable<any> {
    return this.http.put(`${API_URL}/update-driver`, {
      _id: _id,
      driver_licence: driverLicence,
      driver_department: driverDepartment
    }, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.router.navigate(['/invalid-data']); // Redirect to "Invalid Data" on 400 error
        }
        return throwError(() => new Error('An error occurred while updating the driver.'));
      })
    );
  }

  // Add a package
  addPackage(packageData: Package): Observable<any> {
    return this.http.post(`${API_URL}/add-package`, packageData, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.router.navigate(['/invalid-data']); // Redirect to "Invalid Data" on 400 error
        }
        return throwError(() => new Error('An error occurred while adding the package.'));
      })
    );
  }

  // Get all packages
  getPackages() {
      return this.http.get(`${API_URL}/packages`);
  }

  // Delete a package by ID
  deletePackage(_id: string): Observable<any> {
    return this.http.delete(`${API_URL}/delete-package/${_id}`, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.router.navigate(['/invalid-data']); // Redirect to "Invalid Data" on 400 error
        }
        return throwError(() => new Error('An error occurred while deleting the package.'));
      })
    );
  }

  // Update package information
  updatePackage(package_id: string, package_destination: string): Observable<any> {
    return this.http.put(`${API_URL}/update-package`, { package_id, package_destination }, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.router.navigate(['/invalid-data']); // Redirect to "Invalid Data" on 400 error
        }
        return throwError(() => new Error('An error occurred while updating the package.'));
      })
    );
  }

  // Fetch packages assigned to a driver by driver ID
  getPackagesByDriverId(_id: string): Observable<any> {
    return this.http.get(`${API_URL}/get-packages-by-driver-id/${_id}`);
  }

  // Fetch driver details by driver ID
  getDriverById(_id: string): Observable<any> {
    return this.http.get(`${API_URL}/get-driver-by-id/${_id}`);
  }
}
