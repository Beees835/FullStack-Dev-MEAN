import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercasePipe',  // Custom pipe name
  standalone: true  // Make the pipe standalone
})
export class UppercasePipe implements PipeTransform {

  // The transform method to convert a string to uppercase
  transform(value: string): string {
    if (!value) {
      return '';
    }
    return value.toUpperCase();  // Convert to uppercase
  }

}
