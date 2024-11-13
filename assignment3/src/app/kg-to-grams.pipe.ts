import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kgToGrams',
  standalone: true  // Ensure the pipe is standalone
})
export class KgToGramsPipe implements PipeTransform {
  transform(value: number): string {
    if (!value && value !== 0) {
      return '';
    }
    const grams = value * 1000;  // Convert KG to grams
    return `${grams}g`;  // Append 'g'
  }
}
