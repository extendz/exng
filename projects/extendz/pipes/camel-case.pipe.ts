import { Pipe, PipeTransform } from '@angular/core';

/**
 * Changes the case of the first letter of a given number of words in a string.
 * @author Randika Hapugoda
 */
@Pipe({ name: 'camelCase', pure: false })
export class CamelCasePipe implements PipeTransform {
  transform(input: string): string {
    if (input == undefined) return '';
    return input.charAt(0).toUpperCase() + input.substring(1).replace(/[A-Z]/g, ' $&');
  } // transform
} // class
