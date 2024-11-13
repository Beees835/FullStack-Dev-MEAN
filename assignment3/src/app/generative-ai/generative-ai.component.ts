import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { Package } from '../models/package';
import { DatabaseService } from '../database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-generative-ai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generative-ai.component.html',
  styleUrls: ['./generative-ai.component.css']
})
export class GenerativeAIComponent implements OnInit {

  packages: Package[] = [];
  distance: string | null = null;
  errorMessage: string = '';
  socket: any;

  constructor(private dbService: DatabaseService) {
    this.socket = io();

    // Listen for distance result from backend
    this.socket.on('distance_result', (data: any) => {
      this.distance = data.distance;
      console.log('Distance result:', data);
    });

    // Listen for errors
    this.socket.on('distance_error', (data: any) => {
      this.errorMessage = data;
      console.error('Distance error:', data);
    });
  }

  ngOnInit(): void {
    this.loadPackages();
  }

  // Load packages from the database
  loadPackages(): void {
    this.dbService.getPackages().subscribe({
      next: (data: any) => this.packages = data,
      error: err => this.errorMessage = 'Error loading packages: ' + (err.error.message || err.message)
    });
  }

  // Send package destination to the backend for distance calculation
  calculateDistance(destination: string): void {
    console.log('Calculating distance for:', destination);
    this.socket.emit('calculate_distance', { destination });
  }
}
