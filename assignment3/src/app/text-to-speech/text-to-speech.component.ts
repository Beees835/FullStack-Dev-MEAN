import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { Driver } from '../models/driver';  // Assuming you have a Driver model
import { DatabaseService } from '../database.service';  // Assuming you have a service for API calls
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-to-speech',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-to-speech.component.html',
  styleUrls: ['./text-to-speech.component.css']
})
export class TextToSpeechComponent implements OnInit {

  drivers: Driver[] = [];
  audioUrl: string = '';  // This will hold the audio URL after conversion
  errorMessage: string = '';
  socket: any;

  constructor(private dbService: DatabaseService) {
    // Initialize socket connection
    const socketUrl = (window.location.hostname === 'localhost') ? 'http://localhost:3000' : 'http://34.129.255.115:3000';
    this.socket = io(socketUrl);

    // Listen for text-to-speech result from server
    this.socket.on('tts_result', (data: string) => {
      this.audioUrl = data;
    });

    // Handle errors from server
    this.socket.on('tts_error', (error: any) => {
      this.errorMessage = 'TTS error: ' + error;
    });
  }

  ngOnInit(): void {
    this.loadDrivers();
  }

  // Load drivers from the backend
  loadDrivers(): void {
    this.dbService.getDrivers().subscribe({
      next: (data: any) => {
        if (data && data.drivers) {
          this.drivers = data.drivers;  // Extract the drivers from the response
        } else {
          this.errorMessage = 'No drivers found';
        }
      },      error: err => this.errorMessage = 'Failed to load drivers'
    });
  }

  // Send the driver's license text to backend for conversion to speech
  convertTextToSpeech(license: string): void {
    this.socket.emit('text_to_speech', { text: license });
  }
}
