import { Links } from './links';

export class ObjectWithLinks {
  _links?: Links;
  [key: string]: Object;
}
