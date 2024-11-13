import { Component } from '@angular/core';

@Component({
  selector: 'app-invalid-data',
  templateUrl: './invalid-data.component.html',
  styleUrls: ['./invalid-data.component.css']
})
export class InvalidDataComponent {
  message: string = 'Invalid Data was sent to the backend. Please check your inputs and try again.';
}
