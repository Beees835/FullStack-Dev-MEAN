import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})

export class StatisticsComponent implements OnInit {

  driverCount: number | null = null;
  packageCount: number | null = null;
  statsData: any = null;  // Now it can be any type
  errorMessage: string = '';

  constructor(private dbService: DatabaseService) { }

  ngOnInit(): void {
    // Fetch the statistics when the component loads
    this.dbService.getStats().subscribe({
      next: (data: any) => {  // No strict typing
        this.driverCount = data.driverCount;
        this.packageCount = data.packageCount;
        this.statsData = data;
      },
      error: (err) => {
        console.error('Error fetching stats:', err);
        this.errorMessage = 'Failed to load statistics. Please try again later.';
      }
    });
  }
}
