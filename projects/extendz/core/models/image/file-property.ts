import { Property } from '../property';

export class FileProperty {
  file: File;
  property: Property;
  target?: HTMLInputElement;
  name?: string;
}
