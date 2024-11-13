import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { io } from 'socket.io-client';
import { Package } from '../models/package';  // Assuming you have a Package model
import { DatabaseService } from '../database.service';  // Assuming you have a service for API calls
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-translate-description',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './translate-description.component.html',
  styleUrls: ['./translate-description.component.css']
})
export class TranslateDescriptionComponent implements OnInit {

  packages: Package[] = [];
  selectedLanguage: string = 'es';  // Default to Spanish
  translatedDescription: string = '';
  msg: string = '';  // This will hold the description to translate
  response: string = '';  // This will hold the translated text
  errorMessage: string = '';

  socket: any;

  languages = [
    { code: 'zh', name: 'Chinese' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' }
  ];

  constructor(private dbService: DatabaseService) {
    // Initialize the socket connection
    const socketUrl = (window.location.hostname === 'localhost') ? 'http://localhost:3000' : 'http://34.129.255.115:3000';
    this.socket = io(socketUrl);

    // Listening for translation result
    this.socket.on('translation_result', (data: any) => {
      this.translatedDescription = data;
      console.log('Translation result:', data);
    });

    // Listening for errors
    this.socket.on('translation_error', (data: any) => {
      this.errorMessage = 'Translation error: ' + data;
      console.log('Translation error:', data);
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

  // Send translation request for the selected package description
  translateDescription(description: string): void {
    // Emit the translation event with the description and target language
    this.socket.emit('translate_description', { description, targetLang: this.selectedLanguage });
  }

  // For UI interaction when the user clicks on a package's translate button
  sendMessage(description: string): void {
    console.log('Requesting translation for:', description);
    this.translateDescription(description);  // Send the translation request
  }
}
