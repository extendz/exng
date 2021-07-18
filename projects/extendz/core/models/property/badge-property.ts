import { Property } from '../property';

export class BadgeProperty extends Property {
  colors: {
    [key: string]: string;
  };
}
