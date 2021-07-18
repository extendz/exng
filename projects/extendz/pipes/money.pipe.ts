import { Pipe, PipeTransform } from '@angular/core';
import { Price } from 'extendz/core';

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(price: Price, ...args: unknown[]): unknown {
    if (price.currency) return `${price.currency.code} ${price.value}`;
    return price.value;
  }
}
